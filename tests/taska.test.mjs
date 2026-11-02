import test from "node:test";
import assert from "node:assert/strict";

test("Taska Data Schema & State Operations", async (t) => {
  const STORAGE_KEY = "taska_data";

  // Mock localStorage
  const store = {};
  const mockLocalStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = val.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
  };

  await t.test("Initial default tasks match required schema", () => {
    const initialTasks = [
      {
        id: 1730500000123,
        title: "Slicing UI Board",
        description: "Bikin layout dengan background #FFFFFF dan tombol Teal.",
        status: "todo",
        created_at: "2026-11-02T18:43:00.000Z"
      },
      {
        id: 1730500000456,
        title: "Setup Tailwind",
        description: "Konfigurasi rounded-none dan warna primary.",
        status: "done",
        created_at: "2026-11-02T10:00:00.000Z"
      }
    ];

    mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
    const loaded = JSON.parse(mockLocalStorage.getItem(STORAGE_KEY));

    assert.equal(loaded.length, 2);
    for (const task of loaded) {
      assert.equal(typeof task.id, "number");
      assert.equal(typeof task.title, "string");
      assert.equal(typeof task.description, "string");
      assert.ok(["todo", "in_progress", "done"].includes(task.status));
      assert.ok(!isNaN(Date.parse(task.created_at)));
    }
  });

  await t.test("Adding task prepends and serializes properly", () => {
    const tasks = JSON.parse(mockLocalStorage.getItem(STORAGE_KEY));
    const newTask = {
      id: Date.now(),
      title: "Deploy ke Staging",
      description: "Setup pipeline CI/CD",
      status: "todo",
      created_at: new Date().toISOString()
    };

    const updated = [newTask, ...tasks];
    mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const reloaded = JSON.parse(mockLocalStorage.getItem(STORAGE_KEY));
    assert.equal(reloaded.length, 3);
    assert.equal(reloaded[0].title, "Deploy ke Staging");
  });

  await t.test("Drag-and-drop state transition updates status", () => {
    const tasks = JSON.parse(mockLocalStorage.getItem(STORAGE_KEY));
    const taskIdToMove = 1730500000123; // todo -> in_progress

    const moved = tasks.map((t) => (t.id === taskIdToMove ? { ...t, status: "in_progress" } : t));
    mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(moved));

    const reloaded = JSON.parse(mockLocalStorage.getItem(STORAGE_KEY));
    const target = reloaded.find((t) => t.id === taskIdToMove);
    assert.equal(target.status, "in_progress");
  });

  await t.test("Deleting task removes it from storage", () => {
    const tasks = JSON.parse(mockLocalStorage.getItem(STORAGE_KEY));
    const filtered = tasks.filter((t) => t.id !== 1730500000456);
    mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    const reloaded = JSON.parse(mockLocalStorage.getItem(STORAGE_KEY));
    assert.equal(reloaded.find((t) => t.id === 1730500000456), undefined);
  });
});
