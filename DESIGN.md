# GETDESIGN.md

## Uangku — Personal Finance App

### Design System & UI Guidelines

---

# 1. Design Overview

## Product Name

**Uangku**

## Design Theme

Modern Soft UI / Neumorphism

## Design Goals

Menciptakan pengalaman pengelolaan keuangan pribadi yang:

- Nyaman dilihat
- Minimalis
- Fokus pada kemudahan penggunaan
- Memberikan kesan modern dan premium
- Ramah untuk pengguna pemula

---

# 2. Visual Identity

## Design Style

Menggunakan kombinasi:

- Neumorphism
- Soft Shadow
- Minimal Layout
- Smooth Animation
- Glassmorphism ringan
- Clean Dashboard

---

# 3. Color Palette

## Primary Colors

| Name           | Hex     |
| -------------- | ------- |
| Background     | #E0E5EC |
| Primary        | #6C63FF |
| Success        | #4CAF50 |
| Danger         | #FF5C5C |
| Warning        | #FFC107 |
| Dark Text      | #2D3748 |
| Secondary Text | #718096 |

---

# 4. Typography

## Font Family

### Primary Font

Poppins

### Secondary Font

Inter

---

## Font Scale

| Usage      | Size | Weight |
| ---------- | ---- | ------ |
| Hero Title | 36px | 700    |
| Page Title | 28px | 700    |
| Card Title | 20px | 600    |
| Body       | 16px | 400    |
| Small Text | 14px | 400    |
| Caption    | 12px | 400    |

---

# 5. Layout System

## Grid System

### Desktop

- 12 Column Grid
- Max Width: 1440px

### Tablet

- 8 Column Grid

### Mobile

- 4 Column Grid

---

## Spacing System

| Token | Size |
| ----- | ---- |
| xs    | 4px  |
| sm    | 8px  |
| md    | 16px |
| lg    | 24px |
| xl    | 32px |
| 2xl   | 48px |

---

# 6. Neumorphism Style Guide

## Soft Shadow

### Outer Shadow

```css
box-shadow:
  8px 8px 16px #bec3c9,
  -8px -8px 16px #ffffff;
```

### Inner Shadow

```css
box-shadow:
  inset 4px 4px 8px #bec3c9,
  inset -4px -4px 8px #ffffff;
```

---

## Border Radius

| Component | Radius |
| --------- | ------ |
| Card      | 24px   |
| Button    | 18px   |
| Input     | 16px   |
| Modal     | 28px   |

---

# 7. Core Components

## 7.1 Neumorphism Card

### Characteristics

- Soft shadow
- Rounded corner besar
- Sedikit transparansi
- Hover floating effect

### Usage

- Statistik
- Saldo
- Target tabungan
- Ringkasan transaksi

---

## 7.2 Soft Button

### States

- Default
- Hover
- Active (Inset Shadow)
- Disabled

### Primary Button

Background:

```css
#6C63FF
```

---

## 7.3 Floating Action Button

### Function

Tombol cepat untuk:

- Tambah pemasukan
- Tambah pengeluaran

### Position

Bottom Right

---

## 7.4 Input Field

### Style

- Inner neumorphism
- Soft border
- Placeholder abu lembut

### Validation State

- Success
- Error
- Focus glow

---

## 7.5 Progress Bar

Digunakan untuk:

- Progress tabungan
- Target keuangan

Style:

- Rounded
- Gradient soft
- Animated fill

---

# 8. Dashboard Design

## Dashboard Structure

### Top Navigation

Berisi:

- Logo
- Search
- Notification
- Profile

---

## Dashboard Cards

### Total Saldo

Menampilkan:

- Total uang saat ini
- Persentase perubahan

### Total Pemasukan

Warna:

- Hijau

### Total Pengeluaran

Warna:

- Merah

---

## Financial Chart Area

### Charts

- Pie Chart
- Bar Chart
- Line Chart

### Style

- Rounded chart card
- Minimal grid
- Smooth tooltip

---

## Recent Transaction List

### Item Structure

- Icon kategori
- Nama transaksi
- Tanggal
- Nominal

---

# 9. Transaction Page Design

## Add Transaction Modal

### Input Fields

- Nominal
- Kategori
- Tanggal
- Catatan

### Interaction

- Smooth open animation
- Soft scale effect

---

## Transaction Category Icons

| Category     | Icon |
| ------------ | ---- |
| Makanan      | 🍔   |
| Transportasi | 🚗   |
| Belanja      | 🛍️   |
| Pendidikan   | 📚   |
| Hiburan      | 🎮   |
| Lainnya      | 📦   |

---

# 10. Savings Goals Design

## Savings Card

### Components

- Nama target
- Progress bar
- Deadline
- Nominal terkumpul

---

## Goal Progress Animation

Gunakan:

