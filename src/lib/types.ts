export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  currentRole: string;
  experience: string[];
  education: string;
  skills: string[];
  profilePicture?: string;
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
}

export interface CoverLetterData {
  content: string;
  insights: {
    matchedSkills: string[];
    missingKeywords: string[];
    improvementTips: string[];
  };
}

export interface ResumeData {
  header: {
    fullName: string;
    contactInfo: string;
    title: string;
    profilePicture?: string;
  };
  summary: string;
  experience: {
    title: string;
    company: string;
    dateRange: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    dateRange: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
}
