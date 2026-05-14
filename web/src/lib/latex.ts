import { exec } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execPromise = promisify(exec);

import { CVData } from '@/types/cv';

function escapeLatex(value: string): string {
  return value
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function renderAdditionalInfo(data: CVData): string {
  return data.additionalInfo
    .filter(info => info.title.trim() && info.content.trim())
    .map(info => {
      const items = info.content
        .split(/\r?\n/)
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => `    \\item ${escapeLatex(item)}`)
        .join('\n');

      return `\\section*{${escapeLatex(info.title)}}\n\\begin{itemize}\n${items}\n\\end{itemize}`;
    })
    .join('\n\n');
}

function renderProjectLink(link: string): string {
  const trimmed = link.trim();
  return trimmed ? ` \\href{${trimmed}}{[Link]}` : '';
}

export async function generatePDF(data: CVData): Promise<Buffer> {
  const jobId = uuidv4();
  const workDir = path.join(process.cwd(), 'tmp', jobId);
  await fs.ensureDir(workDir);

  try {
    // 1. Prepare the LaTeX content
    let template = await fs.readFile(path.join(process.cwd(), '..', 'template.tex'), 'utf-8');

    // Replace personal info
    template = template.replace(/\\newcommand{\\cvname}{.*?}/, `\\newcommand{\\cvname}{${escapeLatex(data.personalInfo.name)}}`);
    template = template.replace(/\\newcommand{\\cvrole}{.*?}/, `\\newcommand{\\cvrole}{${escapeLatex(data.personalInfo.role)}}`);
    template = template.replace(/\\newcommand{\\cvlocation}{.*?}/, `\\newcommand{\\cvlocation}{${escapeLatex(data.personalInfo.location)}}`);
    template = template.replace(/\\newcommand{\\cvemail}{.*?}/, `\\newcommand{\\cvemail}{${escapeLatex(data.personalInfo.email)}}`);
    template = template.replace(/\\newcommand{\\cvwebsite}{.*?}/, `\\newcommand{\\cvwebsite}{${escapeLatex(data.personalInfo.website)}}`);
    template = template.replace(/\\newcommand{\\cvgithub}{.*?}/, `\\newcommand{\\cvgithub}{${escapeLatex(data.personalInfo.github)}}`);
    template = template.replace(/\\newcommand{\\cvlinkedin}{.*?}/, `\\newcommand{\\cvlinkedin}{${escapeLatex(data.personalInfo.linkedin)}}`);
    template = template.replace(/\\newcommand{\\cvsocial}{.*?}/, `\\newcommand{\\cvsocial}{${escapeLatex(data.personalInfo.social)}}`);
    template = template.replace(/\\newcommand{\\cvphone}{.*?}/, `\\newcommand{\\cvphone}{${escapeLatex(data.personalInfo.phone)}}`);

    // Replace Summary
    template = template.replace(/\\section\*{Professional Summary}\n.*?\n/, `\\section*{Professional Summary}\n${escapeLatex(data.summary)}\n`);

    // Replace Skills
    let skillsSection = `\\begin{itemize}\n`;
    skillsSection += `    \\item \\textbf{Languages \\& Frameworks:} ${escapeLatex(data.skills.languages)}\n`;
    skillsSection += `    \\item \\textbf{Tools \\& Technologies:} ${escapeLatex(data.skills.tools)}\n`;
    skillsSection += `    \\item \\textbf{Other Expertise:} ${escapeLatex(data.skills.others)}\n`;
    skillsSection += `\\end{itemize}`;
    template = template.replace(/\\section\*{Technical Skills}\n\\begin{itemize}[\s\S]*?\\end{itemize}/, `\\section*{Technical Skills}\n${skillsSection}`);

    // Replace Experience
    let expSection = '';
    data.experience.forEach(exp => {
      expSection += `\\resumeEntry{${escapeLatex(exp.title)}}{${escapeLatex(exp.dates)}}{${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}\n`;
      expSection += `\\begin{itemize}\n`;
      exp.points.forEach(p => {
        expSection += `    \\item ${escapeLatex(p)}\n`;
      });
      expSection += `\\end{itemize}\n\n`;
    });
    template = template.replace(/\\section\*{Professional Experience}[\s\S]*?(?=\\section\*{Key Projects})/, `\\section*{Professional Experience}\n\n${expSection}`);

    // Replace Projects
    let projSection = `\\begin{itemize}\n`;
    data.projects.forEach(proj => {
      projSection += `    \\item \\textbf{${escapeLatex(proj.name)}} | \\textit{${escapeLatex(proj.tech)}} \\newline\n`;
      projSection += `    ${escapeLatex(proj.description)}${renderProjectLink(proj.link)}\n\n`;
    });
    projSection += `\\end{itemize}`;
    template = template.replace(/\\section\*{Key Projects}\n\\begin{itemize}[\s\S]*?\\end{itemize}/, `\\section*{Key Projects}\n${projSection}`);

    // Replace Education
    const eduSection = `\\resumeEntry{${escapeLatex(data.education.degree)}}{${escapeLatex(data.education.dates)}}{${escapeLatex(data.education.university)}}{GPA: ${escapeLatex(data.education.gpa)}}`;
    template = template.replace(/\\section\*{Education}\n\\resumeEntry{.*?}{.*?}{.*?}{.*?}/, `\\section*{Education}\n${eduSection}`);

    // Replace the template's sample certifications/additional block with user-provided sections.
    const additionalSection = renderAdditionalInfo(data);
    template = template.replace(
      /% --- CERTIFICATIONS ---[\s\S]*?(?=\\end\{document\})/,
      additionalSection ? `${additionalSection}\n\n` : ''
    );

    const texPath = path.join(workDir, 'main.tex');
    await fs.writeFile(texPath, template);
    const pdfPath = path.join(workDir, 'main.pdf');

    // 2. Compile LaTeX
    // Run pdflatex twice for references if needed, but for CV once is usually enough
    try {
      await execPromise(`pdflatex -interaction=nonstopmode main.tex`, { cwd: workDir });
    } catch (error) {
      if (!await fs.pathExists(pdfPath)) {
        throw error;
      }
    }

    if (!await fs.pathExists(pdfPath)) {
      throw new Error('PDF generation failed');
    }

    const pdfBuffer = await fs.readFile(pdfPath);
    return pdfBuffer;
  } finally {
    // 3. Cleanup
    await fs.remove(workDir);
  }
}
