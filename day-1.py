from transformers import pipeline

classifier = pipeline("sentiment-analysis")
result = classifier("I hate you")
print(result)


user ={
    "name": "John Doe",
    "city": "New York",
    "order": "Pizza"
}
print(f"Hello {user['name']} from {user['city']}, your order for {user['order']} is being processed.")
print("Thank you for your order!")

#instagram followers
instagram_followers = 100000
print(f"You have {instagram_followers} Instagram followers!")
print("you are a blue tick verified user now!")


import urllib.request
import json

url = "http://openweathermap.org/current"
with urllib.request.urlopen(url) as response:
	data = json.load(response)

print("city", data.get("name"))
main = data.get("main", {})
print("current temperature", main.get("temp"))


from transformers import pipeline

generator = pipeline("text-generation", model="gpt2")
output = generator("give me a lame jokes",max_length=40)
print(output[0]['generated_text'])