import { motion, AnimatePresence } from "motion/react";
import { FileText, Briefcase, Download, ArrowRight, Loader2, Wand2, ArrowLeft, Star, CheckCircle2, Smartphone, Monitor, Sparkles, CheckCircle, Target, CircleDollarSign, Crown, Search, Send, MessageSquare, Gauge, User, Mail, Phone, Linkedin, Image as ImageIcon, GraduationCap, Code2, UploadCloud } from "lucide-react";
import React, { useState, useEffect } from "react";
import { CoverLetterData, JobDescription, ResumeData, UserData } from "./lib/types";
import { generateCoverLetter, generateOptimizedResume } from "./lib/gemini";
import { ResumePreview, DesignId } from "./components/ResumePreview";

enum Step {
  LANDING,
  DETAILS,
  DESIGN,
  JOB,
  GENERATING,
  DONE,
  COVER_LETTER,
  BLOG,
  PREMIUM,
}

export default function App() {
  const [step, setStep] = useState<Step>(Step.LANDING);
  const [activeToolsTab, setActiveToolsTab] = useState(1);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    if (step !== Step.LANDING) return;
    
    const timer = setInterval(() => {
      setActiveToolsTab((prev) => (prev % 4) + 1);
      setProgressKey((prev) => prev + 1);
    }, 5000); // 5 seconds per tab

    return () => clearInterval(timer);
  }, [progressKey, step]);

  const handleTabClick = (index: number) => {
    setActiveToolsTab(index);
    setProgressKey(prev => prev + 1);
  };

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [designId, setDesignId] = useState<DesignId>('classic');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    currentRole: "",
    skills: [""],
    experience: [""],
    education: "",
  });
  const [jobData, setJobData] = useState<JobDescription>({
    title: "",
    company: "",
    description: "",
  });
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [coverLetterState, setCoverLetterState] = useState<'IDLE' | 'GENERATING' | 'DONE'>('IDLE');
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData | null>(null);
  const [coverLetterTone, setCoverLetterTone] = useState<string>('Professional');

  const Logo = () => (
    <div className="flex items-center gap-2 font-black text-2xl tracking-tighter select-none z-50">
      <div className="bg-[#FF6321] text-white p-1.5 rounded-lg -rotate-3 [box-shadow:2px_2px_0px_#0a0a0a]">
        <FileText size={24} strokeWidth={2.5} />
      </div>
      <span className="text-[#0a0a0a]">ResuBeat</span>
    </div>
  );

  const Header = () => (
    <div className="absolute top-6 left-6 right-6 lg:top-10 lg:left-12 lg:right-12 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 z-50 print:hidden">
      <div className="flex-1 flex justify-start">
        <div className="cursor-pointer" onClick={() => setStep(Step.LANDING)}>
          <Logo />
        </div>
      </div>
      <nav className="flex-1 flex flex-wrap justify-center gap-4 md:gap-8 font-bold text-[10px] lg:text-[11px] tracking-widest lg:tracking-[0.2em] uppercase text-[#0a0a0a]">
        <span 
          onClick={() => setStep(Step.LANDING)}
          className={`cursor-pointer pb-1 ${step === Step.LANDING ? 'border-b-2 border-[#FF6321] text-[#FF6321]' : 'hover:text-[#FF6321] transition-colors'}`}
        >
          Home
        </span>
        <span 
          onClick={() => setStep(Step.DETAILS)}
          className={`cursor-pointer pb-1 ${[Step.DETAILS, Step.DESIGN, Step.JOB, Step.GENERATING, Step.DONE].includes(step) ? 'border-b-2 border-[#FF6321] text-[#FF6321]' : 'hover:text-[#FF6321] transition-colors'}`}
        >
          Resume
        </span>
        <span 
          onClick={() => setStep(Step.COVER_LETTER)}
          className={`cursor-pointer pb-1 ${step === Step.COVER_LETTER ? 'border-b-2 border-[#FF6321] text-[#FF6321]' : 'hover:text-[#FF6321] transition-colors'}`}
        >
          Cover Letter
        </span>
        <span 
          onClick={() => setStep(Step.BLOG)}
          className={`cursor-pointer pb-1 ${step === Step.BLOG ? 'border-b-2 border-[#FF6321] text-[#FF6321]' : 'hover:text-[#FF6321] transition-colors'}`}
        >
          Blog
        </span>
      </nav>
      <div className="flex-1 flex justify-end">
      </div>
    </div>
  );

  // Add CV uploading state
  const [isUploading, setIsUploading] = useState(false);

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to upload CV");
      }

      const parsedData = await response.json();
      
      // Update userData with the parsed data
      setUserData(prev => ({
        ...prev,
        fullName: parsedData.fullName || prev.fullName,
        email: parsedData.email || prev.email,
        phone: parsedData.phone || prev.phone,
        linkedin: parsedData.linkedin || prev.linkedin,
        currentRole: parsedData.currentRole || prev.currentRole,
        skills: Array.isArray(parsedData.skills) && parsedData.skills.length > 0 ? parsedData.skills : prev.skills,
        experience: Array.isArray(parsedData.experience) && parsedData.experience.length > 0 ? parsedData.experience : prev.experience,
        education: parsedData.education || prev.education,
      }));

    } catch (err: any) {
      setError(err.message || "Something went wrong parsing your CV.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    setStep(Step.GENERATING);
    setError(null);
    try {
      const data = await generateOptimizedResume(userData, jobData, setStatusMessage);
      setResumeData(data);
      setStep(Step.DONE);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setStep(Step.JOB);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setCoverLetterState('GENERATING');
    setError(null);
    try {
      const data = await generateCoverLetter(userData, jobData, coverLetterTone, setStatusMessage);
      setCoverLetterData(data);
      setCoverLetterState('DONE');
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setCoverLetterState('IDLE');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePrintCoverLetter = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-[#0a0a0a] font-sans selection:bg-[#FF6321] selection:text-white print:bg-white print:m-0 print:p-0">
      <AnimatePresence mode="wait">
        {/* LANDING PAGE */}
        {step === Step.LANDING && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-[#f9fafb] relative print:hidden overflow-x-hidden"
          >
            <Header />
            <div className="max-w-7xl mx-auto px-6 pt-32 lg:pt-48 pb-20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                 <div className="max-w-xl relative z-10">
                   <h1 className="text-4xl md:text-5xl lg:text-[72px] font-medium text-[#2d3748] leading-[1.1] mb-6">
                     This resume builder gets you <span className="text-[#FF6321]">a remote job</span>
                   </h1>
                   <p className="text-[20px] text-[#4a5568] mb-10 leading-[1.6]">
                     Only 2% of resumes win. Yours will be one of them.
                   </p>
                   <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                     <button
                       onClick={() => setStep(Step.DETAILS)}
                       className="relative w-full sm:w-auto px-10 py-4 bg-[#FF6321] text-white font-bold text-[17px] rounded-full transition-all hover:-translate-y-0.5 active:scale-95 shadow-[0_8px_25px_-8px_rgba(255,99,33,0.6)] hover:shadow-[0_12px_30px_-10px_rgba(255,99,33,0.8)] flex justify-center items-center overflow-hidden group"
                     >
                       <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
                       <span className="relative z-10">Create my resume</span>
                     </button>
                     <button
                       onClick={() => setStep(Step.DETAILS)}
                       className="w-full sm:w-auto px-10 py-4 bg-white text-[#4b5563] hover:text-[#111827] font-bold text-[17px] rounded-full border border-[#e5e7eb] hover:border-[#FF6321] hover:bg-[#fff9f6] transition-all hover:-translate-y-0.5 active:scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-8px_rgba(255,99,33,0.3)] flex justify-center items-center"
                     >
                       Upload my resume
                     </button>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="flex items-center gap-2 text-[#4a5568]">
                       <div className="bg-[#22c55e] rounded-full p-0.5">
                         <CheckCircle2 size={16} className="text-white" />
                       </div>
                       <span className="text-[15px]"><strong className="text-[#22c55e] font-semibold">39%</strong> more likely to land the job</span>
                     </div>
                     <div className="flex items-center gap-2 text-[15px] text-[#4a5568]">
                       <div className="flex text-[#00b67a] gap-1 items-center">
                          <Star size={20} fill="#00b67a" className="text-[#00b67a]" />
                          <span className="font-bold text-[#1a202c]">Trustpilot</span>
                       </div>
                       <span>4.4 out of 5 | 37,389 reviews</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center mt-8 lg:mt-0 transform scale-[0.6] sm:scale-[0.8] lg:scale-100 origin-top -mb-[150px] sm:-mb-[80px] lg:mb-0">
                   {/* Background Glow */}
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 0.7 }}
                     transition={{ duration: 1.5, delay: 0.2 }}
                     className="absolute w-[450px] h-[450px] bg-orange-50 rounded-full blur-3xl z-0"
                   />
                   
                   {/* Main Resume Paper */}
                   <motion.div 
                     initial={{ opacity: 0, y: 40 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="absolute bg-white rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] p-8 w-[400px] h-[520px] z-10 border border-gray-100/50 flex flex-col pt-12 text-left"
                   >
                     <div className="border-b border-gray-100 pb-5 mb-5 select-none">
                       <h3 className="text-[#FF6321] text-3xl font-serif font-semibold tracking-tight">Alice Hart</h3>
                       <p className="text-gray-500 text-sm mt-1">Math Teacher</p>
                     </div>
                     <div className="space-y-2 mb-6">
                       <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                       <div className="h-2.5 bg-gray-200 rounded w-11/12"></div>
                       <div className="h-2.5 bg-gray-200 rounded w-10/12"></div>
                       <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                     </div>
                     <div className="space-y-4 flex-1">
                       <div>
                         <p className="text-sm font-semibold text-gray-400 mb-2">Employment History</p>
                         <div className="space-y-2">
                           <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                           <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                           <div className="h-2.5 bg-gray-200 rounded w-3/4"></div>
                         </div>
                       </div>
                       <div>
                         <div className="space-y-2">
                           <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                           <div className="h-2.5 bg-gray-200 rounded w-5/6"></div>
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 
                   {/* Floating Avatar */}
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.8, x: 20 }}
                     animate={{ opacity: 1, scale: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.3, ease: "backOut" }}
                     className="absolute top-12 right-4 w-40 h-40 rounded-full border-[6px] border-white shadow-xl bg-orange-400 z-20 overflow-hidden hover:scale-105 transition-transform duration-300"
                   >
                      <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80" alt="Avatar" className="w-full h-full object-cover" />
                   </motion.div>
                 
                   {/* Floating Resume Score */}
                   <motion.div 
                     initial={{ opacity: 0, x: -30 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                     className="absolute top-44 -left-12 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2.5 flex items-center gap-3 z-30 hover:-translate-y-1 transition-transform duration-300 pointer-events-auto cursor-default"
                   >
                      <div className="bg-[#22c55e] text-white font-bold text-lg px-2.5 py-1 rounded-lg">81%</div>
                      <div className="text-sm font-bold text-[#2d3748] leading-tight pr-2">Resume<br/>Score</div>
                   </motion.div>
                 
                   {/* Floating ATS Perfect */}
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.8, x: 30 }}
                     animate={{ opacity: 1, scale: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.6, ease: "backOut" }}
                     className="absolute top-[40%] right-[-10%] bg-[#FF6321] text-white px-4 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] font-bold flex items-center gap-2 z-30 hover:scale-105 transition-transform duration-300 cursor-default"
                   >
                       <Wand2 size={18} /> ATS Perfect
                   </motion.div>
                 
                   {/* Floating Skills Card */}
                   <motion.div 
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                     className="absolute bottom-20 -right-8 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20 w-56 border border-gray-50 hover:-translate-y-1 transition-transform duration-300"
                   >
                      <h4 className="font-bold text-[#2d3748] text-opacity-90 mb-3 flex justify-between items-center">Skills <span className="text-gray-400 font-normal">✎</span></h4>
                      <div className="space-y-2.5">
                        <div className="bg-[#f8fafc] text-[#475569] text-[13px] py-1.5 px-3 rounded-md font-medium border border-gray-100">Management Skills</div>
                        <div className="bg-[#f8fafc] text-[#475569] text-[13px] py-1.5 px-3 rounded-md font-medium border border-gray-100">Analytical Thinking</div>
                        <div className="bg-[#f8fafc] text-[#475569] text-[13px] py-1.5 px-3 rounded-md font-medium border border-gray-100">Leadership</div>
                      </div>
                      <button className="text-[#FF6321] font-bold text-sm mt-3 pt-3 flex items-center gap-1 w-full justify-center border-t border-orange-50 hover:bg-orange-50 transition-colors rounded-none">
                        + Add skill
                      </button>
                   </motion.div>
                 
                   {/* Floating Ask AI */}
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                     className="absolute bottom-16 -left-8 bg-white p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-30 flex items-center gap-3 border border-gray-50 pr-12 w-80 hover:scale-105 transition-transform duration-300 pointer-events-auto"
                   >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 via-orange-500 to-orange-600 border-2 border-white shadow-sm flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-500 text-sm font-medium">Ask AI coach anything...</span>
                   </motion.div>
                 </div>
              </div>
            </div>
            
            {/* Stats & Features Section */}
            <div className="max-w-7xl mx-auto px-6 pb-24 mt-20 text-center">
               <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
                  <div className="bg-orange-50 p-2.5 rounded-xl text-orange-400 shrink-0">
                    <Wand2 size={32} />
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#2d3748] text-center sm:text-left">
                    <span className="text-[#FF6321]">47,602</span> resumes created today
                  </h2>
               </div>

               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {/* Feature 1 */}
                  <div className="bg-[#f8fafc] rounded-2xl p-8 hover:shadow-md transition-shadow">
                    <Sparkles size={32} className="text-[#1a202c] mb-6" />
                    <h3 className="font-semibold text-[#1a202c] text-xl mb-3">A draft in 10 mins</h3>
                    <p className="text-[#64748b] text-[15px] leading-relaxed">The AI builder is 10 x faster than doing on your own.</p>
                  </div>
                  
                  {/* Feature 2 */}
                  <div className="bg-[#f8fafc] rounded-2xl p-8 hover:shadow-md transition-shadow">
                    <div className="bg-[#1a202c] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mb-6">A+</div>
                    <h3 className="font-semibold text-[#1a202c] text-xl mb-3">Zero mistakes</h3>
                    <p className="text-[#64748b] text-[15px] leading-relaxed">Don't stress over typos; you'll sound great!</p>
                  </div>
                  
                  {/* Feature 3 */}
                  <div className="bg-[#f8fafc] rounded-2xl p-8 hover:shadow-md transition-shadow">
                    <Target size={32} className="text-[#1a202c] mb-6" />
                    <h3 className="font-semibold text-[#1a202c] text-xl mb-3">ATS templates</h3>
                    <p className="text-[#64748b] text-[15px] leading-relaxed">Your resume will be 100% compliant. Recruiters will see you.</p>
                  </div>
                  
                  {/* Feature 4 */}
                  <div className="bg-[#f8fafc] rounded-2xl p-8 hover:shadow-md transition-shadow">
                    <CircleDollarSign size={32} className="text-[#1a202c] mb-6" />
                    <h3 className="font-semibold text-[#1a202c] text-xl mb-3">Get paid 7% more</h3>
                    <p className="text-[#64748b] text-[15px] leading-relaxed">We can help you negotiate a higher starting salary...</p>
                  </div>
               </div>
            </div>

            {/* Tools Section */}
            <div className="max-w-7xl mx-auto px-6 pb-32 text-center">
               <h2 className="text-4xl lg:text-5xl font-medium text-[#2d3748] mb-16">
                 Every tool you need is here...
               </h2>
               
               <div className="grid lg:grid-cols-3 gap-6 h-auto lg:h-[480px]">
                  {/* Sidebar Nav */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] text-left flex flex-col overflow-hidden">
                     <div onClick={() => handleTabClick(1)} className={`flex items-center p-6 lg:p-7 gap-4 cursor-pointer relative ${activeToolsTab === 1 ? 'bg-[#fff3ed]' : 'hover:bg-gray-50'}`}>
                        {activeToolsTab === 1 && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FF6321]"></div>}
                        <div className="text-[#1a202c]">
                          <FileText size={24} />
                        </div>
                        <div className={`flex-1 text-[17px] font-medium ${activeToolsTab === 1 ? 'text-[#FF6321]' : 'text-[#1a202c]'}`}>1. Get Noticed</div>
                        {activeToolsTab === 1 && (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
                              <circle cx="12" cy="12" r="10" stroke="#fed7aa" strokeWidth="3" fill="none" />
                              <motion.circle key={progressKey} cx="12" cy="12" r="10" stroke="#FF6321" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="62.83" initial={{ strokeDashoffset: 62.83 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 5, ease: "linear" }} />
                            </svg>
                          </div>
                        )}
                     </div>
                     <div onClick={() => handleTabClick(2)} className={`flex items-center p-6 lg:p-7 gap-4 cursor-pointer relative ${activeToolsTab === 2 ? 'bg-[#fff3ed]' : 'hover:bg-gray-50'}`}>
                        {activeToolsTab === 2 && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FF6321]"></div>}
                        <div className="text-[#1a202c]">
                          <Briefcase size={24} />
                        </div>
                        <div className={`flex-1 text-[17px] font-medium ${activeToolsTab === 2 ? 'text-[#FF6321]' : 'text-[#1a202c]'}`}>2. Get Hired</div>
                        {activeToolsTab === 2 && (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
                              <circle cx="12" cy="12" r="10" stroke="#fed7aa" strokeWidth="3" fill="none" />
                              <motion.circle key={progressKey} cx="12" cy="12" r="10" stroke="#FF6321" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="62.83" initial={{ strokeDashoffset: 62.83 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 5, ease: "linear" }} />
                            </svg>
                          </div>
                        )}
                     </div>
                     <div onClick={() => handleTabClick(3)} className={`flex items-center p-6 lg:p-7 gap-4 cursor-pointer relative ${activeToolsTab === 3 ? 'bg-[#fff3ed]' : 'hover:bg-gray-50'}`}>
                        {activeToolsTab === 3 && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FF6321]"></div>}
                        <div className="text-[#1a202c]">
                          <CircleDollarSign size={24} />
                        </div>
                        <div className={`flex-1 text-[17px] font-medium ${activeToolsTab === 3 ? 'text-[#FF6321]' : 'text-[#1a202c]'}`}>3. Get Paid More</div>
                        {activeToolsTab === 3 && (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
                              <circle cx="12" cy="12" r="10" stroke="#fed7aa" strokeWidth="3" fill="none" />
                              <motion.circle key={progressKey} cx="12" cy="12" r="10" stroke="#FF6321" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="62.83" initial={{ strokeDashoffset: 62.83 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 5, ease: "linear" }} />
                            </svg>
                          </div>
                        )}
                     </div>
                     <div onClick={() => handleTabClick(4)} className={`flex items-center p-6 lg:p-7 gap-4 cursor-pointer relative ${activeToolsTab === 4 ? 'bg-[#fff3ed]' : 'hover:bg-gray-50'}`}>
                        {activeToolsTab === 4 && <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#FF6321]"></div>}
                        <div className="text-[#1a202c]">
                          <Crown size={24} />
                        </div>
                        <div className={`flex-1 text-[17px] font-medium ${activeToolsTab === 4 ? 'text-[#FF6321]' : 'text-[#1a202c]'}`}>4. Get promoted</div>
                        {activeToolsTab === 4 && (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
                              <circle cx="12" cy="12" r="10" stroke="#fed7aa" strokeWidth="3" fill="none" />
                              <motion.circle key={progressKey} cx="12" cy="12" r="10" stroke="#FF6321" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="62.83" initial={{ strokeDashoffset: 62.83 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 5, ease: "linear" }} />
                            </svg>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* Content Cards */}
                  {activeToolsTab === 1 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="col-span-1 lg:col-span-2 grid lg:grid-cols-2 gap-6 h-full">
                      {/* Main Builder Card */}
                      <div className="bg-[#fff3ed] rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                          <div className="flex items-center gap-3 w-full mb-4">
                            <div className="bg-white p-2 rounded-xl text-[#FF6321] shadow-sm"><FileText size={28} className="fill-[#FF6321]/20" /></div>
                            <h3 className="text-[26px] font-semibold text-[#1a202c]">Resume Builder</h3>
                          </div>
                          <p className="text-[#4b5563] text-[16px] leading-relaxed mb-8 z-10 w-full">Build the resume that gets you hired. We designed the builder with top employers. Finish a draft 20 mins with "Recruiter-AI".</p>
                          
                          <div className="w-[280px] h-[340px] bg-white rounded-t-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-8 absolute bottom-0 translate-y-20 hover:translate-y-8 transition-transform duration-500 z-0 flex flex-col">
                             <div className="border-b border-gray-100 pb-4 mb-4">
                                <h4 className="font-bold font-serif text-[20px] text-[#1a202c]">Chloé Anne Bouchard</h4>
                             </div>
                             <div className="space-y-3 mb-6">
                                <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                                <div className="h-1.5 w-full bg-gray-200 rounded"></div>
                                <div className="h-1.5 w-3/4 bg-gray-200 rounded"></div>
                             </div>
                             <div className="flex gap-6">
                               <div className="w-1/3 space-y-3">
                                  <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                                  <div className="h-1.5 w-full bg-gray-100 rounded"></div>
                               </div>
                               <div className="w-2/3 space-y-4">
                                  <div className="h-8 w-full bg-gray-50 rounded border border-gray-100"></div>
                                  <div className="h-8 w-full bg-gray-50 rounded border border-gray-100"></div>
                               </div>
                             </div>
                          </div>
                          
                          <div className="absolute bottom-40 -mr-48 bg-white rounded-xl shadow-lg p-2.5 flex items-center gap-2 border border-gray-50 z-20">
                            <div className="bg-[#22c55e] text-white text-sm font-bold px-2 py-1 rounded-md">81%</div>
                            <div className="text-[12px] font-bold text-gray-700 leading-tight pr-1">Resume<br/>Score</div>
                          </div>
                      </div>
                      
                      {/* Recruiter Match Card */}
                      <div className="bg-[#fff3ed] rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                          <div className="flex items-center gap-3 w-full mb-4">
                            <div className="bg-white p-2 rounded-xl text-[#FF6321] shadow-sm"><Target size={28} className="fill-[#FF6321]/20" /></div>
                            <h3 className="text-[26px] font-semibold text-[#1a202c]">Recruiter Match</h3>
                          </div>
                          <p className="text-[#4b5563] text-[16px] leading-relaxed mb-8 z-10 w-full">Recruiters come to us with roles they can't fill. We close-match your resume and then send it to 50 recruiters a week.</p>
                          
                          <div className="absolute bottom-0 translate-y-12 hover:translate-y-6 transition-transform duration-500 flex justify-center w-full z-0 h-48">
                             <div className="relative">
                               <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80" alt="Recruiter" className="w-[180px] h-[180px] rounded-[2rem] object-cover shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] border-[8px] border-[#fff3ed]" />
                               <div className="absolute right-[-30px] top-4 bg-white p-2 rounded-full shadow border border-gray-100 flex items-center justify-center w-14 h-14">
                                 <div className="font-bold text-xl text-black">a</div>
                               </div>
                               <div className="absolute right-[-30px] bottom-10 bg-white p-2 rounded-full shadow border border-gray-100 flex items-center justify-center w-14 h-14">
                                 <div className="font-bold text-xl text-orange-500">G</div>
                               </div>
                             </div>
                          </div>
                      </div>
                    </motion.div>
                  )}

                  {activeToolsTab === 2 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="col-span-1 lg:col-span-2 grid lg:grid-cols-2 gap-6 h-full">
                      {/* Job Board Card */}
                      <div className="bg-[#fff3ed] rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                          <div className="flex items-center gap-3 w-full mb-4">
                            <div className="bg-white p-2 rounded-xl text-[#FF6321] shadow-sm"><Search size={28} className="fill-[#FF6321]/20" /></div>
                            <h3 className="text-[26px] font-semibold text-[#1a202c]">Job Board</h3>
                          </div>
                          <p className="text-[#4b5563] text-[16px] leading-relaxed mb-8 z-10 w-full">See every online job board in one place. We search the entire internet every day. If a role goes live, you won't miss it.</p>
                          
                          <div className="w-[110%] bg-white rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border border-gray-100 absolute bottom-0 translate-y-8 hover:translate-y-4 transition-transform duration-500 z-0 h-56 overflow-hidden flex flex-col">
                             <div className="flex border-b border-gray-100 p-3 gap-4 bg-gray-50 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1.5 text-black"><Target size={14}/> Recommended <span className="bg-gray-200 text-gray-700 px-1.5 rounded-full text-[10px]">5</span></span>
                                <span className="flex items-center gap-1.5"><CheckCircle size={14}/> Shortlist <span className="bg-gray-200 text-gray-700 px-1.5 rounded-full text-[10px]">6</span></span>
                             </div>
                             <div className="p-4 flex gap-4 w-full h-full pb-8">
                                <div className="w-1/2 bg-white border border-gray-100 shadow-sm rounded-lg p-3">
                                  <div className="w-8 h-8 flex items-center justify-center font-bold text-black border border-gray-100 rounded-md mb-2 shadow-sm">🍎</div>
                                  <div className="font-semibold text-sm">Product Manager</div>
                                  <div className="text-xs text-gray-400">Apple</div>
                                </div>
                                <div className="w-1/2 bg-white border border-gray-100 shadow-sm rounded-lg p-3">
                                  <div className="w-8 h-8 flex items-center justify-center text-orange-500 bg-white font-bold border border-gray-100 rounded-md mb-2 shadow-sm">M</div>
                                  <div className="font-semibold text-sm">Senior Product Manager</div>
                                  <div className="text-xs text-gray-400">Microsoft</div>
                                </div>
                             </div>
                          </div>
                      </div>

                      {/* Auto Apply Card */}
                      <div className="bg-[#fff3ed] rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                          <div className="flex items-center gap-3 w-full mb-4">
                            <div className="bg-white p-2 rounded-xl text-[#FF6321] shadow-sm"><Send size={28} className="fill-[#FF6321]/20" /></div>
                            <h3 className="text-[26px] font-semibold text-[#1a202c]">Auto Apply</h3>
                          </div>
                          <p className="text-[#4b5563] text-[16px] leading-relaxed mb-8 z-10 w-full">Our team of experts apply for you. All they need is your resume and your target salary. Interviews come by email.</p>
                          
                          <div className="absolute bottom-0 translate-y-12 hover:translate-y-6 transition-transform duration-500 flex flex-col items-center w-full z-0 h-56">
                             <div className="relative w-full flex justify-center h-full">
                               <svg className="absolute top-4 w-full h-32" viewBox="0 0 200 100" preserveAspectRatio="none">
                                  <path d="M 20 80 Q 100 0 180 80" fill="none" stroke="#fed7aa" strokeWidth="2" strokeDasharray="4 4" />
                               </svg>
                               <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80" className="absolute top-16 left-8 w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" alt="Avatar"/>
                               <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" className="absolute top-2 left-[25%] w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" alt="Avatar"/>
                               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" className="absolute top-2 right-[25%] w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" alt="Avatar"/>
                               <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" className="absolute top-16 right-8 w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" alt="Avatar"/>
                               
                               <div className="absolute bottom-4 w-48 bg-white/95 backdrop-blur-sm shadow-xl border border-orange-50/50 p-4 pt-5 rounded-t-xl border-b-0 h-40">
                                  <div className="font-bold text-[14px] text-[#1a202c] mb-2 text-center pb-2">Chloé Anne Bouchard</div>
                                  <div className="grid grid-cols-2 gap-2 opacity-60">
                                     <div className="space-y-1">
                                       <div className="h-0.5 bg-gray-400 rounded w-full"></div>
                                       <div className="h-0.5 bg-gray-400 rounded w-4/5"></div>
                                       <div className="h-0.5 bg-gray-400 rounded w-full"></div>
                                     </div>
                                     <div className="space-y-1">
                                       <div className="h-0.5 bg-gray-400 rounded w-full"></div>
                                       <div className="h-0.5 bg-gray-400 rounded w-3/4"></div>
                                     </div>
                                  </div>
                               </div>
                             </div>
                          </div>
                      </div>
                    </motion.div>
                  )}

                  {activeToolsTab === 3 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="col-span-1 lg:col-span-2 grid lg:grid-cols-2 gap-6 h-full">
                      {/* Interview Prep Card */}
                      <div className="bg-[#fff3ed] rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                          <div className="flex items-center gap-3 w-full mb-4">
                            <div className="bg-white p-2 rounded-xl text-[#FF6321] shadow-sm"><MessageSquare size={28} className="fill-[#FF6321]/20" /></div>
                            <h3 className="text-[26px] font-semibold text-[#1a202c]">Interview Prep</h3>
                          </div>
                          <p className="text-[#4b5563] text-[16px] leading-relaxed mb-8 z-10 w-full">Practice the questions that get you hired. Choose from the world's best employers and see instant feedback.</p>
                          
                          <div className="absolute bottom-0 translate-y-8 hover:translate-y-4 transition-transform duration-500 w-[110%] z-0 h-48 flex justify-center">
                              <div className="relative w-64 h-40 bg-white rounded-xl shadow-lg border border-orange-50 overflow-hidden transform scale-90 sm:scale-100">
                                 <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80" alt="Interview" className="w-full h-full object-cover" />
                                 <div className="absolute bottom-3 right-3 bg-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm pointer-events-none border border-red-500/30">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Recording</span>
                                 </div>
                                 <div className="absolute top-4 -right-12 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-100 flex items-center gap-1.5 z-10">
                                    <Sparkles size={12} className="text-orange-500" />
                                    <span className="text-[10px] font-bold text-orange-500">Ideal Answer</span>
                                 </div>
                                 <div className="absolute top-16 -right-16 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-32 z-10">
                                    <h5 className="text-[8px] text-gray-400 font-bold mb-1">Question 1</h5>
                                    <p className="text-[9px] font-medium leading-tight">How would you describe your design research?</p>
                                 </div>
                                 <div className="absolute -left-6 bottom-6 bg-white px-2.5 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-1.5 z-10">
                                    <span className="text-[12px]">🔥</span>
                                    <span className="text-[11px] font-bold text-gray-800">Speed up!</span>
                                 </div>
                              </div>
                          </div>
                      </div>

                      {/* Salary Analyzer Card */}
                      <div className="bg-[#fff3ed] rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                          <div className="flex items-center gap-3 w-full mb-4">
                            <div className="bg-white p-2 rounded-xl text-[#FF6321] shadow-sm"><Gauge size={28} className="fill-[#FF6321]/20" /></div>
                            <h3 className="text-[26px] font-semibold text-[#1a202c]">Salary Analyzer</h3>
                          </div>
                          <p className="text-[#4b5563] text-[16px] leading-relaxed mb-8 z-10 w-full">Get paid 7% more. Our salary analyzer shows you if your job offer is at the market rate. Always negotiate!</p>
                          
                          <div className="absolute bottom-0 translate-y-12 hover:translate-y-6 transition-transform duration-500 flex justify-center w-full z-0 h-48">
                             <div className="relative w-56 h-56 flex items-center justify-center">
                               {/* Gauge Background */}
                               <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full -rotate-90">
                                  <circle cx="50" cy="50" r="40" fill="none" stroke="#fed7aa" strokeWidth="8" strokeDasharray="125" strokeDashoffset="0" className="opacity-50" />
                                  <circle cx="50" cy="50" r="40" fill="none" stroke="#FF6321" strokeWidth="8" strokeDasharray="125" strokeDashoffset="60" strokeLinecap="round" />
                               </svg>
                               <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                                  <div className="text-3xl font-bold text-[#FF6321]">11.5<span className="text-xl">%</span></div>
                                  <div className="text-xs font-semibold text-gray-500">below average</div>
                               </div>
                               <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&h=100&q=80" className="absolute top-4 left-0 w-12 h-12 rounded-full border-4 border-white shadow-xl object-cover" alt="Profile" />
                               
                               {/* Ticks */}
                               <div className="absolute inset-0 pointer-events-none">
                                  <div className="absolute top-[15%] left-[25%] w-1.5 h-3 bg-red-400 rotate-[-45deg] rounded-full"></div>
                                  <div className="absolute top-[5%] left-[50%] -translate-x-1/2 w-1.5 h-3 bg-orange-500 rounded-full"></div>
                                  <div className="absolute top-[15%] right-[25%] w-1.5 h-3 bg-orange-500 rotate-[45deg] rounded-full"></div>
                                  <div className="absolute top-[50%] -translate-y-1/2 right-[5%] w-1.5 h-3 bg-orange-500 rotate-[90deg] rounded-full"></div>
                               </div>
                             </div>
                          </div>
                      </div>
                    </motion.div>
                  )}

                  {activeToolsTab === 4 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="col-span-1 lg:col-span-2 grid lg:grid-cols-2 gap-6 h-full">
                      {/* Career Coaching Card */}
                      <div className="bg-[#fff3ed] rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                          <div className="flex items-center gap-3 w-full mb-4">
                            <div className="bg-white p-2 rounded-xl text-[#FF6321] shadow-sm"><User size={28} className="fill-[#FF6321]/20" /></div>
                            <h3 className="text-[26px] font-semibold text-[#1a202c]">Career Coaching</h3>
                          </div>
                          <p className="text-[#4b5563] text-[16px] leading-relaxed mb-8 z-10 w-full">Work 1-1 with an expert to expand your network, give better interviews and negotiate a higher salary.</p>
                          
                          <div className="absolute bottom-0 translate-y-12 hover:translate-y-6 transition-transform duration-500 w-full z-0 h-48 flex justify-center items-center">
                              <div className="relative flex justify-center items-center w-full">
                                  {/* Squiggly arrow */}
                                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="absolute -left-2 top-0 text-gray-800 -rotate-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 30 Q 15 15, 30 20 T 35 10" />
                                    <path d="M30 15 L35 10 L30 5" />
                                    <path d="M10 25 Q 5 15, 20 5" />
                                  </svg>
                                  
                                  <div className="flex -space-x-4">
                                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80" alt="Coach 1" className="w-16 h-16 rounded-full border-4 border-[#fff3ed] shadow-md object-cover relative z-30 transform hover:-translate-y-2 transition-transform" />
                                    <img src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=100&h=100&q=80" alt="Coach 2" className="w-16 h-16 rounded-full border-4 border-[#fff3ed] shadow-md object-cover relative z-20 transform hover:-translate-y-2 transition-transform" />
                                    <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&w=100&h=100&q=80" alt="Coach 3" className="w-16 h-16 rounded-full border-4 border-[#fff3ed] shadow-md object-cover relative z-10 transform hover:-translate-y-2 transition-transform" />
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Future Learn Card */}
                      <div className="bg-[#fff3ed] rounded-2xl p-6 pb-56 sm:p-8 sm:pb-56 lg:p-10 lg:pb-56 text-left relative overflow-hidden flex flex-col items-center">
                          <div className="flex items-center gap-3 w-full mb-4">
                            <div className="bg-white p-2 rounded-xl text-[#FF6321] shadow-sm"><Sparkles size={28} className="fill-[#FF6321]/20" /></div>
                            <h3 className="text-[26px] font-semibold text-[#1a202c]">Future Learn</h3>
                          </div>
                          <p className="text-[#4b5563] text-[16px] leading-relaxed mb-8 z-10 w-full">Future proof yourself. Get the courses you need to grow. Accredited, certified and respected by employers.</p>
                          
                          <div className="absolute bottom-0 translate-y-8 hover:translate-y-4 transition-transform duration-500 flex justify-center w-full z-0 h-48">
                             <div className="relative w-full flex items-center justify-center gap-6">
                                <div className="w-32 h-32 bg-orange-100 rounded-3xl overflow-hidden shadow-sm relative border-4 border-orange-50">
                                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80" alt="Student" className="w-full h-full object-cover select-none pointer-events-none" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-orange-200/50 to-transparent mix-blend-multiply"></div>
                                </div>
                                <div className="flex flex-col gap-3">
                                   <div className="bg-white p-4 rounded-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center gap-4">
                                      <div className="relative w-12 h-12 flex items-center justify-center">
                                        <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full -rotate-90">
                                          <circle cx="50" cy="50" r="40" fill="none" stroke="#fed7aa" strokeWidth="8" />
                                          <circle cx="50" cy="50" r="40" fill="none" stroke="#FF6321" strokeWidth="8" strokeDasharray="251" strokeDashoffset="193" strokeLinecap="round" />
                                        </svg>
                                        <div className="font-bold text-sm text-[#1a202c]">23%</div>
                                      </div>
                                      <div className="text-[11px] font-medium text-gray-400 leading-tight">Your<br/>progress</div>
                                   </div>
                                   <div className="relative">
                                     <button className="bg-white text-orange-500 font-semibold px-6 py-2.5 rounded-full shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center w-32 hover:bg-gray-50 transition-colors">
                                       Learn
                                     </button>
                                     <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="absolute -right-4 -top-2 text-orange-400" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                       <path d="M5 30 Q 15 35, 25 20 T 35 5" />
                                       <path d="M25 5 L35 5 L35 15" />
                                     </svg>
                                   </div>
                                </div>
                             </div>
                          </div>
                      </div>
                    </motion.div>
                  )}
               </div>
            </div>

            {/* Way beyond a resume builder section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
              <h2 className="text-3xl lg:text-4xl font-medium text-[#1a202c] mb-12 text-center tracking-tight">
                Way beyond a resume builder...
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Row 1 */}
                 {/* Card 1 */}
                 <div className="bg-[#fff3ed] rounded-[32px] p-6 sm:p-8 lg:p-10 lg:col-span-2 relative overflow-hidden flex flex-col justify-start min-h-[360px] lg:min-h-[420px]">
                    <div className="flex items-center gap-1.5 bg-[#fff3ed] text-[#FF6321] px-3 py-1.5 rounded-lg text-[13px] font-bold w-max mb-5"><Sparkles size={14} className="fill-[#FF6321] shrink-0"/> AI-powered</div>
                    <h3 className="text-2xl lg:text-[28px] font-semibold text-[#1a202c] mb-3">Step-by-step guidance</h3>
                    <p className="text-[#4b5563] text-[15px] lg:text-[16px] leading-relaxed max-w-sm mb-6 relative z-10">No need to think much. We guide you through every step of the process. We show you what to add, and where to add it in. It's clear and simple.</p>
                    <button onClick={() => setStep(Step.DETAILS)} className="text-[#FF6321] font-medium text-[15px] text-left hover:underline w-max relative z-10 transition-all flex items-center gap-1 group">Create my resume <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
                    
                    {/* Visual */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 hidden md:block">
                        <div className="bg-white rounded-[24px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] p-6 lg:p-8 border border-gray-100 w-80 lg:w-96 space-y-4">
                           <div className="flex items-center gap-3 bg-orange-50/80 p-3.5 rounded-xl border border-orange-100 text-[#FF6321]"><CheckCircle2 size={20} className="fill-[#FF6321] text-white shrink-0"/><span className="text-[15px] font-medium">Step 1 &bull; Personal Details</span></div>
                           <div className="flex items-center gap-3 bg-orange-50/80 p-3.5 rounded-xl border border-orange-100 text-[#FF6321]"><CheckCircle2 size={20} className="fill-[#FF6321] text-white shrink-0"/><span className="text-[15px] font-medium">Step 2 &bull; Professional Summary</span></div>
                           <div className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-orange-200 shadow-sm relative"><div className="absolute -left-2 rounded-full w-4 h-4 bg-orange-500 flex items-center justify-center ring-4 ring-orange-50"></div><div className="w-5 h-5 rounded-full border-2 border-orange-200 border-t-transparent animate-spin ml-2 shrink-0"></div><span className="text-[15px] font-medium text-orange-500">Step 3 &bull; Skills </span><span className="ml-auto text-orange-500 text-xs font-mono select-none">✏️</span></div>
                           <div className="flex flex-wrap gap-2 pl-9 pt-1">
                              <span className="bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap">Management Skills +</span>
                              <span className="bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap">Leadership and Team</span>
                              <span className="bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap">Analytical Thinking Skills +</span>
                           </div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Card 2 */}
                 <div className="bg-[#fff3ed] rounded-[32px] p-6 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-start min-h-[360px] lg:min-h-[420px]">
                    <div className="flex items-center gap-1.5 bg-[#fff3ed] text-[#FF6321] px-3 py-1.5 rounded-lg text-[13px] font-bold w-max mb-5"><Sparkles size={14} className="fill-[#FF6321] shrink-0"/> AI-powered</div>
                    <h3 className="text-2xl lg:text-[28px] font-semibold text-[#1a202c] mb-3 relative z-10">AI writes for you</h3>
                    <p className="text-[#4b5563] text-[15px] lg:text-[16px] leading-relaxed relative z-10">Speak into the mic and the AI fixes mistakes. Stuck? Click to add phrases that sound professional.</p>
                    
                    {/* Visual */}
                    <div className="absolute left-8 lg:left-10 -bottom-1 right-8 lg:right-10 pointer-events-none hidden md:block">
                        <div className="bg-white rounded-t-[20px] shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-100 p-5 h-44 drop-shadow-sm">
                           <div className="text-[13px] font-bold text-gray-800 mb-2 font-serif">Professional Summary</div>
                           <div className="text-[10px] text-gray-400 mb-3 bg-gray-50 p-2 rounded border border-gray-100 flex items-center gap-2"><Sparkles size={12} className="text-orange-500"/> Write 2-4 short sentences to interest the reader. Mention your role, experience & most...</div>
                           <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-50">
                             <div className="text-[10px] text-gray-700 leading-relaxed font-medium">
                               Experienced and effective Business Development Manager bringing forth <span className="bg-orange-500 text-orange-500 px-1 py-0.5 rounded leading-[1.8] border-b border-orange-200">significant value and a genuine passion for management</span>. With a proven track record...
                             </div>
                           </div>
                        </div>
                    </div>
                 </div>

                 {/* Row 2 */}
                 {/* Card 3 */}
                 <div className="bg-[#fff3ed] rounded-[32px] p-6 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-start min-h-[360px] lg:min-h-[420px]">
                    <div className="flex items-center gap-1.5 bg-[#fff3ed] text-[#FF6321] px-3 py-1.5 rounded-lg text-[13px] font-bold w-max mb-5"><Sparkles size={14} className="fill-[#FF6321] shrink-0"/> AI-powered</div>
                    <h3 className="text-2xl lg:text-[28px] font-semibold text-[#1a202c] mb-3 relative z-10">Instant cover letters</h3>
                    <p className="text-[#4b5563] text-[15px] lg:text-[16px] leading-relaxed relative z-10">Just paste a job link. We create a matching cover letter, using your resume. You're done in 2 mins! Purpose built to impress recruiters.</p>
                    
                    {/* Visual */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-24 w-64 pointer-events-none drop-shadow-xl hidden md:block">
                        <div className="bg-white rounded-[12px] shadow-[0_10px_40px_-5px_rgba(0,0,0,0.1)] border border-gray-200 p-6 h-64 flex flex-col pt-8 transform rotate-2">
                           <div className="w-full text-[18px] text-gray-800 font-bold font-serif mb-6 leading-tight tracking-tight uppercase border-b-2 border-gray-900 pb-2">JORGE<br/>SANDERS</div>
                           <div className="space-y-2.5 w-full">
                              <div className="w-full h-1.5 bg-gray-200/80 rounded-full"></div>
                              <div className="w-full h-1.5 bg-gray-200/80 rounded-full"></div>
                              <div className="w-full h-1.5 bg-gray-200/80 rounded-full"></div>
                              <div className="w-4/5 h-1.5 bg-gray-200/80 rounded-full"></div>
                              <div className="w-full h-1.5 bg-gray-200/80 rounded-full mt-4"></div>
                              <div className="w-[85%] h-1.5 bg-gray-200/80 rounded-full"></div>
                              <div className="w-full h-1.5 bg-gray-200/80 rounded-full"></div>
                           </div>
                        </div>
                    </div>
                 </div>

                 {/* Card 4 */}
                 <div className="bg-[#fff3ed] rounded-[32px] p-6 sm:p-8 lg:p-10 lg:col-span-2 relative overflow-hidden flex flex-col justify-start min-h-[360px] lg:min-h-[420px]">
                    <h3 className="text-2xl lg:text-[28px] font-semibold text-[#1a202c] mb-3 relative z-10">Paste any job link</h3>
                    <p className="text-[#4b5563] text-[15px] lg:text-[16px] leading-relaxed mb-6 max-w-[280px] relative z-10">Simple and effective. We have the formula that works for recruiters. Just paste the job description and we pre-build your resume to match.</p>
                    <button className="text-[#FF6321] font-medium text-[15px] text-left hover:underline w-max relative z-10 flex items-center gap-1 group">Tailor my resume <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
                    
                    {/* Visual */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 lg:translate-x-12 hidden md:block select-none pointer-events-none">
                        <div className="relative">
                          <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=480&h=300&q=80" alt="Job Screen" className="w-[420px] h-[260px] rounded-2xl shadow-xl object-cover ring-1 ring-gray-900/5 rotate-[-2deg]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl"></div>
                          <div className="absolute -left-12 -bottom-6 bg-white rounded-[20px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border border-gray-100 p-5 w-80 rotate-[2deg]">
                             <div className="text-[13px] font-bold mb-3 text-gray-800">Paste a link to the job you want:</div>
                             <div className="bg-[#f8fafc] border border-gray-200 rounded-lg p-2.5 flex items-center justify-between text-[11px] text-gray-500 mb-5 relative group">
                                <span className="truncate pr-4 text-gray-600 font-medium">https://www.monster.com/product-designer...</span>
                                <CheckCircle2 size={16} className="text-orange-500 fill-orange-50 absolute right-2 bg-white rounded-full" />
                             </div>
                             <div className="flex justify-end gap-3 mt-4">
                               <button className="text-[12px] font-medium px-3 py-1.5 text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
                               <button className="bg-[#FF6321] hover:bg-orange-500 transition-colors text-white text-[12px] font-semibold px-5 py-1.5 rounded-full shadow-sm">Continue</button>
                             </div>
                          </div>
                        </div>
                    </div>
                 </div>

                 {/* Row 3 */}
                 {/* Card 5 */}
                 <div className="bg-[#fff3ed] rounded-[32px] p-6 sm:p-8 lg:p-10 lg:col-span-2 relative overflow-hidden flex flex-col justify-start min-h-[360px] lg:min-h-[420px]">
                    <h3 className="text-2xl lg:text-[28px] font-semibold text-[#1a202c] mb-3 relative z-10">Recruiter Match</h3>
                    <p className="text-[#4b5563] text-[15px] lg:text-[16px] leading-relaxed mb-6 max-w-[280px] relative z-10">Recruiters come to us with roles they can't fill. We can match your resume with up to 50 recruiters a week. When there's a match, they will contact you via email.</p>
                    <button className="text-[#FF6321] font-medium text-[15px] text-left hover:underline w-max relative z-10 flex items-center gap-1 group">Start distributing <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></button>
                    
                    {/* Visual */}
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-[300px] h-[300px] pointer-events-none select-none">
                        <div className="relative w-full h-full">
                           <div className="absolute inset-4 border-[1.5px] border-dashed border-orange-200 rounded-full animate-[spin_30s_linear_infinite]"></div>
                           <div className="absolute inset-16 border border-orange-200 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                           <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ring-4 ring-white" />
                           
                           {/* Orbiting items */}
                           <div className="absolute top-[5%] left-[60%] -translate-x-1/2 bg-white rounded-full shadow-[0_5px_15px_-5px_rgba(0,0,0,0.1)] w-12 h-12 flex items-center justify-center font-bold text-[#FF5A5F] text-xl transform rotate-12 border border-gray-50 scale-90">A</div>
                           
                           <div className="absolute top-[25%] -right-2 bg-white rounded-full shadow-md w-14 h-14 flex items-center justify-center border border-gray-50">
                             <Target size={24} className="text-gray-900" />
                           </div>
                           
                           <div className="absolute bottom-[20%] right-0 bg-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center font-bold text-orange-500 border border-gray-50 text-2xl font-serif">S</div>
                           
                           <div className="absolute top-[20%] -left-2 bg-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center font-bold text-orange-500 border border-gray-50 text-2xl font-serif">G</div>
                           
                           <div className="absolute bottom-[25%] left-4 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center font-bold text-[#FF6321] border border-gray-50 text-lg">M</div>
                        </div>
                    </div>
                 </div>

                 {/* Card 6 */}
                 <div className="bg-[#fff3ed] rounded-[32px] p-6 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-start min-h-[360px] lg:min-h-[420px]">
                    <h3 className="text-2xl lg:text-[28px] font-semibold text-[#1a202c] mb-3 relative z-10">Need some advice?</h3>
                    <p className="text-[#4b5563] text-[15px] lg:text-[16px] leading-relaxed relative z-10 mb-8">98% of our coaching clients receive a job offer with 12 weeks.</p>
                    
                    {/* Visual */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-8 pointer-events-none select-none hidden md:block">
                        <div className="relative pt-8">
                          {/* Squiggly arrow pointing up/left to coaches */}
                          <svg className="absolute -top-6 -right-6 text-orange-700 w-16 h-16 rotate-12 drop-shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 70 C 20 70, 70 80, 80 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 6" />
                            <path d="M70 30 L 80 30 L 75 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          
                          <div className="flex -space-x-4">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&h=120&q=80" alt="Coach 1" className="w-[72px] h-[72px] lg:w-20 lg:h-20 rounded-full border-4 border-[#fff3ed] shadow-[0_5px_15px_-5px_rgba(0,0,0,0.15)] object-cover relative z-30" />
                            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=120&h=120&q=80" alt="Coach 2" className="w-[72px] h-[72px] lg:w-20 lg:h-20 rounded-full border-4 border-[#fff3ed] shadow-[0_5px_15px_-5px_rgba(0,0,0,0.15)] object-cover relative z-20" />
                            <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&w=120&h=120&q=80" alt="Coach 3" className="w-[72px] h-[72px] lg:w-20 lg:h-20 rounded-full border-4 border-[#fff3ed] shadow-[0_5px_15px_-5px_rgba(0,0,0,0.15)] object-cover relative z-10" />
                          </div>
                        </div>
                    </div>
                 </div>

              </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-16 mt-20">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-[#4b5563]">
                 <div className="space-y-4">
                   <div className="text-2xl font-bold text-[#1a202c] tracking-tight flex items-center gap-2">
                      <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-serif text-xl">R</div>
                      ResumeAI
                   </div>
                   <p className="text-[15px] leading-relaxed">
                     The fastest, most effective way to secure your next role. Built with top recruiters and AI.
                   </p>
                 </div>
                 
                 <div>
                    <h4 className="font-semibold text-[#1a202c] mb-6">Product</h4>
                    <ul className="space-y-4 text-[15px]">
                       <li><button onClick={() => setStep(Step.DETAILS)} className="hover:text-[#FF6321] transition-colors">Resume Builder</button></li>
                       <li><button onClick={() => setStep(Step.COVER_LETTER)} className="hover:text-[#FF6321] transition-colors">Cover Letter</button></li>
                       <li><button className="hover:text-[#FF6321] transition-colors">Recruiter Match</button></li>
                       <li><button className="hover:text-[#FF6321] transition-colors">Auto Apply</button></li>
                    </ul>
                 </div>

                 <div>
                    <h4 className="font-semibold text-[#1a202c] mb-6">Resources</h4>
                    <ul className="space-y-4 text-[15px]">
                       <li><button onClick={() => setStep(Step.BLOG)} className="hover:text-[#FF6321] transition-colors">Career Blog</button></li>
                       <li><button className="hover:text-[#FF6321] transition-colors">Resume Examples</button></li>
                       <li><button className="hover:text-[#FF6321] transition-colors">Interview Questions</button></li>
                       <li><button className="hover:text-[#FF6321] transition-colors">Salary Analyzer</button></li>
                    </ul>
                 </div>

                 <div>
                    <h4 className="font-semibold text-[#1a202c] mb-6">Company</h4>
                    <ul className="space-y-4 text-[15px]">
                       <li><button className="hover:text-[#FF6321] transition-colors">About Us</button></li>
                       <li><button className="hover:text-[#FF6321] transition-colors">Contact</button></li>
                       <li><button className="hover:text-[#FF6321] transition-colors">Privacy Policy</button></li>
                       <li><button className="hover:text-[#FF6321] transition-colors">Terms of Service</button></li>
                    </ul>
                 </div>
              </div>
              
              <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                 <div>&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</div>
                 <div className="flex gap-6">
                    <a href="#" className="hover:text-[#1a202c] transition-colors">Twitter</a>
                    <a href="#" className="hover:text-[#1a202c] transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-[#1a202c] transition-colors">Instagram</a>
                 </div>
              </div>
            </footer>
          </motion.div>
        )}

        {/* DETAILS ENTRY STEP */}
        {step === Step.DETAILS && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto py-12 px-6 print:hidden min-h-screen"
          >
            <div className="flex items-center justify-between mb-12">
               <div>
                 <span className="text-xs uppercase tracking-widest font-bold text-[#FF6321] mb-2 block">Step 01 / 03</span>
                 <h2 className="text-4xl font-bold tracking-tight">Your Details</h2>
               </div>
               <div className="hidden sm:block">
                 <Logo />
               </div>
            </div>

            <div className="bg-white border border-[#f3f4f6] rounded-3xl p-6 sm:p-10 lg:p-14 [box-shadow:0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-12 relative overflow-hidden">
              
              {/* CV Upload */}
              <div className="border border-dashed border-[#FF6321] bg-orange-50 rounded-2xl p-8 text-center relative hover:bg-orange-100 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleCVUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Loader2 size={32} className="text-[#FF6321] animate-spin" />
                    <p className="text-[#FF6321] font-medium text-sm">Extracting CV data via AI...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="bg-white p-3 rounded-full text-[#FF6321] shadow-sm">
                      <UploadCloud size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111827]">Upload Existing CV to Autofill</h4>
                      <p className="text-xs text-[#4b5563] mt-1">PDF, TXT, DOC, DOCX up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile setup */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
                   <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500"><User size={22} /></div>
                   <h3 className="text-xl font-bold tracking-tight text-[#111827]">Personal Information</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                        placeholder="Jessica Doe"
                        value={userData.fullName}
                        onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                        placeholder="jessica@email.com"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                        placeholder="555-0123"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">LinkedIn (Optional)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Linkedin size={18} />
                      </div>
                      <input
                        type="text"
                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                        placeholder="linkedin.com/in/j"
                        value={userData.linkedin}
                        onChange={(e) => setUserData({ ...userData, linkedin: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Current/Target General Title</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Briefcase size={18} />
                      </div>
                      <input
                        type="text"
                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium text-lg"
                        placeholder="e.g. Senior Product Manager"
                        value={userData.currentRole}
                        onChange={(e) => setUserData({ ...userData, currentRole: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Profile Picture (Optional)</label>
                    <div className="flex items-center gap-4">
                       <div className="relative flex-1">
                          <label className="cursor-pointer w-full bg-[#f9fafb] border border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 rounded-xl px-4 py-4 flex flex-col items-center justify-center gap-2 transition-all">
                             <ImageIcon size={24} className="text-gray-400" />
                             <span className="text-sm font-medium text-gray-600">Click to upload photo</span>
                             <input
                               type="file"
                               accept="image/*"
                               className="hidden"
                               onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   const reader = new FileReader();
                                   reader.onloadend = () => {
                                     setUserData({ ...userData, profilePicture: reader.result as string });
                                   };
                                   reader.readAsDataURL(file);
                                 }
                               }}
                             />
                          </label>
                       </div>
                       {userData.profilePicture && (
                         <div className="shrink-0 relative group">
                           <img src={userData.profilePicture} alt="Profile" className="w-20 h-20 object-cover rounded-2xl border-4 border-white shadow-lg" />
                           <button onClick={() => setUserData({...userData, profilePicture: undefined})} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:pointer-events-none">&times;</button>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Background */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
                   <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500"><Briefcase size={22} /></div>
                   <h3 className="text-xl font-bold tracking-tight text-[#111827]">Professional Background</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500">Raw Experience</label>
                      <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-md flex items-center gap-1.5"><Wand2 size={12}/> AI will format this</span>
                    </div>
                    <div className="space-y-4">
                      {userData.experience.map((exp, index) => (
                        <div key={index} className="relative group">
                          <textarea
                            rows={4}
                            className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all resize-y text-[15px] leading-relaxed placeholder:text-gray-400"
                            placeholder={`Role ${index + 1}: e.g. Stripe, 2021-2023.\nManaged risk team, increased revenue by 10%...`}
                            value={exp}
                            onChange={(e) => {
                              const newExp = [...userData.experience];
                              newExp[index] = e.target.value;
                              setUserData({ ...userData, experience: newExp });
                            }}
                          />
                          {userData.experience.length > 1 && (
                            <button 
                              onClick={() => {
                                const newExp = userData.experience.filter((_, i) => i !== index);
                                setUserData({ ...userData, experience: newExp });
                              }}
                              className="absolute top-4 right-4 bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setUserData({ ...userData, experience: [...userData.experience, ""] })}
                      className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 px-6 py-3 rounded-xl transition-colors w-full sm:w-auto"
                    >
                      <span className="text-lg leading-none">+</span> Add Another Role
                    </button>
                  </div>
                </div>
              </div>

              {/* Education & Skills */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-[#f3f4f6] pb-4">
                   <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500"><GraduationCap size={22} /></div>
                   <h3 className="text-xl font-bold tracking-tight text-[#111827]">Education & Skills</h3>
                </div>
                <div className="space-y-8">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Education</label>
                    <textarea
                      rows={3}
                      className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all resize-none text-[15px] leading-relaxed placeholder:text-gray-400"
                      placeholder="e.g. BSc Computer Science, MIT, 2018-2022"
                      value={userData.education}
                      onChange={(e) => setUserData({ ...userData, education: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Skills</label>
                    <div className="space-y-4">
                      {userData.skills.map((skill, index) => (
                         <div key={index} className="relative group">
                          <textarea
                            rows={2}
                            className="w-full bg-[#f9fafb] border border-gray-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#FF6321]/20 focus:border-[#FF6321] focus:bg-white outline-none transition-all resize-none text-[15px] leading-relaxed placeholder:text-gray-400"
                            placeholder={`Skill Group ${index + 1}: e.g. Python, React, SQL...`}
                            value={skill}
                            onChange={(e) => {
                              const newSkills = [...userData.skills];
                              newSkills[index] = e.target.value;
                              setUserData({ ...userData, skills: newSkills });
                            }}
                          />
                          {userData.skills.length > 1 && (
                            <button 
                              onClick={() => {
                                const newSkills = userData.skills.filter((_, i) => i !== index);
                                setUserData({ ...userData, skills: newSkills });
                              }}
                              className="absolute top-4 right-4 bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-red-500 w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setUserData({ ...userData, skills: [...userData.skills, ""] })}
                      className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 px-6 py-3 rounded-xl transition-colors w-full sm:w-auto"
                    >
                      <Code2 size={16} /> Add Skill Group
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#f3f4f6] flex justify-between items-center">
                <button
                  onClick={() => setStep(Step.LANDING)}
                  className="flex items-center gap-2 px-6 py-4 bg-[#f9fafb] border border-gray-100 text-[#4b5563] font-bold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={18} /> <span className="hidden sm:inline">Back</span>
                </button>
                <button
                  disabled={!userData.fullName || userData.experience.filter(e => e.trim()).length === 0}
                  onClick={() => setStep(Step.DESIGN)}
                  className="group flex items-center gap-4 bg-gradient-to-r from-[#FF6321] to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  Confirm Details
                  <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </button>
              </div>
            </div>
</motion.div>
        )}

        {/* DESIGN SELECTION STEP */}
        {step === Step.DESIGN && (
          <motion.div
            key="design"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-5xl mx-auto py-12 px-6 print:hidden min-h-screen"
          >
            <div className="flex items-center justify-between mb-12">
               <div>
                 <span className="text-xs uppercase tracking-widest font-bold text-[#FF6321] mb-2 block">Step 02 / 03</span>
                 <h2 className="text-4xl font-bold tracking-tight">Choose Design</h2>
               </div>
               <div className="hidden sm:block">
                 <Logo />
               </div>
            </div>

            <div className="bg-white border rounded-3xl p-6 sm:p-8 lg:p-12 [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] space-y-8 relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { id: 'classic', name: 'Classic', desc: 'Timeless & professional' },
                  { id: 'modern', name: 'Modern', desc: 'Bold accents & clean' },
                  { id: 'minimal', name: 'Minimal', desc: 'Whitespace focused' },
                  { id: 'split', name: 'Split', desc: 'Creative sidebar layout' },
                  { id: 'creative-orange', name: 'Creative Orange', desc: 'Curved vibrant sidebar' },
                  { id: 'corporate-dark', name: 'Corporate Dark', desc: 'Professional gray & dark' },
                  { id: 'modern-block', name: 'Modern Block', desc: 'Clean geometric structure' },
                  { id: 'contrast-bold', name: 'Contrast Bold', desc: 'Striking dark & orange' }
                ].map((design) => (
                  <div
                    key={design.id}
                    onClick={() => setDesignId(design.id as DesignId)}
                    className={`cursor-pointer rounded-2xl border-2 transition-all p-4 flex flex-col gap-4 ${
                      designId === design.id ? 'border-[#FF6321] bg-[#FF6321]/5 [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]' : 'border-[#e5e7eb] hover:border-[#d1d5db]'
                    }`}
                  >
                    <div className="bg-[#f5f5f4] rounded-xl h-48 overflow-hidden relative border border-[#f3f4f6] flex items-center justify-center p-2">
                       {/* Mockups */}
                       {design.id === 'classic' && (
                         <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] p-3 flex flex-col gap-2">
                            <div className="text-center mb-1 border-b border-[#1f2937] pb-2">
                               <div className="w-16 h-2 xl:h-2.5 bg-[#111827] mx-auto mb-1"></div>
                               <div className="w-10 h-1 xl:h-1.5 bg-[#6b7280] mx-auto"></div>
                            </div>
                            <div className="w-10 h-1 bg-[#111827] mb-0.5"></div>
                            <div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div>
                            <div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div>
                            <div className="w-3/4 h-1 bg-[#e5e7eb] rounded-sm"></div>
                            
                            <div className="w-12 h-1 bg-[#111827] mt-2 mb-1"></div>
                            <div className="flex justify-between">
                              <div className="w-12 h-1.5 bg-[#1f2937]"></div>
                              <div className="w-8 h-1 bg-[#9ca3af]"></div>
                            </div>
                            <div className="w-8 h-1 bg-[#4b5563] mt-0.5"></div>
                            <div className="w-full h-1 bg-[#e5e7eb] rounded-sm mt-1"></div>
                            <div className="w-5/6 h-1 bg-[#e5e7eb] rounded-sm mt-0.5"></div>
                         </div>
                       )}
                       {design.id === 'modern' && (
                         <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] p-3 flex flex-col gap-2">
                            <div className="border-l-[3px] border-[#FF6321] pl-2 mb-2">
                               <div className="h-2.5 w-1/2 bg-[#111827] mb-1"></div>
                               <div className="h-1.5 w-1/3 bg-[#FF6321]"></div>
                            </div>
                            
                            <div className="w-full h-1 bg-[#e5e7eb] rounded-sm"></div>
                            <div className="w-4/5 h-1 bg-[#e5e7eb] rounded-sm"></div>
                            
                            <div className="flex items-center gap-2 mt-2 mb-1">
                               <div className="w-12 h-1.5 bg-[#111827]"></div>
                               <div className="flex-1 h-[1px] bg-[#e5e7eb]"></div>
                            </div>
                            <div className="flex justify-between">
                              <div className="w-12 h-1.5 bg-[#1f2937]"></div>
                               <div className="w-6 h-1 bg-[#d1d5db]"></div>
                            </div>
                            <div className="w-8 h-1 bg-[#FF6321] mt-0.5"></div>
                            <div className="w-full h-1 bg-[#e5e7eb] rounded-sm mt-1"></div>
                            <div className="w-4/5 h-1 bg-[#e5e7eb] rounded-sm mt-0.5"></div>
                         </div>
                       )}
                       {design.id === 'minimal' && (
                         <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] p-4 flex flex-col gap-2">
                             <div className="text-center mb-4">
                               <div className="h-2 w-16 bg-[#1f2937] mx-auto mb-1.5"></div>
                               <div className="h-1 w-10 bg-[#9ca3af] mx-auto"></div>
                             </div>
                             
                             <div className="w-10 h-0.5 bg-[#d1d5db] mx-auto mb-2 uppercase tracking-widest"></div>
                             <div className="flex gap-3">
                                <div className="w-6 h-1 bg-[#9ca3af] mt-0.5"></div>
                                <div className="flex-1 flex flex-col gap-1">
                                   <div className="w-12 h-1.5 bg-[#1f2937]"></div>
                                   <div className="w-8 h-1 bg-[#9ca3af]"></div>
                                   <div className="h-1 w-full bg-[#e5e7eb] rounded-sm mt-1"></div>
                                   <div className="h-1 w-5/6 bg-[#e5e7eb] rounded-sm"></div>
                                </div>
                             </div>
                         </div>
                       )}
                       {design.id === 'split' && (
                         <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex overflow-hidden">
                             <div className="w-[35%] bg-[#1f2937] p-2 flex flex-col gap-1.5 items-center pt-3">
                                <div className="w-8 h-8 rounded-full border-2 border-[#eab308] bg-[#4b5563] mb-1"></div>
                                <div className="w-8 h-1 bg-[#eab308] mt-1 mb-0.5"></div>
                                <div className="w-full h-[1px] bg-[#4b5563]"></div>
                                <div className="w-4/5 h-0.5 bg-[#9ca3af] text-center"></div>
                                <div className="w-4/5 h-0.5 bg-[#9ca3af] text-center"></div>
                                <div className="w-3/5 h-0.5 bg-[#9ca3af] text-center"></div>
                             </div>
                             <div className="w-[65%] p-3 flex flex-col gap-1.5 pt-4">
                                <div className="flex flex-col items-center mb-2">
                                  <div className="h-2.5 w-16 bg-[#111827] mb-1"></div>
                                  <div className="h-1 w-10 bg-[#eab308]"></div>
                                </div>
                                <div className="flex items-center gap-1.5 mb-1 mt-1">
                                   <div className="w-2.5 h-2.5 rounded-full bg-[#1f2937] flex items-center justify-center">
                                      <div className="w-0.5 h-0.5 bg-[#eab308] rounded-full"></div>
                                   </div>
                                   <div className="w-10 h-1.5 bg-[#1f2937]"></div>
                                </div>
                                <div className="h-1 w-full bg-[#e5e7eb] rounded-sm"></div>
                                <div className="h-1 w-5/6 bg-[#e5e7eb] rounded-sm"></div>
                                <div className="h-1 w-4/5 bg-[#e5e7eb] rounded-sm"></div>
                             </div>
                         </div>
                       )}
                       {design.id === 'creative-orange' && (
                         <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex overflow-hidden">
                             <div className="w-[35%] bg-[#EA580C] p-2 flex flex-col gap-1 items-center pt-3 rounded-br-2xl rounded-tr-2xl relative">
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-white/20 mb-1 z-10 shrink-0"></div>
                                <div className="w-4/5 h-0.5 bg-white/40 mt-1 mb-0.5"></div>
                                <div className="w-3/5 h-[1px] bg-white/20 mb-1"></div>
                                <div className="w-full h-[1px] bg-white/20 mb-0.5 mt-2"></div>
                                <div className="w-4/5 h-0.5 bg-white/40"></div>
                             </div>
                             <div className="w-[65%] p-3 flex flex-col pt-4">
                                <div className="h-2 w-2/3 bg-[#111827] rounded-sm mb-1"></div>
                                <div className="h-1 w-1/3 bg-[#9ca3af] mb-2"></div>
                                <div className="flex items-center gap-1 mb-1">
                                   <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C]"></div>
                                   <div className="w-10 h-1 bg-[#4b5563]"></div>
                                </div>
                                <div className="h-1 w-full bg-[#e5e7eb] rounded-sm mb-0.5"></div>
                                <div className="h-1 w-5/6 bg-[#e5e7eb] rounded-sm mb-2"></div>
                                <div className="flex items-center gap-1 mb-1">
                                   <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C]"></div>
                                   <div className="w-12 h-1 bg-[#4b5563]"></div>
                                </div>
                                <div className="h-1 w-full bg-[#e5e7eb] rounded-sm mb-0.5"></div>
                                <div className="h-1 w-4/5 bg-[#e5e7eb] rounded-sm"></div>
                             </div>
                         </div>
                       )}
                       {design.id === 'corporate-dark' && (
                         <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
                             <div className="h-10 bg-[#E5E7EB] flex items-center">
                                <div className="w-[60%] px-2">
                                  <div className="h-1 w-1/2 bg-[#1f2937] mb-0.5"></div>
                                  <div className="h-0.5 w-full bg-[#9ca3af]"></div>
                                  <div className="h-0.5 w-4/5 bg-[#9ca3af] mt-0.5"></div>
                                </div>
                                <div className="w-[40%] px-2 text-right border-l border-white/60">
                                  <div className="h-1.5 w-3/4 bg-[#111827] mb-0.5 ml-auto"></div>
                                  <div className="h-0.5 w-1/2 bg-[#4b5563] ml-auto"></div>
                                </div>
                             </div>
                             <div className="flex flex-1 relative">
                                <div className="w-[60%] p-2 pt-3 flex flex-col gap-1">
                                   <div className="flex items-center gap-1 mb-1">
                                      <div className="w-3 h-[1px] bg-[#111827]"></div>
                                      <div className="w-8 h-1 bg-[#1f2937]"></div>
                                   </div>
                                   <div className="w-full h-0.5 bg-[#e5e7eb] mb-0.5"></div>
                                   <div className="w-4/5 h-0.5 bg-[#e5e7eb] mb-2"></div>
                                </div>
                                <div className="w-[40%] bg-[#1F2937] p-2 pt-5 relative">
                                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-[3px] border-[#1F2937] bg-white"></div>
                                   <div className="w-full h-1 bg-white/20 mb-1 mx-auto mt-2 rounded"></div>
                                   <div className="w-4/5 h-[1px] bg-white/40 mb-2 mx-auto"></div>
                                </div>
                             </div>
                         </div>
                       )}
                       {design.id === 'modern-block' && (
                         <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex flex-col overflow-hidden p-2 border-t-[3px] border-[#F97316]">
                             <div className="flex gap-2 mb-2">
                                <div className="w-8 h-10 bg-[#e5e7eb] shrink-0"></div>
                                <div className="flex-1 pt-1 justify-center flex flex-col">
                                   <div className="h-2 w-4/5 bg-[#111827] mb-1"></div>
                                   <div className="h-1 w-1/2 bg-[#F97316] mb-1.5"></div>
                                   <div className="h-0.5 w-full bg-[#d1d5db] border-t border-b border-[#f3f4f6] py-0.5"></div>
                                </div>
                             </div>
                             <div className="w-[90%] mx-auto h-2 bg-[#374151] mb-2 px-1 py-0.5 flex items-center justify-center">
                                <div className="w-1/3 h-[1px] bg-white/40"></div>
                             </div>
                             <div className="flex gap-2">
                                <div className="w-[40%]">
                                   <div className="w-2/3 h-1 bg-[#F97316] mb-1"></div>
                                   <div className="w-full h-0.5 bg-[#e5e7eb] mb-0.5"></div>
                                   <div className="w-4/5 h-0.5 bg-[#e5e7eb] mb-1.5"></div>
                                </div>
                                <div className="w-[60%]">
                                   <div className="w-3/4 h-1 bg-[#F97316] mb-1"></div>
                                   <div className="w-full h-0.5 bg-[#d1d5db] mb-0.5"></div>
                                   <div className="w-full h-0.5 bg-[#e5e7eb] mb-0.5"></div>
                                   <div className="w-5/6 h-0.5 bg-[#e5e7eb]"></div>
                                </div>
                             </div>
                         </div>
                       )}
                       {design.id === 'contrast-bold' && (
                         <div className="w-full h-full bg-white [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex overflow-hidden">
                             <div className="w-[45%] flex flex-col relative z-20">
                                <div className="h-12 flex items-center justify-center relative">
                                   <div className="w-8 h-8 rounded-full border-[3px] border-[#F97316] bg-white z-10 ml-2 mt-4 shrink-0"></div>
                                </div>
                                <div className="p-2 pt-6">
                                   <div className="w-full h-2 bg-[#F97316] rounded-r-full -ml-2 mb-2"></div>
                                   <div className="w-5/6 h-0.5 bg-[#9ca3af] mb-1"></div>
                                   <div className="w-full h-[1px] bg-[#e5e7eb] mb-2"></div>
                                </div>
                             </div>
                             <div className="w-[55%] bg-[#1F2937] flex flex-col">
                                <div className="h-14 bg-[#F97316] rounded-l-3xl -ml-3 p-2 pl-4 pt-4 flex flex-col [box-shadow:0_1px_3px_0_rgba(0,0,0,0.1)] z-10">
                                   <div className="h-1.5 w-11/12 bg-white mb-1"></div>
                                   <div className="h-0.5 w-1/2 bg-white/80"></div>
                                </div>
                                <div className="p-2 pl-3 pt-3">
                                   <div className="w-4/5 h-1.5 border border-white/20 rounded-full mb-1 inline-block"></div>
                                   <div className="w-full h-[1px] bg-white/20 mb-2"></div>
                                   <div className="w-3/4 h-1.5 border border-white/20 rounded-full mb-1 inline-block"></div>
                                   <div className="w-4/5 h-[1px] bg-white/20"></div>
                                </div>
                             </div>
                         </div>
                       )}
                    </div>
                    <div className="text-center">
                       <h3 className="font-bold text-[#111827] text-sm mb-1">{design.name}</h3>
                       <p className="text-xs text-[#6b7280]">{design.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-[#f3f4f6] flex justify-between">
                <button
                  onClick={() => setStep(Step.DETAILS)}
                  className="flex items-center justify-center w-14 h-14 bg-[#f5f5f4] text-[#0a0a0a] rounded-full hover:bg-[#e5e7eb] transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={() => setStep(Step.JOB)}
                  className="group flex items-center gap-4 bg-[#0a0a0a] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#FF6321] transition-all"
                >
                  Next Step
                  <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* JOB DESCRIPTION ENTRY STEP */}
        {step === Step.JOB && (
          <motion.div
            key="job"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto py-12 px-6 print:hidden min-h-screen"
          >
            <div className="flex items-center justify-between mb-12">
               <div>
                 <span className="text-xs uppercase tracking-widest font-bold text-[#FF6321] mb-2 block">Step 03 / 03</span>
                 <h2 className="text-4xl font-bold tracking-tight">Target Role</h2>
               </div>
               <div className="hidden sm:block">
                 <Logo />
               </div>
            </div>

             <div className="bg-white border rounded-3xl p-6 sm:p-8 lg:p-12 [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] space-y-8 relative overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Job Title</label>
                  <input
                    type="text"
                    className="w-full bg-[#f5f5f4] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
                    placeholder="Product Manager, Growth"
                    value={jobData.title}
                    onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2">Target Company</label>
                  <input
                    type="text"
                    className="w-full bg-[#f5f5f4] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
                    placeholder="Stripe"
                    value={jobData.company}
                    onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider">Job Description (JD)</label>
                    <span className="text-xs text-[#6b7280]">Paste the full job posting</span>
                  </div>
                  <textarea
                    rows={12}
                    className="w-full bg-[#f5f5f4] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all resize-y"
                    placeholder="We rely on product managers to..."
                    value={jobData.description}
                    onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-[#fef2f2] text-[#dc2626] p-4 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="pt-8 border-t border-[#f3f4f6] flex justify-between">
                <button
                  onClick={() => setStep(Step.DESIGN)}
                  className="flex items-center justify-center w-14 h-14 bg-[#f5f5f4] text-[#0a0a0a] rounded-full hover:bg-[#e5e7eb] transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  disabled={!jobData.description}
                  onClick={handleGenerate}
                  className="group flex items-center gap-4 bg-[#FF6321] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#e04f14] transition-all disabled:opacity-50 disabled:hover:bg-[#FF6321]"
                >
                  <Wand2 size={18} />
                  Generate Resume
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* GENERATING STEP */}
          {step === Step.GENERATING && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-6 print:hidden relative"
          >
            <Header />
            <div className="text-center">
              <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                 className="inline-block mb-8 text-[#FF6321]"
              >
                <Loader2 size={64} className="opacity-80" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Beating the ATS...</h2>
              <p className="text-[#6b7280] max-w-sm mx-auto animate-pulse">{statusMessage}</p>
            </div>
          </motion.div>
        )}

        {/* DONE STEP */}
        {step === Step.DONE && resumeData && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[850px] mx-auto py-12 px-6 print:p-0 print:py-0 print:max-w-none"
          >
            {/* Sticky Action Bar */}
            <div className="sticky top-2 sm:top-4 z-50 flex flex-wrap justify-between items-center gap-2 sm:gap-0 bg-white/95 backdrop-blur-md border shadow-lg shadow-black/5 rounded-2xl sm:rounded-full px-3 sm:px-4 py-3 mb-8 print:hidden mx-auto w-full max-w-[850px]">
               <button
                  onClick={() => setStep(Step.JOB)}
                  className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-bold uppercase tracking-widest hover:text-[#FF6321] transition-colors mr-auto sm:mr-0"
                >
                  <ArrowLeft size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Edit</span>
                </button>
                
                <div className="hidden sm:flex items-center gap-1 bg-[#f3f4f6]/80 p-1 rounded-full mx-auto">
                  {(['classic', 'modern', 'minimal', 'split'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setDesignId(d)}
                      className={`px-3 sm:px-4 py-1.5 object-cover rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all ${designId === d ? 'bg-white shadow-sm text-[#FF6321]' : 'text-[#6b7280] hover:text-[#111827]'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div className="flex items-center sm:hidden gap-1 bg-[#f3f4f6]/80 px-2 py-1.5 rounded-full mx-2">
                   <select 
                     value={designId} 
                     onChange={e => setDesignId(e.target.value as any)}
                     className="bg-transparent text-[10px] font-bold uppercase outline-none text-[#374151]"
                   >
                     <option value="classic">Classic</option>
                     <option value="modern">Modern</option>
                     <option value="minimal">Minimal</option>
                     <option value="split">Split</option>
                   </select>
                </div>

                <div className="hidden lg:flex items-center gap-1 bg-[#f3f4f6]/80 p-1 rounded-full mr-2 space-x-1">
                   <button
                     onClick={() => setPreviewMode('desktop')}
                     className={`p-1.5 rounded-full transition-all ${previewMode === 'desktop' ? 'bg-white shadow-sm text-[#FF6321]' : 'text-[#6b7280] hover:text-[#111827]'}`}
                     title="Desktop View"
                   >
                     <Monitor size={14} />
                   </button>
                   <button
                     onClick={() => setPreviewMode('mobile')}
                     className={`p-1.5 rounded-full transition-all ${previewMode === 'mobile' ? 'bg-white shadow-sm text-[#FF6321]' : 'text-[#6b7280] hover:text-[#111827]'}`}
                     title="Mobile View"
                   >
                     <Smartphone size={14} />
                   </button>
                </div>

                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setStep(Step.COVER_LETTER)}
                    className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-orange-500 to-[#FF6321] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold uppercase tracking-widest text-[9px] sm:text-xs hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all"
                  >
                    <FileText size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Cover</span> Letter
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1 sm:gap-2 bg-[#0a0a0a] text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold uppercase tracking-widest text-[9px] sm:text-xs hover:bg-[#FF6321] hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all"
                  >
                    <Download size={12} className="sm:w-3.5 sm:h-3.5" /> PDF
                  </button>
                </div>
            </div>

            <div className="w-full pb-12 flex justify-center overflow-hidden">
              {previewMode === 'desktop' ? (
                <div className="print:w-auto" style={{ height: windowWidth < 898 ? `calc(${Math.max(0.35, (windowWidth - 48) / 850)} * 1100px)` : 'auto' }}>
                  <div 
                    className="origin-top flex justify-center print:transform-none"
                    style={{ transform: `scale(${Math.min(1, Math.max(0.35, (windowWidth - 48) / 850))})` }}
                  >
                    <div id="resume-document" className="bg-white w-[850px] min-h-[1100px] shadow-2xl shadow-black/5 ring-1 ring-black/5 print:shadow-none print:ring-0 print:w-[850px] print:min-h-auto flex flex-col">
                       <ResumePreview data={resumeData} designId={designId} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mx-auto w-[375px] h-[812px] transform scale-[0.85] sm:scale-100 origin-top bg-gray-100 border-[14px] border-[#0a0a0a] rounded-[3rem] shadow-2xl shadow-black/20 relative flex flex-col overflow-hidden print:hidden mt-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0a0a0a] rounded-b-2xl z-50"></div>
                  <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pt-10 pb-12 w-full bg-[#f3f4f6]">
                    <div className="w-[850px] mx-auto origin-top-left flex flex-col" style={{ transform: 'scale(0.407)' }}>
                      <div id="resume-document-mobile" className="bg-white shadow-xl flex-1 w-full min-h-[1100px] flex flex-col">
                         <ResumePreview data={resumeData} designId={designId} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
        {/* COVER LETTER PAGE */}
        {step === Step.COVER_LETTER && (
          <motion.div
            key="cover_letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex flex-col min-h-screen ${coverLetterState === 'GENERATING' ? 'items-center justify-center' : ''} bg-[#f9fafb] relative pb-20`}
          >
            <Header />
            
            {coverLetterState === 'IDLE' && (
              <div className="max-w-4xl mx-auto w-full px-6 pt-32">
                <h2 className="text-4xl font-bold tracking-tight mb-2 text-[#0a0a0a]">Cover Letter Generator</h2>
                <p className="text-[#6b7280] mb-8">Generate a matching cover letter using your resume data and the target job description.</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column: Data Review */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-4 border-b pb-2">1. Your Profile Data</h3>
                      
                      {!userData.fullName && !userData.experience[0] ? (
                        <div className="border border-dashed border-[#FF6321] bg-orange-50 rounded-2xl p-6 text-center relative hover:bg-orange-100 transition-colors cursor-pointer">
                          <input 
                            type="file" 
                            accept=".pdf,.txt,.doc,.docx"
                            onChange={handleCVUpload}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait"
                          />
                          
                          {isUploading ? (
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <Loader2 size={32} className="text-[#FF6321] animate-spin" />
                              <p className="text-[#FF6321] font-medium text-sm">Extracting CV data via AI...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="bg-white p-3 rounded-full text-[#FF6321] shadow-sm">
                                <UploadCloud size={24} />
                              </div>
                              <div>
                                <h4 className="font-bold text-[#111827]">Upload Resume to Auto-Fill</h4>
                                <p className="text-xs text-[#4b5563] mt-1">PDF, TXT, DOC, DOCX up to 5MB</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4 text-sm text-[#4b5563]">
                          <div>
                            <span className="font-semibold text-[#111827]">Name:</span> {userData.fullName || "Not provided"}
                          </div>
                          <div>
                            <span className="font-semibold text-[#111827]">Current Role:</span> {userData.currentRole || "Not provided"}
                          </div>
                          <div>
                            <span className="font-semibold text-[#111827]">Experience Entries:</span> {userData.experience.filter(e => e.trim().length > 0).length}
                          </div>
                          <div>
                            <span className="font-semibold text-[#111827]">Skills Provided:</span> {userData.skills[0] ? "Yes" : "No"}
                          </div>
                          
                          <button 
                            onClick={() => setStep(Step.DETAILS)}
                            className="text-[#FF6321] font-semibold text-xs uppercase tracking-widest mt-2 block hover:underline"
                          >
                            Edit Profile Data
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-4 border-b pb-2">3. Select Tone</h3>
                       <div className="flex gap-3">
                         {['Professional', 'Confident', 'Friendly'].map(tone => (
                           <button
                             key={tone}
                             onClick={() => setCoverLetterTone(tone)}
                             className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${coverLetterTone === tone ? 'bg-[#111827] text-white' : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]'}`}
                           >
                             {tone}
                           </button>
                         ))}
                       </div>
                    </div>
                  </div>
                  
                  {/* Right Column: Job Desc & CTA */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] flex-1">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-4 border-b pb-2">2. Target Job</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#4b5563] mb-1">Job Title</label>
                          <input 
                            value={jobData.title}
                            onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                            placeholder="e.g. Senior Frontend Engineer"
                            className="w-full p-3 bg-[#f3f4f6] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF6321]" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#4b5563] mb-1">Company</label>
                          <input 
                            value={jobData.company}
                            onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                            placeholder="e.g. Acme Corp"
                            className="w-full p-3 bg-[#f3f4f6] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF6321]" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#4b5563] mb-1">Job Description</label>
                          <textarea 
                            value={jobData.description}
                            onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                            placeholder="Paste the full job posting..."
                            className="w-full h-32 p-3 bg-[#f3f4f6] border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF6321] resize-none" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="p-4 bg-[#fef2f2] text-[#dc2626] rounded-xl text-sm font-medium">
                        {error}
                      </div>
                    )}
                    
                    <button
                      onClick={handleGenerateCoverLetter}
                      disabled={!userData.fullName || !userData.experience[0] || !jobData.description || !jobData.title}
                      className="w-full py-4 bg-[#FF6321] hover:bg-[#E85B1F] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                      <Wand2 size={20} />
                      Generate Cover Letter
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {coverLetterState === 'GENERATING' && (
              <div className="text-center z-10 p-6 mt-20">
                <motion.div
                   animate={{ rotate: 360 }}
                   transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                   className="inline-block mb-6 relative"
                >
                  <div className="w-16 h-16 border-4 border-[#e5e7eb] rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-[#FF6321] rounded-full border-t-transparent absolute top-0 left-0"></div>
                </motion.div>
                <motion.h3 
                  key={statusMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-[#111827] mb-2"
                >
                  {statusMessage}
                </motion.h3>
                <p className="text-[#6b7280] max-w-sm mx-auto animate-pulse">This might take a few seconds as we analyze your profile and tailor the letter.</p>
              </div>
            )}
            
            {coverLetterState === 'DONE' && coverLetterData && (
              <div className="max-w-7xl mx-auto w-full px-6 pt-32 grid lg:grid-cols-3 gap-8 print:block print:p-0 print:m-0 print:max-w-none">
                {/* Left side: Output Letter */}
                <div className="lg:col-span-2 space-y-4 print:space-y-0">
                  <div className="flex items-center justify-between print:hidden">
                    <h2 className="text-2xl font-bold text-[#111827]">Your Cover Letter</h2>
                    <div className="flex gap-2">
                       <button onClick={() => {
                          navigator.clipboard.writeText(coverLetterData.content);
                       }} className="px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#f9fafb]">
                         Copy
                       </button>
                       <button onClick={handlePrintCoverLetter} className="px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#f9fafb]">
                         <Download size={14} /> PDF
                       </button>
                       <button onClick={handleGenerateCoverLetter} className="px-3 py-2 bg-white border border-[#e5e7eb] rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#f9fafb]">
                         <Wand2 size={14} /> Regenerate
                       </button>
                    </div>
                  </div>
                  <div id="cover-letter-document" className="bg-white p-10 rounded-2xl border border-[#e5e7eb] [box-shadow:0_10px_15px_-3px_rgba(0,0,0,0.1)] min-h-[600px] print:p-0 print:border-none print:[box-shadow:none] print:min-h-auto">
                    <div 
                      contentEditable
                      suppressContentEditableWarning
                      className="w-full resize-none outline-none text-[#374151] font-sans leading-relaxed text-sm bg-transparent whitespace-pre-wrap print:text-black print:text-[12pt]"
                    >
                      {coverLetterData.content}
                    </div>
                  </div>
                </div>
                
                {/* Right side: Insights */}
                <div className="space-y-6 print:hidden">
                   <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-4 border-b pb-2">AI Insights</h3>
                     
                     <div className="space-y-6">
                       <div>
                         <h4 className="text-xs font-bold text-[#111827] mb-2 flex items-center gap-2 text-orange-700 bg-orange-50 px-2 py-1 rounded w-fit">
                           ✓ Matched Skills
                         </h4>
                         <ul className="text-sm text-[#4b5563] space-y-1 list-disc pl-4 marker:text-orange-500">
                           {coverLetterData.insights.matchedSkills.map((s, i) => <li key={i}>{s}</li>)}
                         </ul>
                       </div>
                       
                       <div>
                         <h4 className="text-xs font-bold text-[#111827] mb-2 flex items-center gap-2 text-[#dc2626] bg-[#fef2f2] px-2 py-1 rounded w-fit">
                           ⚠ Missing Keywords
                         </h4>
                         {coverLetterData.insights.missingKeywords.length > 0 ? (
                           <ul className="text-sm text-[#4b5563] space-y-1 list-disc pl-4 marker:text-red-400">
                             {coverLetterData.insights.missingKeywords.map((s, i) => <li key={i}>{s}</li>)}
                           </ul>
                         ) : (
                           <p className="text-sm text-[#4b5563]">You hit all key requirements!</p>
                         )}
                       </div>
                       
                       <div>
                         <h4 className="text-xs font-bold text-[#111827] mb-2 flex items-center gap-2 text-orange-500 bg-orange-50 px-2 py-1 rounded w-fit">
                           💡 Improvement Tips
                         </h4>
                         <ul className="text-sm text-[#4b5563] space-y-2">
                           {coverLetterData.insights.improvementTips.map((tip, i) => (
                             <li key={i} className="flex gap-2">
                               <span className="text-orange-500">•</span>
                               <span>{tip}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                     </div>
                   </div>
                   
                   <div className="bg-[#111827] p-6 rounded-2xl text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent blur-2xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                     <h3 className="font-bold text-lg mb-2 relative z-10">Pro Templates & Tones</h3>
                     <p className="text-sm text-gray-300 mb-4 relative z-10">Unlock premium cover letter templates, bold rewriting, and unlimited generations.</p>
                     <button className="w-full py-2 bg-white text-[#111827] font-bold rounded-lg text-sm transition-transform active:scale-95 relative z-10">
                       Upgrade to Pro
                     </button>
                   </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* BLOG PAGE */}
        {step === Step.BLOG && (
          <motion.div
            key="blog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
          >
            <Header />
            <div className="max-w-2xl mt-24">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Career Insights Blog</h2>
              <p className="text-xl text-[#374151] mb-8 leading-relaxed">
                Expert tips on beating the ATS, acing interviews, and negotiating the best salary. Coming soon to ResuBeat.
              </p>
              <div className="grid sm:grid-cols-2 gap-6 text-left w-full max-w-3xl">
                <div className="border border-[#0a0a0a]/10 bg-white rounded-2xl overflow-hidden [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <div className="h-32 bg-[#e5e7eb] w-full" />
                  <div className="p-6">
                    <div className="h-4 bg-[#f3f4f6] rounded w-3/4 mb-3" />
                    <div className="h-3 bg-[#e5e7eb] rounded w-full mb-2" />
                    <div className="h-3 bg-[#f3f4f6] rounded w-5/6" />
                  </div>
                </div>
                <div className="border border-[#0a0a0a]/10 bg-white rounded-2xl overflow-hidden [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]">
                  <div className="h-32 bg-[#e5e7eb] w-full" />
                  <div className="p-6">
                    <div className="h-4 bg-[#f3f4f6] rounded w-2/3 mb-3" />
                    <div className="h-3 bg-[#e5e7eb] rounded w-full mb-2" />
                    <div className="h-3 bg-[#f3f4f6] rounded w-4/5" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PREMIUM PAGE */}
        {step === Step.PREMIUM && (
          <motion.div
            key="premium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 md:p-8 text-center bg-[#111827] text-white"
          >
            <Header />
            <div className="max-w-4xl mt-32 w-full">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-orange-400 font-bold text-sm mb-8 border border-white/10">
                <Crown size={16} className="fill-orange-400" /> ResuBeat Pro
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-[64px] font-bold tracking-tight mb-6 leading-tight">
                Unlock your full <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">career potential.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Get unlimited AI generations, premium designs, tailored cover letters, and deep career insights.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto mb-16">
                 {/* Feature 1 */}
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-orange-400 relative z-10">
                       <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 relative z-10">Unlimited Resumes</h3>
                    <p className="text-gray-400 text-[15px] leading-relaxed relative z-10">Generate as many tailored resumes as you need for different roles and industries.</p>
                 </div>
                 
                 {/* Feature 2 */}
                 <div className="bg-white/5 border border-orange-500/30 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors shadow-[0_0_40px_rgba(249,115,22,0.1)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="bg-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white relative z-10 shadow-lg shadow-orange-500/30">
                       <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 relative z-10">Pro Templates</h3>
                    <p className="text-gray-400 text-[15px] leading-relaxed relative z-10">Access our full library of ATS-optimized designer templates proven to get interviews.</p>
                 </div>
                 
                 {/* Feature 3 */}
                 <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-orange-400 relative z-10">
                       <Target size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 relative z-10">Auto-Apply Pipeline</h3>
                    <p className="text-gray-400 text-[15px] leading-relaxed relative z-10">Let our system automatically apply to matching jobs on your behalf every single day.</p>
                 </div>
              </div>
              
              <button className="relative w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-[18px] rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_10px_40px_-10px_rgba(249,115,22,0.8)] flex justify-center items-center overflow-hidden group mx-auto mb-20">
                <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
                <span className="relative z-10 flex items-center gap-2">Get ResuBeat Pro <ArrowRight size={20} /></span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
