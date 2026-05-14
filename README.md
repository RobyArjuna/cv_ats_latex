# ✨ Premium ATS-Friendly LaTeX CV Template

![CV Preview](file:///C:/Users/asus/.gemini/antigravity/brain/89d08b9f-3f08-4153-b386-33a2f5c7553b/cv_preview_mockup_1778740811833.png)

> **Designed for the Modern Developer.** Stop fighting with Word margins and start building your career with code.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![LaTeX: Compiled](https://img.shields.io/badge/LaTeX-Project-brightgreen.svg)](https://www.latex-project.org/)
[![ATS: Optimized](https://img.shields.io/badge/ATS-Optimized-orange.svg)](#)

## 💎 Why This Template?

In today's job market, your CV needs to satisfy two masters: **The Machine (ATS)** and **The Human (Recruiter)**. This template is precision-engineered to excel at both.

- **🤖 Machine Ready**: Zero complex graphics or weird columns that trip up legacy ATS parsers. Uses `glyphtounicode` for perfect text extraction.
- **🎨 Human Centered**: Minimalist aesthetic with a focus on white space, typography, and content hierarchy.
- **⚡ Developer Workflow**: Version control your career. Treat your CV like your code—clean, modular, and maintainable.

## 🚀 Quick Start

### 1. Environment Setup
You'll need a LaTeX distribution (MiKTeX, TeX Live) or just use [Overleaf](https://www.overleaf.com/).

### 2. Personalize
Edit `main.tex` and fill in your details:
```latex
\newcommand{\cvname}{Alexander Isaac}
\newcommand{\cvrole}{Data Scientist}
\newcommand{\cvemail}{[EMAIL_ADDRESS]}
```

### 3. Compile
```bash
pdflatex main.tex
```

## 🤖 AI-Native Support

This project is built to be AI-friendly. If you are using an AI coding assistant (like Antigravity, Cursor, or Windsurf), this repository includes a **Skill File** to help the AI manage your CV for you.

- **Location**: `.gemini/antigravity/skills/cv_management.md`
- **What it does**: Instructs your AI assistant on how to correctly add jobs, format projects, and troubleshoot LaTeX errors specific to this template.

Just ask your AI: *"Help me add a new job to my CV"* or *"Optimize my professional summary"*.

## 🛠️ Features at a Glance

| Feature | Description |
| :--- | :--- |
| **Typography** | Uses `lmodern` for crisp, professional character rendering. |
| **Hyperlinks** | Integrated `hyperref` for clickable contact info and projects. |
| **Structure** | Standard sections: Experience, Projects, Skills, and Education. |
| **Optimized** | `\pdfgentounicode=1` ensures characters are mapped correctly for search. |

## 📂 Project Structure

```text
├── main.tex        # Your live CV
├── template.tex    # Clean slate for new versions
├── LICENSE         # MIT Open Source
└── README.md       # This gorgeous guide
```

## 🤝 Contributing

Found a bug or have a suggestion to make it even more "premium"? Open a PR! 

---
Developed with ❤️ by [Roby Arjuna](https://robyarjuna.my.id)