- Framer Motion
- Animated percentage counter

---

# 11. Authentication Pages

## Login Page

### Layout

Split screen:

- Left: Illustration
- Right: Form Login

---

## Authentication Features

### Login Method

- Email Password
- Google OAuth

### Security UI

- Password visibility toggle
- Validation realtime

---

# 12. Animation Guidelines

## Animation Library

Framer Motion

---

## Motion Principles

### Smooth

Durasi:

```js
0.2s - 0.4s
```

### Soft Scale

Hover:

```css
transform: scale(1.02);
```

### Floating Effect

Cards:

```css
translateY(-2px);
```

---

# 13. Responsive Guidelines

## Mobile First

### Breakpoints

| Device  | Width   |
| ------- | ------- |
| Mobile  | < 640px |
| Tablet  | 640px   |
| Laptop  | 1024px  |
| Desktop | 1280px  |

---

## Mobile UX

### Bottom Navigation

Berisi:

- Dashboard
- Transaksi
- Statistik
- Profile

---

# 14. Dark Mode

## Future Design

### Dark Neumorphism

Background:

```css
#1E1E2E
```

Shadow:

```css
box-shadow:
  8px 8px 16px #151521,
  -8px -8px 16px #27273b;
```

---

# 15. Iconography

## Icon Style

Menggunakan:

- Lucide Icons
- Rounded Icon
- Simple line icon

---

# 16. Illustration Style

## Illustration Characteristics

- Flat modern
- Soft gradient
- Purple accent
- Finance-themed

---

# 17. Empty State Design

## Empty Transaction

Menampilkan:

- Ilustrasi sederhana
- Text motivasi
- Tombol tambah transaksi

Contoh:

> "Mulai catat keuangan pertamamu hari ini ✨"

---

# 18. UX Principles

## UX Goals

- Cepat dipahami
- Sedikit klik
- Tidak membingungkan
- Fokus pada data penting

---

# 19. Accessibility

## Accessibility Requirements

### Contrast

Minimal:
WCAG AA

### Touch Area

Minimal:
44x44px

### Keyboard Navigation

Harus didukung

---

# 20. Recommended Frontend Stack

## UI Stack

- Astro.js
- React
- Tailwind CSS
- Framer Motion
- Shadcn UI

---

# 21. Tailwind Design Tokens

## Example

```js
colors: {
  background: "#E0E5EC",
  primary: "#6C63FF",
  success: "#4CAF50",
  danger: "#FF5C5C"
}
```

---

# 22. Component Naming Convention

## Example

```bash
components/
 ├── ui/
 ├── dashboard/
 ├── transaction/
 ├── savings/
 └── charts/
```

---

# 23. Recommended Pages

## Pages

- Dashboard
- Transactions
- Statistics
- Savings Goals
- Profile
- Settings
- Login
- Register

---

# 24. Future UI Features

## Planned Enhancements

- AI Financial Insight
- Voice Input
- Receipt Scanner
- Smart Reminder
- Multi Wallet

---

# 25. Final Design Direction

Uangku harus terasa:

- Modern
- Soft
- Premium
- Ringan
- Tidak melelahkan mata
- Mudah dipakai pengguna awam

Fokus utama desain:

> “Simple Financial Experience with Soft Modern UI”

# 26. Export Report Feature

## Feature Overview

Fitur export laporan memungkinkan pengguna mengunduh laporan keuangan dalam berbagai format untuk kebutuhan:

- Arsip pribadi
- Laporan bulanan
- Rekap pengeluaran
- Print laporan
- Backup data finansial

---

# 27. Export Report UI Design

## Export Button

### Position

- Dashboard Header
- Statistics Page
- Transaction Page

### Style

Menggunakan:

- Soft neumorphism button
- Download icon
- Hover glow effect

### Example Label

- Export PDF
- Download Report
- Export Excel

---

# 28. Export Modal Design

## Modal Components

### Report Type

Pilihan:

- PDF
- Excel (.xlsx)
- CSV

---

### Date Filter

User dapat memilih:

- Hari ini
- Minggu ini
- Bulan ini
- Tahun ini
- Custom range

---

### Transaction Filter

Pilihan:

- Semua transaksi
- Pemasukan
- Pengeluaran

---

### Category Filter

Multi select category:

- Makanan
- Transportasi
- Belanja
- Pendidikan
- Hiburan
- Lainnya

---

### Preview Summary

Menampilkan:

- Total pemasukan
- Total pengeluaran
- Total saldo
- Jumlah transaksi

---

# 29. Export PDF Design

## PDF Layout

### Header

Berisi:

- Logo aplikasi
- Nama pengguna
- Periode laporan
- Tanggal export

---

### Financial Summary Card

Menampilkan:

- Total saldo
- Pemasukan
- Pengeluaran

---

