from dotenv import load_dotenv
from model import Todo
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import (
    fetch_one_todo,
    fetch_all_todos,
    create_todo,
    update_todo,
    remove_todo
)

# Load .env
load_dotenv()

# App object
app = FastAPI()


origins = ['http://localhost:5173']

app.add_middleware(CORSMiddleware,
                   allow_origins=origins,
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/api/todo")
async def get_todo():
    response = await fetch_all_todos()
    return response


@app.get("/api/todo{title}", response_model=Todo)
async def get_todo_by_id(title):
    response = await fetch_one_todo(title)
    if response:
        return response
    raise HTTPException(404, f"There is no TODO item with this title{title}")


@app.post("/api/todo", response_model=Todo)
async def post_todo(todo: Todo):
    response = await create_todo(todo)
    if response:
        return response
    raise HTTPException(400, "Something went wrong / Bad Request")


@app.put("/api/todo")
async def put_todo(todo: Todo):
    response = await update_todo(todo)
    if response:
        return response
    raise HTTPException(404, f"There is no TODO item with this title{id}")


@app.delete("/api/todo/{id}")
async def delete_todo(id):
    response = await remove_todo(id)
    if response:
        return {"message": "Successfully deleted todo item !"}
    raise HTTPException(404, f"There is no TODO item with this title{id}")
