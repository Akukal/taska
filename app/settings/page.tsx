"use client";

import { useState } from "react";
import { Palette, Moon, Sun, Settings as SettingsIcon, Save } from "lucide-react";

const THEMES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "auto", label: "System", icon: SettingsIcon },
];

const COLORS = [
  { id: "teal", label: "Teal", color: "bg-teal-500" },
  { id: "blue", label: "Blue", color: "bg-blue-500" },
  { id: "violet", label: "Violet", color: "bg-violet-500" },
  { id: "rose", label: "Rose", color: "bg-rose-500" },
];

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [primaryColor, setPrimaryColor] = useState("teal");
  const [notification, setNotification] = useState(true);
  const [dueDateWarn, setDueDateWarn] = useState(3);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 500);
    localStorage.setItem("taska_settings", JSON.stringify({
      theme,
      primaryColor,
      notification,
      dueDateWarn,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 min-h-screen min-w-screen bg-white">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-8 h-8 text-gray-700" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-8">
        <section className="bg-white border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Theme & Colors</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Theme</h3>
              <div className="flex flex-wrap gap-3">
                {THEMES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${theme === t.id
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Primary Color</h3>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setPrimaryColor(c.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${primaryColor === c.id
                        ? "border-gray-300 bg-gray-50"
                        : "border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${c.color}`} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable notifications</h3>
                <p className="text-sm text-gray-500">Receive updates about task assignments</p>
              </div>
              <button
                onClick={() => setNotification(!notification)}
                className={`w-12 h-6 rounded-full transition-colors ${notification ? "bg-teal-500" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notification ? "translate-x-7" : "translate-x-1"
                    }`}
                />
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Due date warning</h3>
                <span className="text-teal-600 font-medium">{dueDateWarn} days</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Get a reminder before task due date</p>
              <input
                type="range"
                min="1"
                max="7"
                value={dueDateWarn}
                onChange={(e) => setDueDateWarn(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>1 day</span>
                <span>7 days</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Clear all data</h3>
                <p className="text-sm text-gray-500">Remove all tasks and settings</p>
              </div>
              <button
                onClick={() => {
                  if (confirm("Delete all tasks and settings? This cannot be undone.")) {
                    localStorage.removeItem("taska_data");
                    localStorage.removeItem("taska_settings");
                    location.reload();
                  }
                }}
                className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg"
              >
                Clear Data
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg shadow disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
