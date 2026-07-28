from transformers import pipeline

classifier = pipeline("sentiment-analysis")
result = classifier("I hate you")
print(result)
