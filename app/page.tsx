"use client";

import { useEffect, useState } from "react";

type TaskStatus = "todo" | "in_progress" | "done";

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
}

const STORAGE_KEY = "taska_data";

const DEFAULT_TASKS: Task[] = [
  {
    id: 1730500000123,
    title: "Slicing UI Board",
    description: "Bikin layout dengan background #FFFFFF dan tombol Teal.",
    status: "todo",
    created_at: "2026-11-02T18:43:00.000Z",
  },
  {
    id: 1730500000456,
    title: "Setup Tailwind",
    description: "Konfigurasi rounded-none dan warna primary.",
    status: "done",
    created_at: "2026-11-02T10:00:00.000Z",
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        setTasks(DEFAULT_TASKS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
      }
    } catch {
      setTasks(DEFAULT_TASKS);
    }
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (e) {
      console.error("Gagal simpan ke localStorage", e);
    }
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      status,
      created_at: new Date().toISOString(),
    };

    saveTasks([newTask, ...tasks]);
    setTitle("");
    setDescription("");
  };

  const updateStatus = (id: number, nextStatus: TaskStatus) => {
    saveTasks(
      tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
  };

  const deleteTask = (id: number) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white text-zinc-800 p-8 flex items-center justify-center">
        <p className="text-zinc-400 font-mono text-sm">Memuat Taska...</p>
      </div>
    );
  }

  const columns: { label: string; key: TaskStatus }[] = [
    { label: "To Do", key: "todo" },
    { label: "In Progress", key: "in_progress" },
    { label: "Done", key: "done" },
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-900 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-teal-700">Taska</h1>
            <p className="text-sm text-zinc-500">Board Manajemen Tugas (Local Storage)</p>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            key: <code className="bg-zinc-100 px-1 py-0.5 rounded">{STORAGE_KEY}</code>
          </span>
        </header>

        {/* Form Tambah Task */}
        <form onSubmit={addTask} className="border border-zinc-200 p-4 space-y-3 bg-zinc-50 rounded-none">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-600">Tambah Tugas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Judul Tugas *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-zinc-300 p-2 text-sm bg-white rounded-none focus:outline-teal-600"
              required
            />
            <input
              type="text"
              placeholder="Deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-zinc-300 p-2 text-sm bg-white rounded-none focus:outline-teal-600 md:col-span-2"
            />
            <div className="flex gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="border border-zinc-300 p-2 text-sm bg-white rounded-none focus:outline-teal-600 flex-1"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-sm font-medium rounded-none transition-colors"
              >
                Tambah
              </button>
            </div>
          </div>
        </form>

        {/* Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const list = tasks.filter((t) => t.status === col.key);
            return (
              <section key={col.key} className="border border-zinc-200 bg-zinc-50/50 p-4 min-h-[300px]">
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-700">
                    {col.label}
                  </h3>
                  <span className="text-xs bg-zinc-200 text-zinc-700 px-2 py-0.5 font-mono">
                    {list.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {list.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">Tidak ada tugas.</p>
                  ) : (
                    list.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white border border-zinc-200 p-3 shadow-xs space-y-2 rounded-none"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm text-zinc-900">{task.title}</h4>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-zinc-400 hover:text-red-600 text-xs transition-colors"
                            title="Hapus"
                          >
                            ✕
                          </button>
                        </div>
                        {task.description && (
                          <p className="text-xs text-zinc-600 line-clamp-3">{task.description}</p>
                        )}
                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                          <span className="font-mono">
                            {new Date(task.created_at).toLocaleDateString("id-ID")}
                          </span>
                          <div className="flex gap-1">
                            {task.status !== "todo" && (
                              <button
                                onClick={() => updateStatus(task.id, "todo")}
                                className="px-1.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                              >
                                ← Todo
                              </button>
                            )}
                            {task.status !== "in_progress" && (
                              <button
                                onClick={() => updateStatus(task.id, "in_progress")}
                                className="px-1.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                              >
                                {task.status === "todo" ? "Progress →" : "← Progress"}
                              </button>
                            )}
                            {task.status !== "done" && (
                              <button
                                onClick={() => updateStatus(task.id, "done")}
                                className="px-1.5 py-0.5 bg-teal-50 hover:bg-teal-100 text-teal-700"
                              >
                                Done ✓
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
