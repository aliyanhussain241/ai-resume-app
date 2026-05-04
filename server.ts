import express from "express";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";
import * as pdfParseModule from "pdf-parse";

// @ts-ignore
const pdfParse = pdfParseModule.default || pdfParseModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for parsing CV
  app.post("/api/upload-cv", upload.single("cv"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let text = "";
      if (req.file.mimetype === "application/pdf") {
        const data = await pdfParse(req.file.buffer);
        text = data.text;
      } else {
        // Assume text/plain or try to parse as string
        text = req.file.buffer.toString("utf8");
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is required" });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Extract the following information from the provided CV text into JSON format:
{
  "fullName": "Name of the person",
  "email": "Email address",
  "phone": "Phone number",
  "linkedin": "LinkedIn URL",
  "currentRole": "Their current or most recent job title",
  "skills": ["An array of skill strings, split into categories if possible e.g., 'Languages: JS, TS'"],
  "experience": ["An array of their work experiences. Combine title, company, dates, and bullets into a single string for each role."],
  "education": "A summary of their education."
}

If any information is missing, use an empty string or empty array as appropriate. Do not make anything up.

CV TEXT:
${text}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const parsedData = JSON.parse(response.text?.trim() || "{}");
      res.json(parsedData);
    } catch (error: any) {
      console.error("Failed to parse CV:", error);
      res.status(500).json({ error: error?.message || "Failed to parse CV" });
    }
  });

  // API Route for generating resume
  app.post("/api/generate-resume", async (req, res) => {
    try {
      const { userData, jobData } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is required" });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are an expert Executive Recruiter and ATS (Applicant Tracking System) Optimization Specialist.
Your task is to take a user's raw experience, education, and skills, and tailor it specifically for a target job description.

Rules:
1. MAXIMIZE ATS MATCH: Naturally integrate keywords from the job description into the professional summary and experience bullets.
2. ACTION-ORIENTED: Rewrite bullet points to start with strong action verbs. Use the 'Accomplished [X] as measured by [Y], by doing [Z]' framework where possible.
3. TAILORED SUMMARY: Write a focused 2-3 sentence professional summary that positions the user perfectly for the target role.
4. NO LIES: Do not invent experiences or skills the user did not provide. Emphasize and reframe existing experience to fit the job.
5. RELEVANCE: Keep only the most relevant education and skills for this specific job. Group skills logically.`;

      const prompt = `
TARGET JOB:
Title: ${jobData.title}
Company: ${jobData.company}
Description:
${jobData.description}

USER RAW DATA:
Name: ${userData.fullName}
Contact Info: Email: ${userData.email} | Phone: ${userData.phone} | LinkedIn: ${userData.linkedin}
Current Role: ${userData.currentRole}
Skills:
${userData.skills.map((s: string, i: number) => `Group ${i + 1}: ${s}`).join("\n")}
Experience:
${userData.experience.map((e: string, i: number) => `Role ${i + 1}:\n${e}`).join("\n\n")}
Education:
${userData.education}

Based on the rules and the data above, generate a highly optimized resume structure in JSON matching this exact structure:
{
  "header": { "fullName": "string", "contactInfo": "string", "title": "string" },
  "summary": "string",
  "experience": [{ "title": "string", "company": "string", "dateRange": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "dateRange": "string" }],
  "skills": [{ "category": "string", "items": ["string"] }]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for factual consistency
          responseMimeType: "application/json",
        },
      });

      const jsonStr = response.text?.trim() || "";
      const parsedData = JSON.parse(jsonStr);
      
      if (userData.profilePicture) {
        parsedData.header.profilePicture = userData.profilePicture;
      }

      res.json(parsedData);
    } catch (error: any) {
      console.error("Failed to generate resume:", error);
      res.status(500).json({ error: error?.message || "Failed to generate resume" });
    }
  });

  // API Route for generating cover letter
  app.post("/api/generate-cover-letter", async (req, res) => {
    try {
      const { userData, jobData, tone } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is required" });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are an expert Career Coach and Cover Letter Writer.
Your task is to write a tailored, compelling cover letter based on a user's experience and a specific job description.

Rules:
1. TONE: The tone must be ${tone} (e.g. Professional, Confident, Friendly).
2. STRUCTURE: Include a strong opening hook, a body paragraph highlighting key matches, and a professional closing with a call to action.
3. PERSONALIZATION: Do NOT use generic statements. Reference the specific company name, job title, and specific user experiences.
4. FORMAT: Return plain text for the content, using standard paragraph breaks. Do NOT include placeholders like [Company Address] unless you can fill them from the provided data. Try to write it so it works as an email body or simple letter.
5. INSIGHTS: Provide an analysis of matched skills, missing keywords, and improvement tips.`;

      const prompt = `
TARGET JOB:
Title: ${jobData.title}
Company: ${jobData.company}
Description:
${jobData.description}

USER RAW DATA:
Name: ${userData.fullName}
Experience:
${userData.experience.map((e: string, i: number) => `Role ${i + 1}:\n${e}`).join("\n\n")}
Skills:
${userData.skills.map((s: string, i: number) => `Group ${i + 1}: ${s}`).join("\n")}

Respond using strictly JSON format with this exact structure:
{
  "content": "string (the full cover letter text with \\n for line breaks)",
  "insights": {
    "matchedSkills": ["string"],
    "missingKeywords": ["string"],
    "improvementTips": ["string"]
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      });

      const jsonStr = response.text?.trim() || "";
      const parsedData = JSON.parse(jsonStr);

      res.json(parsedData);
    } catch (error: any) {
      console.error("Failed to generate cover letter:", error);
      res.status(500).json({ error: error?.message || "Failed to generate cover letter" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
