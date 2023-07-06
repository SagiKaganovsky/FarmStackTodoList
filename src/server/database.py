from dotenv import load_dotenv
from uuid import uuid4
import os
from model import Todo
# MongoDB driver
import motor.motor_asyncio

# Load .env
load_dotenv()

client = motor.motor_asyncio.AsyncIOMotorClient(
    os.getenv("MONGODB_URL"))

database = client.TodoList
collection = database.todo


async def fetch_one_todo(title):
    document = await collection.find_one({"title": title})
    return document


async def fetch_all_todos():
    todos = []
    cursor = collection.find({})
    async for documnet in cursor:
        todos.append(Todo(**documnet))
    return todos


async def create_todo(todo):
    new_todo = Todo(id=uuid4().hex, title=todo.title,
                    description=todo.description)
    document = new_todo.dict()
    result = await collection.insert_one(document)
    return document


async def update_todo(todo):
    await collection.update_one({"id": todo.id}, {"$set": {
        "title": todo.title,
        "description": todo.description
    }})
    document = await collection.find_one({"title": todo.title})
    return Todo(**document)


async def remove_todo(id):
    await collection.delete_one({"id": id})
    return True
