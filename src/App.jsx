export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center tracking-tight text-zinc-100">
          Task Manager CRUD
        </h1>

        {/* Input Form */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-xl backdrop-blur-sm">
          <input
            type="text"
            placeholder="Task Title"
            className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            readOnly
          />
          <textarea
            placeholder="Task Description"
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            readOnly
          />
          <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg shadow-sm transition-all duration-150">
            Add Task
          </button>
        </div>

        {/* Task Item Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-center space-y-3 shadow-md">
          <h2 className="text-base font-semibold text-zinc-200">Title</h2>
          <p className="text-sm text-zinc-400">Description</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button className="px-4 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
              Edit
            </button>
            <button className="px-4 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-md transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
