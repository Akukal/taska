"use client";

import { useEffect, useState } from "react";
import { Plus, X, GripVertical, Pencil } from "lucide-react";
import RichEditor from "./RichEditor";

type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: number;
  title: string;
  description?: string;
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

const COLUMNS: { key: TaskStatus; label: string; badge: string; dot: string }[] = [
  {
    key: "todo",
    label: "To Do",
    badge: "bg-teal-100 text-teal-900 border-teal-200",
    dot: "bg-teal-500",
  },
  {
    key: "in_progress",
    label: "In Progress",
    badge: "bg-teal-200 text-teal-900 border-teal-300",
    dot: "bg-teal-600",
  },
  {
    key: "done",
    label: "Done",
    badge: "bg-teal-300 text-teal-900 border-teal-400",
    dot: "bg-teal-700",
  },
];

export default function Kanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);
  const [dragId, setDragId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [modalStatus, setModalStatus] = useState<TaskStatus>("todo");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch {
        setTasks(DEFAULT_TASKS);
      }
    } else {
      setTasks(DEFAULT_TASKS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
    }
  }, []);

  const persist = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  };

  const openCreateModal = (defaultCol: TaskStatus = "todo") => {
    setEditingTaskId(null);
    setModalStatus(defaultCol);
    setModalTitle("");
    setModalDesc("");
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setModalTitle(task.title);
    setModalDesc(task.description || "");
    setModalStatus(task.status);
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    if (editingTaskId) {
      // Update existing task
      persist(
        tasks.map((t) =>
          t.id === editingTaskId
            ? { ...t, title: modalTitle.trim(), description: modalDesc.trim() || undefined, status: modalStatus }
            : t
        )
      );
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now(),
        title: modalTitle.trim(),
        description: modalDesc.trim() || undefined,
        status: modalStatus,
        created_at: new Date().toISOString(),
      };
      persist([newTask, ...tasks]);
    }

    setIsModalOpen(false);
  };

  const deleteTask = (id: number) => {
    persist(tasks.filter((t) => t.id !== id));
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDragId(id);
    e.dataTransfer.setData("text/plain", id.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, target: TaskStatus) => {
    e.preventDefault();
    const id = Number(e.dataTransfer.getData("text/plain")) || dragId;
    if (!id) return;
    persist(tasks.map((t) => (t.id === id ? { ...t, status: target } : t)));
    setDragId(null);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500 font-medium">
        Memuat board...
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-6 p-4">
      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="flex flex-col">
              {/* Header Title Kolom */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <h2 className="font-bold text-sm tracking-tight text-zinc-900">
                    {col.label}
                  </h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${col.badge}`}
                  >
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => openCreateModal(col.key)}
                  className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                  title={`Tambah tugas ke ${col.label}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Container */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, col.key)}
                className="bg-zinc-100/80 border border-zinc-200/90 rounded-2xl p-3 min-h-[480px] flex flex-col space-y-3"
              >
                {colTasks.length === 0 ? (
                  <div
                    onClick={() => openCreateModal(col.key)}
                    className="h-32 border-2 border-dashed border-zinc-300 hover:border-zinc-400 rounded-xl flex flex-col items-center justify-center text-xs text-zinc-400 font-medium cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4 mb-1 text-zinc-400" />
                    <span>Tambah atau tarik tugas ke sini</span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="group border border-zinc-200/80 rounded-xl p-4 bg-white shadow-xs hover:shadow-md hover:border-zinc-300 transition-all cursor-grab active:cursor-grabbing select-none"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <GripVertical className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-zinc-900 leading-snug break-words">
                              {task.title}
                            </h3>
                            {task.description && (
                              <div
                                className="text-xs text-zinc-600 mt-1.5 leading-relaxed break-words rich-editor-output"
                                dangerouslySetInnerHTML={{ __html: task.description }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(task)}
                            className="text-zinc-300 hover:text-zinc-900 transition-colors p-1 rounded hover:bg-zinc-100"
                            title="Edit Tugas"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-zinc-300 hover:text-rose-600 transition-colors p-1 rounded hover:bg-zinc-100"
                            title="Hapus Tugas"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                        <span>
                          {new Date(task.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="uppercase tracking-wider text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded font-mono font-medium">
                          #{task.id.toString().slice(-4)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pop-up Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100">
              <h3 className="font-bold text-base text-zinc-900">{editingTaskId ? "Edit Tugas" : "Tambah Tugas Baru"}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Judul Tugas
                </label>
                <input
                  type="text"
                  placeholder="Misal: Buat dokumentasi API"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Deskripsi (Opsional)
                </label>
                <RichEditor
                  value={modalDesc}
                  onChange={setModalDesc}
                  placeholder="Detail tugas atau catatan..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Status
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as TaskStatus)}
                  className="w-full border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-colors"
                >
                  {editingTaskId ? "Update Tugas" : "Simpan Tugas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
