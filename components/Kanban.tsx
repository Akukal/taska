"use client";

import { useEffect, useState } from "react";

type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
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
    description: "Bikin layout dengan background bersih dan tombol teal modern.",
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

const COLUMNS: { key: TaskStatus; label: string; badge: string; accent: string }[] = [
  { key: "todo", label: "To Do", badge: "bg-gray-300/10 text-gray-600 border-gray-300/20", accent: "hover:border-gray-400/50" },
  { key: "in_progress", label: "In Progress", badge: "bg-gray-400/10 text-gray-700 border-gray-400/20", accent: "hover:border-gray-500/50" },
  { key: "done", label: "Done", badge: "bg-gray-500/10 text-gray-800 border-gray-500/20", accent: "hover:border-gray-600/50" },
];

export default function Kanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTasks(JSON.parse(stored));
      else {
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
      description: description.trim() || "",
      status,
      created_at: new Date().toISOString(),
    };
    saveTasks([newTask, ...tasks]);
    setTitle("");
    setDescription("");
  };

  const deleteTask = (id: number) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.setData("text/plain", id.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent, colKey: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colKey);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("text/plain")) || draggedId;
    if (!id) return;
    saveTasks(tasks.map((t) => (t.id === id ? { ...t, status: targetStatus } : t)));
    setDraggedId(null);
    setDragOverCol(null);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-sans">
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          Memuat Taska...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-12 space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200/80">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50" />
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Taska</h1>
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">Kanban</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">Manajemen tugas modern dengan drag‑and‑drop & local persistence.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>Storage:</span>
            <code className="bg-zinc-100 px-2 py-1 rounded text-zinc-600 border border-zinc-200">{STORAGE_KEY}</code>
          </div>
        </header>
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm p-4 sm:p-5">
          <form onSubmit={addTask} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Apa yang ingin kamu kerjakan?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-zinc-400"
              required
            />
            <input
              type="text"
              placeholder="Deskripsi singkat (opsional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-zinc-400"
            />
            <div className="flex gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="px-3 py-2 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-zinc-700 transition-all cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white shadow-sm shadow-teal-600/20 transition-all whitespace-nowrap cursor-pointer"
              >+ Tambah</button>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.key);
            const isTargeted = dragOverCol === col.key;
            return (
              <div
                key={col.key}
                onDragOver={(e) => handleDragOver(e, col.key)}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={(e) => handleDrop(e, col.key)}
                className={`flex flex-col rounded-2xl bg-zinc-100/70 p-4 border transition-all duration-200 min-h-[420px] ${isTargeted ? "border-teal-500 bg-teal-50/30 ring-2 ring-teal-500/20 scale-[1.01]" : "border-zinc-200/60"}`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200/60">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-zinc-800">{col.label}</h2>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${col.badge}`}>{columnTasks.length}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">Tarik ke sini</span>
                </div>
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-0.5">
                  {columnTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-zinc-200/80 rounded-xl flex items-center justify-center text-xs text-zinc-400">Lepas task di sini</div>
                  ) : (
                    columnTasks.map((task) => {
                      const isBeingDragged = draggedId === task.id;
                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          className={`group bg-white rounded-xl p-3.5 border border-zinc-200/90 shadow-xs hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing ${isBeingDragged ? "opacity-40 scale-95 border-teal-400" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-medium text-zinc-900 group-hover:text-teal-900 transition-colors">{task.title}</h3>
                            <button type="button" onClick={() => deleteTask(task.id)} className="text-zinc-300 hover:text-red-500 transition-colors text-xs p-0.5 rounded" title="Hapus task">✕</button>
                          </div>
                          {task.description && (
                            <p className="text-xs text-zinc-500 mt-1.5 line-clamp-3 leading-relaxed">{task.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100 text-[10px] text-zinc-400">
                            <span className="font-mono">{new Date(task.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                            <span className="inline-flex items-center gap-1 text-zinc-300 group-hover:text-zinc-500 transition-colors"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16"/></svg>geser</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
