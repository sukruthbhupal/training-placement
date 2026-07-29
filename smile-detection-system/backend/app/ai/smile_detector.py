import base64
import io
import logging
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from PIL import Image

try:
    from mediapipe.tasks.python import vision
    from mediapipe.tasks.python.vision.core import image as mp_image
except Exception:  # pragma: no cover
    vision = None
    mp_image = None

try:
    import tensorflow as tf
except Exception:  # pragma: no cover
    tf = None

logger = logging.getLogger(__name__)


class SmileDetector:
    def __init__(self) -> None:
        self.face_detector = None
        self.cv_face_cascade = None
        self.cv_smile_cascade = None
        self.model = None
        self._init_models()

    def _init_models(self) -> None:
        self.cv_face_cascade = self._load_cascade("haarcascade_frontalface_default.xml")
        self.cv_smile_cascade = self._load_cascade("haarcascade_smile.xml")

        if vision is not None and mp_image is not None:
            try:
                model_path = self._find_mediapipe_face_model()
                if model_path:
                    self.face_detector = vision.FaceDetector.create_from_model_path(model_path)
                else:
                    raise FileNotFoundError("MediaPipe face detector model not found")
            except Exception as exc:  # pragma: no cover
                logger.warning("MediaPipe face detector init failed: %s", exc)
                self.face_detector = None

        if tf is not None:
            try:
                model_path = Path(__file__).with_name("smile_model.keras")
                if model_path.exists():
                    self.model = tf.keras.models.load_model(model_path)
                else:
                    model = tf.keras.Sequential([
                        tf.keras.layers.Input(shape=(1,)),
                        tf.keras.layers.Dense(8, activation="relu"),
                        tf.keras.layers.Dense(1, activation="sigmoid"),
                    ])
                    model.compile(optimizer="adam", loss="binary_crossentropy")
                    model.save(model_path)
                    self.model = model
            except Exception as exc:  # pragma: no cover
                logger.warning("TensorFlow model init failed: %s", exc)

    def _load_cascade(self, cascade_name: str):
        path = cv2.data.haarcascades + cascade_name
        cascade = cv2.CascadeClassifier(path)
        if cascade.empty():
            logger.warning("Failed to load Haar cascade %s", path)
            return None
        return cascade

    def _find_mediapipe_face_model(self) -> str | None:
        try:
            import mediapipe as mp
        except Exception:
            return None

        package_root = Path(mp.__file__).resolve().parent
        for candidate in package_root.rglob("*face_detection*.tflite"):
            return str(candidate)
        for candidate in package_root.rglob("*.task"):
            if "face" in candidate.name.lower():
                return str(candidate)
        return None

    def _detect_faces(self, image: np.ndarray) -> list[dict[str, Any]]:
        faces = []
        if self.face_detector is not None:
            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            mp_img = mp_image.Image(image_format=mp_image.ImageFormat.SRGB, data=rgb)
            result = self.face_detector.detect(mp_img)
            if result.detections:
                for detection in result.detections:
                    bbox = detection.bounding_box
                    x, y, width, height = int(bbox.origin_x), int(bbox.origin_y), int(bbox.width), int(bbox.height)
                    faces.append({"bounding_box": [x, y, x + width, y + height]})
        elif self.cv_face_cascade is not None:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            rects = self.cv_face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            for (x, y, width, height) in rects:
                faces.append({"bounding_box": [int(x), int(y), int(x + width), int(y + height)]})
        return faces

    def _calculate_smile_score(self, image: np.ndarray, bbox: list[int]) -> tuple[bool, float]:
        x1, y1, x2, y2 = bbox
        face_img = image[max(0, y1):max(0, y2), max(0, x1):max(0, x2)]
        if face_img.size == 0:
            return False, 0.0

        gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
        if self.cv_smile_cascade is not None:
            smiles = self.cv_smile_cascade.detectMultiScale(
                gray,
                scaleFactor=1.7,
                minNeighbors=22,
                minSize=(25, 25),
            )
            if len(smiles) > 0:
                confidence = round(min(100.0, 40.0 + len(smiles) * 15.0), 2)
                return True, confidence

        mouth_openness = float(np.mean(gray)) / 255.0
        confidence = round(min(100.0, max(0.0, mouth_openness * 100)), 2)
        return confidence >= 55.0, confidence

    def detect_from_image(self, image_path: str) -> dict[str, Any]:
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError("Could not read image")
        faces = self._detect_faces(image)
        results = []
        for face in faces:
            bbox = face["bounding_box"]
            smile, confidence = self._calculate_smile_score(image, bbox)
            results.append({"smile": smile, "confidence": confidence, "bounding_box": bbox})
        return {"faces": results, "timestamp": "now"}

    def detect_from_base64(self, encoded_image: str) -> dict[str, Any]:
        image_bytes = base64.b64decode(encoded_image.split(",")[-1])
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        arr = np.array(image)
        bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
        faces = self._detect_faces(bgr)
        results = []
        for face in faces:
            bbox = face["bounding_box"]
            smile, confidence = self._calculate_smile_score(bgr, bbox)
            results.append({"smile": smile, "confidence": confidence, "bounding_box": bbox})
        return {"faces": results, "timestamp": "now"}
