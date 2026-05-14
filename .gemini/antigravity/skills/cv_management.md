# 📑 CV Management & Builder Skill

This skill provides instructions for an AI assistant to help users manage, customize, and compile their ATS-friendly LaTeX CV.

## 🎯 Objectives
- Help users update their personal information accurately.
- Assist in adding new professional experience, projects, or certifications.
- Ensure the CV remains ATS-friendly (Applicant Tracking System).
- Troubleshoot LaTeX compilation issues.

## 🛠️ Core Commands & Syntax

### 1. Updating Personal Info
Users should update the `\newcommand` definitions in the "PERSONAL INFO" section of `main.tex`:
```latex
\newcommand{\cvname}{FULL NAME}
\newcommand{\cvrole}{ROLE}
% ...
```

### 2. Adding Experience
Use the `\resumeEntry` command followed by an `itemize` list:
```latex
\resumeEntry{Role Name}{Dates}{Company Name}{Location}
\begin{itemize}
    \item Achievement with action verbs.
    \item Metric-driven result.
\end{itemize}
```

### 3. Adding Projects
Use the following format for consistency:
```latex
\item \textbf{Project Name} | \textit{Tech Stack} \newline
Description of your contribution. \href{URL}{[Link]}
```
*Note: Always use `\newline` before a bracket `[` to avoid LaTeX compilation errors.*

## 🤖 Agent Instructions

### When asked to "Add a new job":
1. Ask the user for: Job Title, Company, Location, Dates, and 2-3 key achievements.
2. Format the achievements into bullet points using action verbs (e.g., "Led," "Optimized," "Developed").
3. Insert the new `\resumeEntry` at the top of the "Professional Experience" section.

### When asked to "Improve my summary":
1. Analyze the existing summary and the user's skills.
2. Rewrite it to be more punchy and metric-focused.
3. Ensure it stays under 4-5 sentences.

### When asked to "Compile or Build":
1. Check if `pdflatex` or `latexmk` is available.
2. Run `pdflatex main.tex`.
3. Inform the user of the output path (usually `main.pdf`).

## ⚠️ Safeguards
- **Never** add complex graphics, images, or multi-column layouts that break ATS parsing.
- **Always** ensure `\input{glyphtounicode}` and `\pdfgentounicode=1` are present.
- **Always** check for the `Missing number` error when a newline is followed by a bracket.

---
*Created for the CV-LaTeX-ATS Project.*
