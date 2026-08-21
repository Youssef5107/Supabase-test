import { useState } from "react";
import { supabase } from "../supabase-client";

export default function AuthModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("login");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab == "login") {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) {
        console.log("error occured during login:", loginError.message);
      }
    } else {
      const { error: registerError } = await supabase.auth.singUp({
        email,
        password,
      });
      if (registerError) {
        console.log("error occured during register:", registerError.message);
      }
    }
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen overflow-hidden font-sans">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      {/* Backdrop overlay */}
      <main
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm bg-black/60"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) onClose();
        }}
      >
        <div
          id="auth-container"
          className="bg-zinc-900/90 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md animate-fade-in relative"
        >
          {/* Header Image & Close Button */}
          <div className="h-32 w-full relative overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center opacity-40"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors rounded-lg bg-zinc-950/60 border border-zinc-800 hover:bg-zinc-800"
            >
              <svg
                className="w-5 h-5"
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

          <div className="px-8 pb-8 -mt-6 relative z-10">
            {/* Header Text */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">
                {activeTab === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-xs text-zinc-400">
                {activeTab === "login"
                  ? "Sign in to access your task dashboard"
                  : "Get started by filling out your details"}
              </p>
            </div>

            {/* Toggle Switcher */}
            <div className="flex p-1 bg-zinc-950 border border-zinc-800/80 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "login"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "register"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Register
              </button>
            </div>

            <div className="relative overflow-hidden">
              {/* Login Form */}
              {activeTab === "login" && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 block animate-fade-in"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      placeholder="name@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium text-zinc-300">
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <input
                      type="password"
                      value={password}
                      placeholder="••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg shadow-sm transition-all duration-150 active:scale-[0.99]"
                  >
                    Sign In
                  </button>
                </form>
              )}

              {/* Register Form */}
              {activeTab === "register" && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 block animate-fade-in"
                >
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userName}
                      placeholder="John Doe"
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      placeholder="name@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      placeholder="Minimum 8 characters"
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg shadow-sm transition-all duration-150 active:scale-[0.99]"
                  >
                    Create Account
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="px-8 py-3.5 bg-zinc-950 border-t border-zinc-800/60 text-center">
            <p className="text-xs text-zinc-500">
              Task Manager © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
