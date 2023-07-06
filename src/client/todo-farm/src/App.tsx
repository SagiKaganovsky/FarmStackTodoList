import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import EdiText from "react-editext";
import TrashCan from "./assets/trash.svg";
import Pencil from "./assets/pencil.svg";

import "./App.css";

function App() {
  const [editingId, setEditingId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [todos, setTodos] = useState<
    { id: string; title: string; description: string }[]
  >([]);

  const handleGetTodos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/todo");
      if (response.status === 200) {
        setTodos(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title !== "" && description !== "") {
      const todo = {
        id: "",
        title,
        description,
      };
      try {
        const response = await axios.post(
          `http://localhost:8000/api/todo`,
          todo
        );
        if (response.status === 200 && response.data) {
          setTodos([...todos, response.data]);
          setTitle("");
          setDescription("");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/todo/${todoId}`
      );
      if (response.status === 200 && response.data) {
        setTodos((prevTodos) => {
          return prevTodos.filter(({ id }) => id != todoId);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (key: string, value: string, todoId: string) => {
    const updateTodo = todos.find(({ id }) => id === todoId);
    try {
      const response = await axios.put("http://localhost:8000/api/todo", {
        ...updateTodo,
        [key]: value,
      });
      if (response.status === 200 && response.data) {
        console.log(response.data);
        handleGetTodos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetTodos();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 px-6 py-8 ring-1 ring-slate-900/5 shadow-xl min-h-screen">
      <h1 className="dark:text-white mt-5 text-base font-medium tracking-tight">
        FARM Todo List
      </h1>
      <div className="dark:text-slate-200 mt-2 text-sm">
        <form className=" mt-5" onSubmit={handleAddTodo}>
          <div className="grid gap-4 grid-flow-row dark:text-slate-500">
            <input
              className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="border-2 border-gray-300 bg-white h-24 px-5 pr-16 rounded-lg text-sm focus:outline-none"
              cols={40}
              rows={5}
              name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="submit"
              className="dark:text-slate-100 justify-self-end h-10 border-2 w-24 rounded-lg bg-cyan-900"
            >
              Add
            </button>
          </div>
        </form>
        <div className="grid gap-4 grid-flow-row auto-rows-max mt-8">
          {todos.map(({ id, title, description }) => {
            return (
              <div
                key={id}
                className="box-border md:box-content border-2 rounded-lg px-6 py-8 relative "
              >
                <img
                  src={TrashCan}
                  alt="delete"
                  className="absolute top-2 right-2 trash-can"
                  onClick={() => handleDeleteTodo(id)}
                />

                <EdiText
                  editButtonContent={
                    <img src={Pencil} alt="edit" className="edit-icon" />
                  }
                  editButtonClassName="dark:text-slate-100 justify-self-end h-8 border-2 w-8 rounded-lg bg-emerald-900"
                  viewContainerClassName="grid gap-4 grid-flow-col"
                  viewProps={{
                    className: "text-lg underline",
                  }}
                  showButtonsOnHover
                  inputProps={{
                    className:
                      "border-2 border-gray-300 bg-white text-black h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none",
                  }}
                  value={title}
                  type="text"
                  saveButtonContent="Apply"
                  saveButtonClassName="dark:text-slate-100 justify-self-end h-10 border-2 w-24 rounded-lg bg-emerald-900"
                  cancelButtonClassName="dark:text-slate-100 justify-self-end h-10 border-2 w-24 rounded-lg bg-pink-900"
                  cancelButtonContent={<strong>Cancel</strong>}
                  onSave={(value: string) => handleSave("title", value, id)}
                  validation={(value) => value !== ""}
                  onCancel={() => setEditingId("")}
                  editing={editingId == id}
                  hideIcons={true}
                />
                <EdiText
                  editButtonContent={
                    <img src={Pencil} alt="edit" className="edit-icon" />
                  }
                  editButtonClassName="dark:text-slate-100 justify-self-end h-8 border-2 w-8 rounded-lg bg-emerald-900"
                  containerProps={{
                    className: "mt-5",
                  }}
                  viewContainerClassName="grid gap-4 grid-flow-col"
                  viewProps={{ className: "text-base" }}
                  showButtonsOnHover
                  value={description}
                  type="textarea"
                  inputProps={{
                    className:
                      "border-2 border-gray-300 text-black bg-white h-24 px-5 pr-16 rounded-lg",
                    rows: 5,
                    cols: 105,
                  }}
                  saveButtonContent="Apply"
                  saveButtonClassName="dark:text-slate-100 justify-self-end h-10 border-2 w-24 rounded-lg bg-emerald-900"
                  cancelButtonClassName="dark:text-slate-100 justify-self-end h-10 border-2 w-24 rounded-lg bg-pink-900"
                  cancelButtonContent={<strong>Cancel</strong>}
                  onSave={(value: string) =>
                    handleSave("description", value, id)
                  }
                  validation={(value) => value !== ""}
                  onCancel={() => setEditingId("")}
                  editing={editingId == id}
                  hideIcons={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
