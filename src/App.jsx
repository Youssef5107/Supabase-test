import { useEffect, useState } from "react";
import { supabase } from "./supabase-client";
import AuthModal from "./components/authModal";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState([]);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({
    title: "",
    description: "",
  });

  const fetchTasks = async () => {
    const { error, data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.log("error occurred during fetching the tasks:", error.message);
      return;
    }
    setTasks(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const { error } = await supabase.from("tasks").insert([newTask]);
    if (error) {
      console.log("error occurred during adding the task:", error.message);
    } else {
      setNewTask({ title: "", description: "" });
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.log("error occurred during deleting the task:", error.message);
      return;
    }
    fetchTasks();
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTaskData({ title: task.title, description: task.description });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTaskData({ title: "", description: "" });
  };

  const handleUpdate = async (id) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        title: editTaskData.title,
        description: editTaskData.description,
      })
      .eq("id", id);

    if (error) {
      console.log("error occurred during editing the task:", error.message);
      return;
    }

    setEditingTaskId(null);
    fetchTasks();
  };

  useEffect(() => {
    setTimeout(() => {
      fetchTasks();
    }, 0);
  }, []);

  return isSignedIn ? (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center tracking-tight text-zinc-100">
          Task Manager CRUD
        </h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <textarea
              placeholder="Task Description"
              rows={3}
              value={newTask.description}
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
              onChange={(e) =>
                setNewTask((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg shadow-sm transition-all duration-150 active:scale-[0.99]">
              Add Task
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-4">
          {tasks?.map((task) => {
            const isEditing = editingTaskId === task.id;

            return (
              <div
                key={task.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-md relative overflow-hidden transition-all duration-300"
              >
                {isEditing ? (
                  /* Animated Edit Mode Form */
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        Edit Task
                      </span>
                      {/* Close 'X' Button */}
                      <button
                        onClick={handleCancelEdit}
                        className="text-zinc-400 hover:text-zinc-100 p-1 rounded-md hover:bg-zinc-800 transition-colors"
                        title="Cancel"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={editTaskData.title}
                      onChange={(e) =>
                        setEditTaskData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />

                    <textarea
                      rows={3}
                      value={editTaskData.description}
                      onChange={(e) =>
                        setEditTaskData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                    />

                    <button
                      onClick={() => handleUpdate(task.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  /* Normal View Mode */
                  <div className="text-center space-y-3">
                    <h2 className="text-base font-semibold text-zinc-200">
                      {task.title}
                    </h2>
                    <p className="text-sm text-zinc-400">{task.description}</p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="px-4 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-4 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <AuthModal setIsSignedIn={setIsSignedIn} />
  );
}
