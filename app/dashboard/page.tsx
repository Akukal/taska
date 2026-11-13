"use client";

import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  Target,
  Calendar,
  Activity
} from "lucide-react";
import type { Task } from "@/components/Kanban";

const COLORS = ['#0d9488', '#14b8a6', '#2dd4bf', '#5eead4'];

// Mock data analytics
const generateAnalyticsData = (tasks: Task[]) => {
  const now = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const statusCount = {
    todo: tasks.filter(t => t.status === "todo").length,
    in_progress: tasks.filter(t => t.status === "in_progress").length,
    done: tasks.filter(t => t.status === "done").length,
  };

  const dailyCompletion = last7Days.map(date => {
    const dayTasks = tasks.filter(t => 
      new Date(t.created_at).toISOString().split('T')[0] === date
    );
    const completed = dayTasks.filter(t => t.status === "done").length;
    const created = dayTasks.length;
    return {
      date: new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      "Selesai": completed,
      "Dibuat": created,
    };
  });

  const productivityByHour = Array.from({ length: 24 }, (_, hour) => ({
    hour: \`\${hour}:00\`,
    produktivitas: Math.floor(Math.random() * 10) + (hour >= 9 && hour <= 17 ? 15 : 5),
  }));

  return {
    statusCount,
    dailyCompletion,
    productivityByHour,
    totalTasks: tasks.length,
    completionRate: tasks.length > 0 ? Math.round((statusCount.done / tasks.length) * 100) : 0,
    avgCompletionTime: 2.5, // hours
  };
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("taska_data");
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch {
        setTasks([]);
      }
    }
  }, []);

  const analytics = generateAnalyticsData(tasks);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500 font-medium">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Monitor produktivitas dan statistik task secara real-time</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Total Task</p>
              <p className="text-3xl font-bold text-zinc-900 mt-2">{analytics.totalTasks}</p>
            </div>
            <div className="p-3 bg-teal-100/80 rounded-xl">
              <Target className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-500">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>+12% dari minggu lalu</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Completion Rate</p>
              <p className="text-3xl font-bold text-zinc-900 mt-2">{analytics.completionRate}%</p>
            </div>
            <div className="p-3 bg-teal-200/80 rounded-xl">
              <CheckCircle className="w-6 h-6 text-teal-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-500">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>+8% dari target</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Avg. Time</p>
              <p className="text-3xl font-bold text-zinc-900 mt-2">{analytics.avgCompletionTime} jam</p>
            </div>
            <div className="p-3 bg-teal-300/80 rounded-xl">
              <Clock className="w-6 h-6 text-teal-800" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-500">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>-0.5 jam dari rata-rata</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Active Users</p>
              <p className="text-3xl font-bold text-zinc-900 mt-2">3</p>
            </div>
            <div className="p-3 bg-teal-400/80 rounded-xl">
              <Users className="w-6 h-6 text-teal-900" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-500">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Semua aktif</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Completion Chart */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-base text-zinc-900 mb-4">Progress Harian (7 hari terakhir)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.dailyCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #d4d4d8',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Selesai" 
                  stroke="#0d9488" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Dibuat" 
                  stroke="#14b8a6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-base text-zinc-900 mb-4">Distribusi Status Task</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'To Do', value: analytics.statusCount.todo },
                    { name: 'In Progress', value: analytics.statusCount.in_progress },
                    { name: 'Done', value: analytics.statusCount.done },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => \`\${name}: \${(percent * 100).toFixed(0)}%\`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'To Do', value: analytics.statusCount.todo },
                    { name: 'In Progress', value: analytics.statusCount.in_progress },
                    { name: 'Done', value: analytics.statusCount.done },
                  ].map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Task']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #d4d4d8',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {['To Do', 'In Progress', 'Done'].map((status, index) => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-zinc-600">{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity by Hour */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
          <h3 className="font-bold text-base text-zinc-900 mb-4">Produktivitas per Jam (24 jam)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.productivityByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="hour" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #d4d4d8',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [value, 'Produktivitas']}
                />
                <Bar dataKey="produktivitas" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
        <h3 className="font-bold text-base text-zinc-900 mb-4">Statistik Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-zinc-100 rounded-xl">
            <div className="text-2xl font-bold text-teal-600">{analytics.statusCount.todo}</div>
            <div className="text-xs text-zinc-500 mt-1">Task Belum Mulai</div>
          </div>
          <div className="text-center p-4 border border-zinc-100 rounded-xl">
            <div className="text-2xl font-bold text-teal-600">{analytics.statusCount.in_progress}</div>
            <div className="text-xs text-zinc-500 mt-1">Sedang Dikerjakan</div>
          </div>
          <div className="text-center p-4 border border-zinc-100 rounded-xl">
            <div className="text-2xl font-bold text-teal-600">{analytics.statusCount.done}</div>
            <div className="text-xs text-zinc-500 mt-1">Selesai Minggu Ini</div>
          </div>
          <div className="text-center p-4 border border-zinc-100 rounded-xl">
            <div className="text-2xl font-bold text-teal-600">94%</div>
            <div className="text-xs text-zinc-500 mt-1">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