### Transaction Table

| Tanggal | Kategori | Catatan | Tipe | Nominal |
| ------- | -------- | ------- | ---- | ------- |

---

### Statistics Section

Berisi:

- Pie chart pengeluaran
- Grafik bulanan

---

### Footer

Text:

> Generated by Uangku

---

# 30. Export Excel Design

## Excel Structure

### Sheet 1

Financial Summary

### Sheet 2

Transaction History

### Sheet 3

Statistics

---

## Excel Styling

### Table Style

- Header bold
- Soft border
- Currency format otomatis
- Auto width column

---

# 31. Export Success Experience

## Success Animation

Setelah export berhasil:

- Toast notification
- Success check animation

Contoh:

> "Laporan berhasil diunduh ✨"

---

# 32. Export Loading State

## Loading UI

Saat proses generate laporan:

- Skeleton loading
- Progress animation
- Disable export button sementara

Text:

> "Sedang membuat laporan..."

---

# 33. Export Empty State

Jika tidak ada data:

- Empty illustration
- Informasi tidak ada transaksi

Text:

> "Belum ada data untuk diexport"

---

# 34. Recommended Export Libraries

## PDF Export

- React PDF
- jsPDF
- html2canvas

---

## Excel Export

- SheetJS (xlsx)
- ExcelJS

---

# 35. Export Feature UX Principles

## UX Goals

- Export maksimal 3 klik
- Mudah dipahami pengguna awam
- Preview data sebelum download
- Format file profesional

---

# 36. Future Export Features

## Planned Features

- Auto email report
- Scheduled export bulanan
- Cloud backup
- Share laporan via WhatsApp
- AI financial summary

# AUTHENTICATION & LANDING PAGE SYSTEM

## Uangku — Better Auth + Modern SaaS Landing Experience

---

# 1. System Overview

Uangku menggunakan:

* Better Auth sebagai sistem autentikasi
* Landing page modern ala fintech SaaS
* UI Neumorphism modern
* Session management aman
* Authentication flow yang sederhana

Tujuan utama:

* Menarik pengguna baru
* Meningkatkan conversion register
* Menjaga keamanan akun pengguna
* Memberikan pengalaman onboarding modern

---

# 2. Authentication Provider

## Main Authentication System

Menggunakan:

* Better Auth

---

## Authentication Features

### Core Features

* Login
* Register
* Logout
* Google OAuth
* Email verification
* Session management

---

## User Management

* Update profile
* Update avatar
* Update email
* Update password
* Delete account

---

## Security Features

* JWT session
* Secure cookies
* Password hashing
* Multi-device session
* Session revoke

---

# 3. Landing Page Goals

## Main Goals

Landing page dibuat untuk:

* Menjelaskan manfaat aplikasi
* Menarik pengguna baru
* Menampilkan fitur unggulan
* Meningkatkan register conversion
* Menampilkan keamanan aplikasi

---

## User Impression

Landing page harus terasa:

* Premium
* Modern
* Clean
* Soft fintech UI
* Friendly untuk pengguna baru

---

# 4. Landing Page Structure

## Sections

```bash
Landing Page
├── Navbar
├── Hero Section
├── Trusted Section
├── Features Section
├── Dashboard Preview
├── Security Section
├── Statistics Section
├── Testimonial Section
├── FAQ
├── CTA Section
└── Footer
```

---

# 5. Navbar Authentication Integration

## Navbar Layout

### Left

* Logo Uangku

### Center

* Features
* Security
* Statistics
* FAQ

### Right

#### Guest User

* Login Button
* Register Button

#### Logged User

* Dashboard Button
* Profile Dropdown

---

## Navbar Scroll Effect

Saat scroll:

* Blur background
* Soft shadow
* Sticky navbar

---

# 6. Hero Section

## Hero Layout

### Left Side

Berisi:

* Main headline
* Description
* CTA buttons

### Right Side

Berisi:

* Dashboard mockup
* Floating financial cards
* Statistics chart

---

## Main Headline

> “Kelola Keuangan Lebih Mudah dan Modern”

---

## Description

> “Catat pemasukan, pengeluaran, tabungan, dan laporan finansial dalam satu aplikasi modern dengan sistem keamanan Better Auth.”

---

## Hero CTA

### Guest User

Primary CTA:

> Mulai Gratis

Action:

* Redirect register

---

### Secondary CTA

> Login Sekarang

Action:

* Redirect login

---

### Logged User CTA

Jika user login:

> Buka Dashboard

---

# 7. Authentication Pages Structure

## Pages

```bash
/
├── login
├── register
├── forgot-password
├── reset-password
├── verify-email
├── profile
├── settings
├── dashboard
└── onboarding
```

---

# 8. Login System

## Login Features

### Methods

* Email & password
* Google OAuth

---

## Login Components

