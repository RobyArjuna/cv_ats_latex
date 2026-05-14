import { test, expect } from '@playwright/test';
import { execFileSync } from 'child_process';

// Increase timeout because 5 jobs + 3 projects + detailed skills take time to compile
test.setTimeout(1500000);

test('Full CV Generation Flow - Extreme Data Stress Test', async ({ page }, testInfo) => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
  const generatePayloads: unknown[] = [];

  page.on('request', request => {
    if (request.url().includes('/api/generate') && request.method() === 'POST') {
      generatePayloads.push(request.postDataJSON());
    }
  });

  // 1. Navigate to the app
  await page.goto(baseUrl);

  // 2. Step 1: Personal Info
  await page.getByLabel(/Full Name/i).fill('John Doe');
  await page.getByLabel(/Target Role/i).fill('Senior Software Architect');
  await page.getByLabel(/Location/i).fill('Jakarta, Indonesia');
  await page.getByLabel(/Email/i).fill('john.doe@example.com');
  await page.getByLabel(/Website/i).fill('johndoe.dev');
  await page.getByLabel(/GitHub/i).fill('github.com/johndoe');
  await page.getByLabel(/LinkedIn/i).fill('linkedin.com/in/johndoe');
  await page.getByLabel(/Social\/Instagram/i).fill('instagram.com/johndoe');
  await page.getByLabel(/Phone/i).fill('+628123456789');

  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // 3. Step 2: Skills
  await page.getByLabel(/Professional Summary/i).fill(
    'Strategic and result-oriented Senior Software Architect with over 10 years of experience in designing, developing, and deploying scalable distributed systems. ' +
    'Proven track record in leading cross-functional teams to deliver high-impact cloud solutions, reducing infrastructure costs by 40%, and improving system performance by 60%. ' +
    'Expertise in Microservices architecture, Cloud Native technologies, and fostering a culture of technical excellence through mentorship and agile methodologies.'
  );
  await page.getByLabel(/Languages & Frameworks/i).fill('Go, TypeScript, Rust, Python, Java, C++, SQL');
  await page.getByLabel(/Tools & Technologies/i).fill('Kubernetes, AWS, GCP, Terraform, Docker, PostgreSQL, Redis, Kafka');
  await page.getByLabel(/Other Expertise/i).fill('System Design, Microservices, Agile Leadership, Public Speaking, DevSecOps');

  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // 4. Step 3: Experience (5 Entries Total)
  // Job 1 (Current)
  await page.getByLabel(/Title/i).nth(0).fill('Senior Software Architect');
  await page.getByLabel(/Company/i).nth(0).fill('Global Tech Solutions');
  await page.getByLabel(/Location/i).nth(0).fill('Singapore');
  await page.getByLabel(/Dates/i).nth(0).fill('Jan 2021 -- Present');
  await page.getByLabel(/Key Achievements/i).nth(0).fill('Designed a distributed payment system processing $1B+ annually.\nReduced system latency by 60% through aggressive caching.');

  // Job 2
  await page.getByRole('button', { name: /Add Experience/i }).click();
  await page.getByLabel(/Title/i).nth(1).fill('Lead Backend Developer');
  await page.getByLabel(/Company/i).nth(1).fill('FinTech Startup');
  await page.getByLabel(/Location/i).nth(1).fill('Jakarta');
  await page.getByLabel(/Dates/i).nth(1).fill('Jun 2018 -- Dec 2020');
  await page.getByLabel(/Key Achievements/i).nth(1).fill('Scalable API development for 5 million active users.\nMentored a team of 10 developers.');

  // Job 3 (Added)
  await page.getByRole('button', { name: /Add Experience/i }).click();
  await page.getByLabel(/Title/i).nth(2).fill('Senior Software Engineer');
  await page.getByLabel(/Company/i).nth(2).fill('E-Commerce Giant');
  await page.getByLabel(/Location/i).nth(2).fill('Bangalore, India');
  await page.getByLabel(/Dates/i).nth(2).fill('Mar 2016 -- May 2018');
  await page.getByLabel(/Key Achievements/i).nth(2).fill('Optimized search engine performance resulting in 15% increase in conversion.\nImplemented automated CI/CD pipelines.');

  // Job 4 (Added)
  await page.getByRole('button', { name: /Add Experience/i }).click();
  await page.getByLabel(/Title/i).nth(3).fill('Full Stack Developer');
  await page.getByLabel(/Company/i).nth(3).fill('Creative Agency');
  await page.getByLabel(/Location/i).nth(3).fill('Remote');
  await page.getByLabel(/Dates/i).nth(3).fill('Jan 2014 -- Feb 2016');
  await page.getByLabel(/Key Achievements/i).nth(3).fill('Delivered 20+ client projects using React and Node.js.\nReduced build times by 50% using Webpack optimizations.');

  // Job 5 (Added)
  await page.getByRole('button', { name: /Add Experience/i }).click();
  await page.getByLabel(/Title/i).nth(4).fill('Junior Web Developer');
  await page.getByLabel(/Company/i).nth(4).fill('Local IT Services');
  await page.getByLabel(/Location/i).nth(4).fill('Surabaya');
  await page.getByLabel(/Dates/i).nth(4).fill('Jul 2012 -- Dec 2013');
  await page.getByLabel(/Key Achievements/i).nth(4).fill('Developed responsive websites for small businesses.\nMaintained legacy PHP applications.');

  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // 5. Step 4: Projects (3 Entries)
  await page.getByLabel(/Project Name/i).nth(0).fill('OpenSource DB Engine');
  await page.getByLabel(/Tech Stack \/ Methods/i).nth(0).fill('C++, Rust, LSM Trees');
  await page.getByLabel(/Description/i).nth(0).fill('A high-performance key-value store optimized for SSDs.');

  await page.getByRole('button', { name: /Add Project/i }).click();
  await page.getByLabel(/Project Name/i).nth(1).fill('E-Commerce Scale Engine');
  await page.getByLabel(/Tech Stack \/ Methods/i).nth(1).fill('Next.js, Node.js, Kafka');
  await page.getByLabel(/Description/i).nth(1).fill('Handled 100k requests per second during flash sales.');

  await page.getByRole('button', { name: /Add Project/i }).click();
  await page.getByLabel(/Project Name/i).nth(2).fill('IoT Smart City Dashboard');
  await page.getByLabel(/Tech Stack \/ Methods/i).nth(2).fill('Python, MQTT, InfluxDB');
  await page.getByLabel(/Description/i).nth(2).fill('Real-time monitoring of 50,000+ city sensors.');

  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // 6. Step 5: Education
  await page.getByLabel(/Degree Name/i).fill('Master of Computer Science');
  await page.getByLabel(/University/i).fill('Stanford University');
  await page.getByLabel(/Dates/i).fill('2010 -- 2012');
  await page.getByLabel(/GPA/i).fill('3.9/4.0');

  await page.getByRole('button', { name: 'Next', exact: true }).click();

  // 7. Step 6: Additional Info
  await page.getByRole('button', { name: /Add Custom Section/i }).click();
  await page.getByLabel(/Section Title/i).nth(0).fill('Languages');
  await page.getByLabel(/Content/i).nth(0).fill('English (Professional Working), Indonesian (Native), Japanese (JLPT N2)');

  // 8. Generate PDF and verify
  const downloadPromise = page.waitForEvent('download', { timeout: 90000 });
  await page.getByRole('button', { name: /Generate PDF/i }).click();

  try {
    const download = await downloadPromise;
    const pdfPath = testInfo.outputPath('extreme_cv.pdf');
    await download.saveAs(pdfPath);
    const pdfText = execFileSync('pdftotext', [pdfPath, '-'], { encoding: 'utf-8' });

    expect(generatePayloads).toHaveLength(1);
    expect(generatePayloads[0]).toMatchObject({
      experience: expect.arrayContaining([
        expect.objectContaining({ title: 'Junior Web Developer' }),
      ]),
      education: expect.objectContaining({
        gpa: '3.9/4.0',
      }),
      additionalInfo: [
        expect.objectContaining({
          title: 'Languages',
          content: 'English (Professional Working), Indonesian (Native), Japanese (JLPT N2)',
        }),
      ],
    });
    expect(pdfText).toContain('Senior Software Architect');
    expect(pdfText).toContain('Junior Web Developer');
    expect(pdfText).toContain('GPA: 3.9/4.0');
    expect(pdfText).toContain('Languages');
    expect(pdfText).toContain('Japanese (JLPT N2)');

    await expect(page.locator('ol[data-sonner-toaster]')).toContainText('CV downloaded successfully!');
    console.log('Extreme CV (5 Jobs) generated at:', pdfPath);
  } catch (error) {
    const toastText = await page.locator('ol[data-sonner-toaster]').innerText();
    throw new Error(`Stress test failed. Toast: ${toastText}. Error: ${error}`);
  }
});
