⚡ Taska – Task Management & Collaboration Platform
Platform manajemen tugas dan kolaborasi tim yang dirancang untuk produktivitas tim modern dengan fitur real-time updates, assignment tracking, dan analytics. Proyek ini menggunakan Next.js dengan backend Prisma ORM dan PostgreSQL yang melayani aplikasi web lengkap dengan dokumentasi API.

🎯 Fitur Utama
1. Task Management & Assignment
Board View: Drag & drop task boards (Todo, In Progress, Done, Review) dengan real-time sync.
Assignment: Assign task ke anggota tim dengan due date dan priority.
Labels & Filters: Tag task dengan label kategori (bug, feature, docs) dan filter berdasarkan assignee, label, status.
2. Real-time Collaboration
Comments & Threads: Diskusi per task dengan @mention notifications.
Activity Feed: Timeline otomatis mencatat semua perubahan task (status, assignee, due date).
Live Presence: Indikator online anggota tim di sidebar.
3. Analytics & Reporting
Burndown Charts: Visualisasi progress sprint per tim.
Task Distribution: Pie chart beban kerja per anggota.
Cycle Time Tracking: Analytics waktu rata-rata task dari todo → done.
4. API & Integrations
REST API: CRUD endpoints untuk tasks, projects, users dengan autentikasi JWT.
Webhook: Notifikasi ke Slack/Discord saat task status berubah.
Import/Export: Export task ke CSV, import dari Jira/Asana.
🛠️ Tech Stack & Ekosistem
Frontend: Next.js 14 (App Router) dengan TypeScript
Styling: Tailwind CSS + shadcn/ui components
Backend: Prisma ORM (Node.js runtime)
Database: PostgreSQL (cloud/local)
Authentication: NextAuth.js (Google OAuth + JWT)
Realtime: Supabase Realtime / Pusher
🚀 Panduan Instalasi & Menjalankan Projek
1. Clone & Setup Dependensi
```bash
# Clone repositori
git clone <repo-url> taska
cd taska

# Install dependencies
pnpm install
```
2. Konfigurasi Environment
```bash
# Salin environment file
cp .env.example .env

# Edit .env dan isi variabel database & NextAuth secret
nano .env
```
3. Setup Database
```bash
# Jalankan migrasi database
pnpm db:migrate

# Jalankan seeder data demo (opsional)
pnpm db:seed
```
4. Menjalankan Development Server
```bash
pnpm dev
```
Aplikasi berjalan di http://localhost:3000.

📖 Akses Halaman Utama
Dashboard: http://localhost:3000/dashboard
API Documentation: http://localhost:3000/api/docs (Swagger UI)
🔑 Akun Demo (Hasil Seeding)
Role	Email	Password
Admin	admin@taska.app	password
Member	member@taska.app	password
Viewer	viewer@taska.app	password
📡 Ringkasan Endpoint REST API (/api/v1)
Authentication
POST /api/v1/auth/register – Register akun baru
POST /api/v1/auth/login – Login dan dapatkan JWT token
GET /api/v1/auth/me – Profile user yang login
POST /api/v1/auth/logout – Logout
Projects
GET /api/v1/projects – List semua projects
POST /api/v1/projects – Buat project baru
GET /api/v1/projects/{id} – Detail project dengan tasks
PUT /api/v1/projects/{id} – Update project
DELETE /api/v1/projects/{id} – Hapus project
Tasks
GET /api/v1/tasks – List tasks dengan filter (status, assignee, label)
POST /api/v1/tasks – Buat task baru
GET /api/v1/tasks/{id} – Detail task dengan comments
PUT /api/v1/tasks/{id} – Update task
DELETE /api/v1/tasks/{id} – Hapus task
POST /api/v1/tasks/{id}/comments – Tambah comment ke task
Analytics
GET /api/v1/analytics/burndown – Data burndown chart untuk sprint
GET /api/v1/analytics/workload – Distribusi beban kerja per anggota
📦 Docker Deployment
Konfigurasi Docker Compose tersedia untuk development dan production:

```bash
# Jalankan seluruh stack (PostgreSQL + Next.js)
docker compose up -d

# Setup database
docker compose exec app pnpm db:migrate
docker compose exec app pnpm db:seed
```
🔧 Development Commands
```bash
pnpm dev            # Start development server
pnpm build          # Build for production
pnpm start          # Start production server
pnpm lint           # Run ESLint + TypeScript check
pnpm test           # Run tests (vitest)
pnpm db:migrate     # Run Prisma migrations
pnrm db:seed        # Seed database with demo data
pnpm storybook      # Open component storybook
```
📄 Lisensi
Platform ini didistribusikan di bawah lisensi MIT License.
dummy commit 1
dummy commit 2
dummy commit 3
dummy commit 4
dummy commit 5
dummy commit 6
