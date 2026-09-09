# 🖼️ Image Converter

A fully automated, cross-platform batch image optimization tool powered by [Sharp](https://sharp.pixelplumbing.com/). Drop your images in, double-click a launcher, and get optimized variants in seconds.

---

## ✨ Features

- **One-click execution** — just double-click the launcher for your OS
- **Cross-platform** — works on macOS, Windows, and Linux
- **Auto-setup** — installs dependencies automatically if missing
- **Smart cleanup** — clears old output files before each run
- **5 optimized variants** per source image (AVIF, WebP, JPEG)
- **Summary table** — prints file sizes and totals after processing

---

## 📂 Project Structure

```
Image Converter/
├── input/              ← Place your source images here
├── output/             ← Generated variants appear here
├── convert.js          ← Core conversion script
├── run.command         ← macOS launcher (double-click)
├── run.sh              ← Linux launcher (bash run.sh)
├── run.bat             ← Windows launcher (double-click)
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Add Images

Place your source images (`.jpg`, `.jpeg`, `.png`, `.webp`, `.tiff`) into the `input/` folder.

### 2. Run the Converter

| Platform  | Action                                        |
| --------- | --------------------------------------------- |
| **macOS** | Double-click `run.command`                    |
| **Windows** | Double-click `run.bat`                      |
| **Linux** | Run `bash run.sh` in terminal                 |

> **Note:** Node.js (v18+) must be installed on your system. The launcher scripts will check for it and show install instructions if it's missing.

### 3. Collect Output

Find your optimized images in the `output/` folder.

---

## 🔧 Output Variants

For each source image, **5 variants** are generated:

| Variant              | Size         | Format | Quality | Notes                      |
| -------------------- | ------------ | ------ | ------- | -------------------------- |
| `[name]-2x.avif`     | Original     | AVIF   | 85      | Effort 6                   |
| `[name]-2x.webp`     | Original     | WebP   | 85      | Effort 6                   |
| `[name]-1x.avif`     | 50% scaled   | AVIF   | 85      | Effort 6                   |
| `[name]-1x.webp`     | 50% scaled   | WebP   | 85      | Effort 6                   |
| `[name]-1x.jpg`      | 50% scaled   | JPEG   | 85      | MozJPEG compression        |

**Example:** An input file `hero.jpg` (1200×800) produces:

```
hero-2x.avif   → 1200×800  (AVIF)
hero-2x.webp   → 1200×800  (WebP)
hero-1x.avif   →  600×400  (AVIF)
hero-1x.webp   →  600×400  (WebP)
hero-1x.jpg    →  600×400  (JPEG)
```

---

## 📊 Sample Output

```
============================================================
   IMAGE CONVERTER — Batch Optimization with Sharp
============================================================

Found 10 image(s) in input/
Cleaned 50 old file(s) from output/

  Processing: service-1 (896×1200) ...
  Processing: service-2 (1024×1024) ...
  ...

+----------------+--------------+-------------+-------------+-------------+-------------+-------------+-------------+
| Source         | Dimensions   |    Original |     2x AVIF |     2x WebP |     1x AVIF |     1x WebP |      1x JPG |
+----------------+--------------+-------------+-------------+-------------+-------------+-------------+-------------+
| service-1      | 896×1200     |    664.3 KB |    124.8 KB |     94.1 KB |     42.7 KB |     31.6 KB |     37.7 KB |
| service-2      | 1024×1024    |    594.8 KB |     88.0 KB |     58.5 KB |     32.6 KB |     22.1 KB |     29.1 KB |
| ...            | ...          |         ... |         ... |         ... |         ... |         ... |         ... |
+----------------+--------------+-------------+-------------+-------------+-------------+-------------+-------------+
| TOTAL          |              |   6278.3 KB |    968.8 KB |    708.9 KB |    352.2 KB |    265.7 KB |    335.8 KB |
+----------------+--------------+-------------+-------------+-------------+-------------+-------------+-------------+

  Generated 50 variants in 15.77s

============================================================
   ✅  ALL DONE — Check the output/ folder
============================================================
```

---

## ⚙️ Prerequisites

- **[Node.js](https://nodejs.org/)** v18 or later

All other dependencies (Sharp) are installed automatically on first run.

### Installing Node.js

| Platform    | Command / Link                                              |
| ----------- | ----------------------------------------------------------- |
| **macOS**   | `brew install node` or [download](https://nodejs.org/)      |
| **Windows** | [Download installer](https://nodejs.org/)                   |
| **Ubuntu**  | `sudo apt install nodejs npm`                               |
| **Fedora**  | `sudo dnf install nodejs npm`                               |

---

## 🛠️ Manual Usage

If you prefer running from the terminal directly:

```bash
# First time only
npm install

# Run the converter
node convert.js
```

---

## 📝 Supported Input Formats

| Format | Extensions              |
| ------ | ----------------------- |
| JPEG   | `.jpg`, `.jpeg`         |
| PNG    | `.png`                  |
| WebP   | `.webp`                 |
| TIFF   | `.tiff`, `.tif`         |

---

## 📄 License

MIT
