import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";

export default function TasksManger({ session }) {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskData, setEditTaskData] = useState({
    title: "",
    description: "",
  });

  const userId = session?.user?.id;

  const fetchTasks = async () => {
    const { error, data: tasks } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.log("Error fetching tasks:", error.message);
      return;
    }
    setTasks(tasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskToInsert = {
      ...newTask,
      user_id: userId,
    };

    const { error } = await supabase.from("tasks").insert([taskToInsert]);
    if (error) {
      console.log("Error adding task:", error.message);
    } else {
      setNewTask({ title: "", description: "" });
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.log("Error deleting task:", error.message);
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
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.log("Error updating task:", error.message);
      return;
    }

    setEditingTaskId(null);
    fetchTasks();
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log("Logout error:", error.message);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchTasks();
    }, 0);
  }, [userId]);

  return (
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
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        Edit Task
                      </span>
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

      <button
        onClick={handleLogout}
        type="button"
        className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-red-400 bg-zinc-900/60 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/20 rounded-lg shadow-sm backdrop-blur-sm transition-all duration-150 active:scale-[0.98] mt-10"
      >
        <svg
          className="w-4 h-4 text-zinc-400 group-hover:text-red-400 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Log Out</span>
      </button>
    </div>
  );
}
