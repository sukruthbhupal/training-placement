import requests
url = "https://catfact.ninja/fact"
response = requests.get(url)
print(response.json())

import requests
username =input("enter your github username: ")
url = f"https://api.github.com/users/{username}"
response = requests.get(url)
print(response.json())

import requests
student = {
    "name": "John Doe",
    "age": 20,
    "major": "Computer Science"
}   
print(student)

import random
name = input("Enter your name: ")
random.seed(name.lower())
print(random.randint(1, 100))

print(f"name: {name}")  
print(f"predicted age: {random.randint(18, 30)}")

import requests
url ="https://jsonplaceholder.typicode.com/posts"
data = {
    "title": "learning AI",
    "body": "This is a post about learning AI.",
    "userId": 1
}
response = requests.post(url, json=data)
print(response.status_code)
print(response.json())