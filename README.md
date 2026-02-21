# 🌌 IEA PORTAL (International Education Astronomy)

![Project Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge&logo=github)
![System Architect](https://img.shields.io/badge/Architect-Xzam-blue?style=for-the-badge&logo=linux)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-orange?style=for-the-badge&logo=pwa)
![Version](https://img.shields.io/badge/version-1.0.0-informational?style=for-the-badge)
![Open Source](https://img.shields.io/badge/Open--Source-Yes-brightgreen?style=for-the-badge)

> **"Exploring the Universe, One Line of Code at a Time."**

Selamat datang di repository resmi **Portal IEA** — sebuah sistem digital terintegrasi yang dirancang sebagai pusat edukasi, informasi, dan eksplorasi astronomi berbasis web modern.

Portal ini bukan sekadar website, melainkan fondasi ekosistem edukasi astronomi digital yang scalable, ringan, dan teroptimasi untuk performa maksimal.

---

# 🌠 Tentang Project Ini

**IEA Portal** adalah inisiatif teknologi dari *International Education Astronomy (IEA)* yang bertujuan membangun platform edukasi astronomi berbasis web yang:

- Cepat
- Stabil
- SEO-friendly
- Installable seperti aplikasi native
- Ringan tanpa ketergantungan framework berat

Sistem ini dibangun dengan filosofi:

> **Performance First. Structure First. Precision First.**

---

# 🚀 Fitur Utama Sistem

Portal ini dikembangkan sebagai **Progressive Web App (PWA)** yang memiliki kemampuan setara aplikasi native:

### 📱 PWA Enabled
- Dapat diinstal langsung ke Home Screen (Android/iOS)
- Tidak memerlukan App Store
- Mendukung icon, splash screen, dan theme color

### ⚡ High Performance Architecture
- Tanpa framework berat
- Tanpa dependency eksternal
- Render instan
- Struktur modular dan bersih

### 🔍 Advanced SEO Optimization
- `sitemap.xml` untuk indexing presisi
- `robots.txt` untuk kontrol crawler
- Meta tags optimal
- Struktur heading semantic

### 🎨 Cyber-Space UI Design
- Tema *Deep Space*
- Accent Neon Cyan (`#00f3ff`)
- Layout responsif
- Grid & Flexbox native

### 🛡️ Clean & Secure Architecture
- Tanpa build pipeline kompleks
- Tanpa server-side injection
- Static deployment (minim attack surface)

---

# 📂 Struktur File & Arsitektur Sistem

## Struktur Folder (Terorganisir)

```
PORTAL-IEA/
├── index.html                 # Homepage & main system interface
├── 404.html                   # Error page handling
│
├── pages/                     # Sub-halaman aplikasi
│   ├── information.html       # Dokumentasi info portal
│   ├── calculate.html         # Kalkulator sains
│   ├── live.html              # Live data & tracking satelit
│   ├── mind.html              # Jurnal & artikel ilmiah
│   ├── library.html           # Perpustakaan digital
│   └── admin.html             # Panel administrasi
│
├── css/                       # Stylesheet terorganisir
│   ├── style.css              # Styling utama
│   ├── calculate.css          # Styling kalkulator
│   └── inline-styles.css      # Extracted inline styles
│
├── js/                        # JavaScript modular
│   ├── script.js              # Core system logic
│   └── calculate.js           # Calculator module
│
├── assets/                    # Static resources
│   └── favicon-iea.png        # Brand icon
│
├── manifest.json              # PWA manifest configuration
├── sitemap.xml                # SEO sitemap
├── robots.txt                 # Search engine rules
└── README.md                  # Dokumentasi
```

## Legacy File References

| File | Fungsi |
|------|--------|
| `index.html` | Core system & main rendering |
| `manifest.json` | PWA identity & behavior |
| `sitemap.xml` | Search engine mapping |
| `robots.txt` | Bot permission control |
| `CODE_OF_CONDUCT.md` | Community guidelines |
| `SECURITY.md` | Security policy |
| `LICENSE` | Open source license |

---

# 🛠️ Teknologi yang Digunakan

Sistem dibangun dengan pendekatan **Vanilla Web Architecture**.

### Core Stack
- HTML5
- CSS3 (Flexbox & Grid)
- JSON
- XML

### Infrastructure
- Git & GitHub
- GitHub Pages Deployment
- Static Hosting Model

Tidak ada framework seperti React/Vue untuk menjaga:
- Zero bloat
- Zero runtime overhead
- Maximum performance

---

# 🧹 Code Organization & Cleanup

## Inisiatif Reorganisasi (v1.0.1)

Repository telah melalui reorganisasi untuk meningkatkan maintainability dan code quality:

### ✅ Improvements Completed
- **Duplikat Meta Tags**: Dihapus duplikat tags di `index.html` (pengurangan 4 tags)
- **Inline Styles**: Dipindahkan 30+ inline styles ke `css/inline-styles.css`
- **File Organization**: Struktur folder baru (css/, js/, pages/, assets/)
- **Path References**: Semua CSS, JS, dan asset links sudah diupdate
- **Clean Markup**: Removed unnecessary attributes dan formatting improvements
- **Naming Consistency**: File dan class naming standardized

### 📁 Struktur Folder Baru
```
css/              → All stylesheets
js/               → All JavaScript
pages/            → Sub-pages (information, calculate, live, etc)
assets/           → Images & static resources
```

### 📊 Code Quality Metrics
- **Meta Tags**: 24 tags (cleaned from 28)
- **Inline Styles**: Reduced from 40+ to 0 in HTML
- **CSS Files**: 3 organized files (style, calculate, inline)
- **JS Files**: 2 organized files (script, calculate)

---

# ⚙️ Development Setup (Local Testing)

Clone repository:

```bash
git clone https://github.com/XZAM730/PORTAL-IEA.git
cd PORTAL-IEA
```

Jalankan langsung:

```bash
index.html
```

Atau gunakan local server:

```bash
npx serve .
```

Akses di:
```
http://localhost:3000
```

---

# 🌐 Akses Live System

🔗 https://xzam730.github.io/PORTAL-IEA/

### Cara Install (Android/PC)

1. Buka link di Chrome
2. Klik menu titik tiga
3. Pilih **Install App**
4. Portal siap digunakan sebagai aplikasi

---

# 🗺 Roadmap Pengembangan

## Phase 1 (Completed)
- [x] Static Core Architecture
- [x] SEO Optimization Layer
- [x] PWA Integration
- [x] GitHub Pages Deployment

## Phase 2 (In Progress)
- [ ] Astronomy Article Module
- [ ] Offline Caching Enhancement
- [ ] Dynamic Content Loader

## Phase 3 (Planned)
- [ ] Admin Dashboard
- [ ] Event Tracker System
- [ ] Multi-language Support
- [ ] Astronomy Database Integration
- [ ] Observational Data Sync

---

# 📦 Versioning Strategy

Menggunakan Semantic Versioning.

**Current Version: v1.0.0**

Format:
MAJOR.MINOR.PATCH

- MAJOR → Arsitektur berubah
- MINOR → Fitur baru
- PATCH → Bug fix

---

# 📊 Performance Philosophy

IEA Portal dibangun dengan 4 prinsip utama:

1. Lightweight over Complexity
2. Structure over Improvisation
3. SEO Precision over Guesswork
4. Performance over Framework

Tujuannya sederhana:
Membangun sistem yang tahan lama, cepat, dan mudah dikembangkan tanpa ketergantungan eksternal.

---

# 🤝 Contribution Guidelines

Kami membuka kontribusi dari komunitas.

### Langkah Kontribusi:

1. Fork repository
2. Buat branch baru (`feature/nama-fitur`)
3. Commit dengan pesan jelas
4. Push
5. Buat Pull Request

### Aturan Dasar:

- Jangan merusak struktur SEO
- Jangan menambah framework berat
- Pertahankan clean architecture
- Diskusikan perubahan besar sebelum implementasi

---

# 🏛️ Project Governance

Portal ini dikelola oleh Divisi Teknologi IEA.

Perubahan strategis dilakukan melalui:
- Internal review
- Architecture approval
- System validation

---

# 👨‍💻 Author & Maintainer

System Architect: Xzam  
Role: Lead Developer & SEO Specialist  
Organization: International Education Astronomy (IEA)  
Location: Indonesia 🇮🇩  

---

# 📜 License

This project is licensed under the MIT License.

Silakan gunakan, modifikasi, dan distribusikan sesuai ketentuan lisensi.

---

# 🌌 Closing Statement

IEA Portal bukan sekadar project statis.

Ini adalah fondasi ekosistem edukasi astronomi digital yang akan terus berkembang.

> “Technology should empower knowledge, not complicate it.”

---

© 2026 International Education Astronomy  
System verified and operational.
