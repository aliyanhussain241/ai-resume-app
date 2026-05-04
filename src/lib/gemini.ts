import { CoverLetterData, JobDescription, ResumeData, UserData } from "./types";

export async function generateOptimizedResume(
  userData: UserData,
  jobData: JobDescription,
  onStatusUpdate: (status: string) => void
): Promise<ResumeData> {
  onStatusUpdate("Analyzing job description and extracting keywords...");

  try {
    const response = await fetch("/api/generate-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userData, jobData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to generate resume");
    }

    onStatusUpdate("Finalizing formatting...");
    const parsedData = await response.json() as ResumeData;
    return parsedData;
  } catch (error) {
    console.error("Failed to generate resume:", error);
    throw new Error("Failed to generate resume. Please try again.");
  }
}

export async function generateCoverLetter(
  userData: UserData,
  jobData: JobDescription,
  tone: string,
  onStatusUpdate: (status: string) => void
): Promise<CoverLetterData> {
  onStatusUpdate("Analyzing background against job requirements...");

  try {
    const response = await fetch("/api/generate-cover-letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userData, jobData, tone }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to generate cover letter");
    }

    onStatusUpdate("Finalizing insights...");
    const parsedData = await response.json() as CoverLetterData;
    return parsedData;
  } catch (error) {
    console.error("Failed to generate cover letter:", error);
    throw new Error("Failed to generate cover letter. Please try again.");
  }
}