### Form Inputs

* Email
* Password

---

## Additional Features

* Remember me
* Show password
* Forgot password
* Google login

---

## Login Success Flow

1. User login
2. Better Auth validate credentials
3. Session dibuat
4. Redirect dashboard

---

# 9. Register System

## Register Components

### Inputs

* Full name
* Email
* Password
* Confirm password

---

## Validation

* Email unique
* Password minimum 8 karakter
* Password strength validation

---

## Register Flow

1. User input data
2. Better Auth membuat akun
3. Verification email dikirim
4. Session dibuat
5. Redirect onboarding

---

# 10. Logout System

## Logout UX

### Flow

1. User klik logout
2. Session dihapus
3. Redirect landing page

---

## Logout Modal

### Text

> “Yakin ingin keluar dari akun?”

Buttons:

* Logout
* Cancel

---

# 11. Profile Management

## Editable Features

### User Profile

* Name
* Email
* Bio
* Avatar

---

## Password Settings

* Change password
* Password strength checker

---

## Email Settings

* Update email
* Email verification

---

# 12. Session Management

## Session Features

### Active Sessions

* Device list
* Browser information
* Last active session
* Revoke session

---

## Security

* Secure cookies
* Auto expiration
* Session refresh

---

# 13. Security Showcase Section

## Landing Page Security Cards

### Features

* Better Auth integration
* Secure authentication
* Google OAuth
* Encrypted session

---

## Security Headline

> “Keamanan Modern untuk Finansial Pribadi”

---

## Security Description

> “Uangku menggunakan Better Auth untuk menjaga keamanan akun dan data keuangan pengguna.”

---

# 14. Dashboard Preview Section

## Preview Components

### Dashboard Preview

* Total saldo
* Grafik pengeluaran
* Statistik bulanan
* Recent transaction

---

## Mockup Style

* Laptop mockup
* Phone mockup
* Floating neumorphism cards

---

# 15. Onboarding Experience

## First Login Experience

### Steps

1. Register akun
2. Verifikasi email
3. Setup profil
4. Tambah saldo awal
5. Buat target tabungan
6. Masuk dashboard

---

## Welcome Message

> “Selamat datang di Uangku ✨”

---

# 16. Features Showcase Section

## Main Features

### Cards

* Dashboard realtime
* Pencatatan transaksi
* Statistik finansial
* Export laporan
* Target tabungan
* Better Auth security

---

## Card Style

* Soft neumorphism
* Animated hover
* Rounded corner

---

# 17. Authentication Database Tables

## Users Table

| Field      | Type      |
| ---------- | --------- |
| id         | uuid      |
| name       | varchar   |
| email      | varchar   |
| password   | text      |
| image      | text      |
| created_at | timestamp |

---

## Sessions Table

| Field      | Type      |
| ---------- | --------- |
| id         | uuid      |
| user_id    | uuid      |
| token      | text      |
| expires_at | timestamp |

---

## Accounts Table

| Field    | Type    |
| -------- | ------- |
| id       | uuid    |
| user_id  | uuid    |
| provider | varchar |

---

# 18. Middleware & Route Protection

## Public Routes

* Landing page
* Login
* Register

---

## Protected Routes

* Dashboard
* Transactions
* Savings goals
* Statistics
* Settings

---

# 19. Landing Page Conversion Optimization

## Conversion Features

### CTA Strategy

* Sticky CTA
* Register highlight
* Dashboard preview
* Security showcase

---

## Trust Building

* Better Auth branding
* Secure login info
* Fast loading
* Responsive UI

---

# 20. Mobile Landing Page UX

## Mobile Features

### Mobile Navigation

* Hamburger menu
* Slide drawer
* Sticky CTA

---

## Mobile CTA

Button:

> Mulai Gratis

---

# 21. Animation System

## Animation Library

* Framer Motion

---

## Motion Effects

### Scroll Reveal

* Fade up
* Slide in
* Scale animation

---

## Button Hover

```css
transform: translateY(-2px);
```

---

## Active Button

```css
transform: scale(0.98);
```

---

# 22. Recommended Stack

## Frontend

* Astro.js
* React
* Tailwind CSS
* Framer Motion

---

## Backend

* Node.js
* Better Auth
* Drizzle ORM
* MySQL

---

# 23. Final Design Direction

## Landing Page Feel

Landing page harus terasa seperti:

* Modern fintech startup
* Premium SaaS platform
* Secure finance dashboard

---

## Authentication Feel

Authentication system harus:

* Cepat
* Aman
* Tidak membingungkan
* Modern

---

# 24. Final Product Vision

Uangku dirancang sebagai:

> “Modern Personal Finance Platform dengan pengalaman visual lembut, keamanan Better Auth, dan landing page fintech modern yang mampu menarik pengguna baru secara efektif.”
