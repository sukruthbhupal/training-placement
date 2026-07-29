from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Load model
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

# Take input from user
sentence = input("The food was amazing and the service was excellent! I will definitely come back again. ")

prompt = f"""
Classify the sentiment of the following sentence as Positive, Neutral, or Negative.

Sentence: {sentence}
Sentiment:
"""

inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=5)

result = tokenizer.decode(outputs[0], skip_special_tokens=True)

print("\nPredicted Sentiment:", result)

from transformers import pipeline

generator = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-0.5B-Instruct"
)

messages = [
    {
        "role": "user",
        "content": """
Classify the sentiment.

Examples:
Sentence: I hate Coorg!
Sentiment: NEGATIVE

Sentence: I hate this product!
Sentiment: NEGATIVE

Sentence: The city is okay.
Sentiment: NEUTRAL

Now classify:

Sentence: The pork in Coorg is fantastic.
Sentiment:
"""
    }
]

result = generator(
    messages,
    max_new_tokens=20,
    do_sample=False
)

print(result[0]["generated_text"][-1]["content"])

# build a program to calculate mean, max, min using numpy
import numpy as np

data = np.array([1, 2, 3, 4, 5])
print("Mean:", np.mean(data))
print("Max:", np.max(data))
print("Min:", np.min(data))


# build a program to calculate mean, max, min using pandas
import pandas as pd

data = pd.Series([1, 2, 3, 4, 5])
print("Mean:", data.mean())
print("Max:", data.max())
print("Min:", data.min())

#build a code for matplotlib to plot a simple line graph
import matplotlib.pyplot as plt 
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]
plt.plot(x, y)
plt.title("Simple Line Graph")
plt.xlabel("X-axis")
plt.ylabel("Y-axis")
plt.show()

#building a simple code for tensorflow 
import tensorflow as tf
# Create a constant tensor
tensor = tf.constant([[1, 2], [3, 4]])
# Perform a simple operation (matrix multiplication)
result = tf.matmul(tensor, tensor)
print("Result of matrix multiplication:\n", result)
