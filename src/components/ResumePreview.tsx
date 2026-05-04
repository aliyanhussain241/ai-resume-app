import { ResumeData } from "../lib/types";

export type DesignId = 'classic' | 'modern' | 'minimal' | 'split' | 'creative-orange' | 'corporate-dark' | 'modern-block' | 'contrast-bold';

export function ResumePreview({ data, designId = 'classic' }: { data: ResumeData, designId?: DesignId }) {
  if (designId === 'creative-orange') {
    return (
      <div className="bg-[#f3f4f6] text-[#111827] mx-auto print:mx-0 w-full max-w-[850px] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] print:[box-shadow:none] min-h-[1100px] flex font-sans overflow-hidden p-6 gap-6 relative">
         <div className="w-[35%] bg-[#EA580C] text-white p-8 rounded-3xl flex flex-col [box-shadow:0_10px_15px_-3px_rgba(0,0,0,0.1)] z-10 print:shadow-[0_0_0_1000px_#EA580C_inset] print:[box-shadow:none]">
           {data.header.profilePicture && (
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white [box-shadow:0_4px_6px_-1px_rgba(0,0,0,0.1)] mx-auto mb-8 mt-4 shrink-0 bg-white">
                <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              </div>
           )}
           <div className="mb-8 w-full">
             <h2 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-4 border-b border-white/20 pb-2">Education</h2>
             <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-bold text-white mb-1">{edu.degree}</h3>
                  <p className="text-xs text-white/80">{edu.institution}</p>
                  <span className="text-xs font-bold mt-1 block opacity-70">{edu.dateRange}</span>
                </div>
              ))}
             </div>
           </div>
           <div className="mb-8 w-full">
             <h2 className="text-sm font-bold uppercase tracking-widest text-white/90 mb-4 border-b border-white/20 pb-2">Skills</h2>
             <div className="space-y-4">
              {data.skills.map((skillGroup, idx) => (
                <div key={idx}>
                  <span className="block text-xs font-bold text-white mb-1">{skillGroup.category}</span>
                  <span className="text-xs text-white/80 leading-relaxed block">{skillGroup.items.join(', ')}</span>
                </div>
              ))}
             </div>
           </div>
         </div>
         <div className="w-[65%] bg-white p-10 rounded-3xl [box-shadow:0_10px_15px_-3px_rgba(0,0,0,0.1)] z-10 print:[box-shadow:none] font-sans flex flex-col">
           <div className="mb-8">
             <h1 className="text-4xl font-extrabold text-[#111827] uppercase tracking-tighter mb-1">{data.header.fullName}</h1>
             <p className="text-xl text-[#6b7280] font-medium tracking-widest uppercase">{data.header.title}</p>
             <div className="text-xs font-semibold text-[#9ca3af] uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-4 border-t border-[#f3f4f6]">
               {data.header.contactInfo.split('|').map((info, idx) => <span key={idx}>{info.trim()}</span>)}
             </div>
           </div>
           <div className="mb-8">
             <h2 className="text-sm font-bold uppercase tracking-widest text-[#EA580C] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EA580C]"></span> About Me
             </h2>
             <p className="text-sm text-[#4b5563] leading-relaxed">{data.summary}</p>
           </div>
           <div>
             <h2 className="text-sm font-bold uppercase tracking-widest text-[#EA580C] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EA580C]"></span> Job Experience
             </h2>
             <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-sm font-bold text-[#111827] uppercase">{exp.title}</h3>
                    <span className="text-xs font-bold text-[#6b7280] bg-[#f3f4f6] px-2 py-1 rounded">{exp.dateRange}</span>
                  </div>
                  <p className="text-sm font-bold text-[#6b7280] mb-2">{exp.company}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs text-[#4b5563] leading-relaxed marker:text-[#d1d5db]">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
             </div>
           </div>
         </div>
      </div>
    );
  }

  if (designId === 'corporate-dark') {
    return (
      <div className="bg-[#f0f2f5] text-[#111827] mx-auto print:mx-0 w-full max-w-[850px] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] print:[box-shadow:none] min-h-[1100px] font-sans flex flex-col relative overflow-hidden">
        <div className="w-full bg-[#E5E7EB] flex items-stretch min-h-[180px] print:shadow-[0_0_0_1000px_#E5E7EB_inset]">
          <div className="w-[60%] p-8 flex flex-col justify-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#1f2937] mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1f2937] text-white flex items-center justify-center text-xs">◆</span> About Me
            </h2>
            <p className="text-xs text-[#4b5563] leading-relaxed">{data.summary}</p>
          </div>
          <div className="w-[40%] flex flex-col justify-center items-end text-right p-8 relative z-10 bg-white/40 border-l border-white/60">
             <h1 className="text-3xl font-extrabold uppercase text-[#111827] leading-none mb-2">{data.header.fullName.split(' ')[0]} <br/> <span className="text-[#4b5563] font-light">{data.header.fullName.split(' ').slice(1).join(' ')}</span></h1>
             <p className="text-xs text-[#1f2937] uppercase tracking-widest font-bold mt-1 bg-white px-2 py-1">{data.header.title}</p>
          </div>
        </div>
        <div className="flex flex-1">
          <div className="w-[60%] bg-white p-8 pt-12">
             <div className="mb-10">
               <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111827] mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#111827]"></span> Job Experience
               </h2>
               <div className="space-y-8">
                {data.experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide">{exp.title}</h3>
                      <span className="text-xs font-bold text-[#9ca3af]">{exp.dateRange}</span>
                    </div>
                    <p className="text-xs font-black text-[#6b7280] uppercase tracking-wider mb-3">{exp.company}</p>
                    <ul className="space-y-2">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-xs text-[#4b5563] leading-relaxed pl-4 relative">
                           <span className="absolute left-0 top-1.5 w-1.5 h-1.5 border border-[#9ca3af] rounded-sm"></span>
                           {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
               </div>
             </div>
             <div>
               <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111827] mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#111827]"></span> Skills
               </h2>
               <div className="grid grid-cols-2 gap-4">
                {data.skills.map((skillGroup, idx) => (
                  <div key={idx}>
                    <span className="block text-xs font-bold text-[#111827] uppercase tracking-widest mb-1">{skillGroup.category}</span>
                    <span className="text-xs text-[#6b7280] leading-relaxed block">{skillGroup.items.join(', ')}</span>
                  </div>
                ))}
               </div>
             </div>
          </div>
          <div className="w-[40%] bg-[#1F2937] text-white p-8 pt-24 relative print:shadow-[0_0_0_1000px_#1F2937_inset]">
             {data.header.profilePicture && (
               <div className="absolute -top-[70px] left-1/2 -translate-x-1/2 w-[140px] h-[140px] rounded-full border-[6px] border-[#1F2937] bg-white overflow-hidden [box-shadow:0_20px_25px_-5px_rgba(0,0,0,0.1)] z-20">
                 <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover" />
               </div>
             )}
             <div className="mb-10 text-center">
                 <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-4 bg-white/10 py-2 rounded">Contact</h2>
                 <div className="space-y-3 text-xs text-[#9ca3af]">
                    {data.header.contactInfo.split('|').map((info, idx) => <span key={idx} className="block">{info.trim()}</span>)}
                 </div>
             </div>
             <div className="mb-10 text-center">
                 <h2 className="text-xs font-bold uppercase tracking-widest text-white mb-4 bg-white/10 py-2 rounded">Education</h2>
                 <div className="space-y-5 break-words">
                  {data.education.map((edu, idx) => (
                    <div key={idx}>
                      <h3 className="text-xs font-bold text-white mb-1 uppercase leading-snug">{edu.degree}</h3>
                      <p className="text-xs text-[#9ca3af] mb-1">{edu.institution}</p>
                      <span className="text-[10px] text-[#6b7280] block">{edu.dateRange}</span>
                    </div>
                  ))}
                 </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (designId === 'modern-block') {
    return (
      <div className="bg-white text-[#111827] mx-auto print:mx-0 w-full max-w-[850px] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] print:[box-shadow:none] min-h-[1100px] font-sans p-10 overflow-hidden relative border-t-[16px] border-[#F97316]">
        <div className="flex mb-8 items-center gap-8">
           {data.header.profilePicture && (
              <div className="w-[180px] h-[220px] bg-[#f3f4f6] shrink-0 overflow-hidden [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)]">
                 <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover grayscale opacity-90 contrast-125" />
              </div>
           )}
           <div className="flex-1">
              <h1 className="text-[2.5rem] leading-[1.1] font-light text-[#1f2937] uppercase tracking-tight mb-3">
                <span className="font-bold text-[#111827]">{data.header.fullName.split(' ')[0]}</span> <br/> {data.header.fullName.split(' ').slice(1).join(' ')}
              </h1>
              <p className="text-lg font-medium text-[#F97316] mb-6 tracking-widest uppercase">{data.header.title}</p>
              <div className="text-xs text-[#6b7280] uppercase tracking-widest border-t border-b py-3 font-medium flex gap-4 flex-wrap">
                 {data.header.contactInfo.split('|').map((info, i) => <span key={i}>{info.trim()}</span>)}
              </div>
           </div>
        </div>
        <div className="flex bg-[#374151] text-white p-4 font-bold uppercase tracking-[0.2em] justify-center mb-10 w-[90%] print:shadow-[0_0_0_1000px_#374151_inset] text-sm">
           {data.header.title}
        </div>
        <div className="flex gap-10">
           <div className="w-[35%] space-y-10">
              <div>
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#F97316] mb-4 border-b pb-2">Profile</h2>
                 <p className="text-xs leading-relaxed text-[#4b5563]">{data.summary}</p>
              </div>
              <div>
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#F97316] mb-4 border-b pb-2">Expertise</h2>
                 <div className="space-y-4">
                  {data.skills.map((skillGroup, idx) => (
                    <div key={idx}>
                      <span className="block text-xs font-bold text-[#1f2937] uppercase tracking-wider mb-1">{skillGroup.category}</span>
                      <span className="text-xs text-[#6b7280] leading-relaxed block">{skillGroup.items.join(', ')}</span>
                      <div className="w-full h-1 bg-[#f3f4f6] mt-2 rounded overflow-hidden"><div className="w-2/3 h-full bg-[#d1d5db]"></div></div>
                    </div>
                  ))}
                 </div>
              </div>
              <div>
                 <h2 className="text-sm font-bold uppercase tracking-widest text-[#F97316] mb-4 border-b pb-2">Education</h2>
                 <div className="space-y-4">
                  {data.education.map((edu, idx) => (
                    <div key={idx}>
                      <h3 className="text-xs font-bold text-[#1f2937] mb-1">{edu.degree}</h3>
                      <p className="text-[10px] uppercase font-bold text-[#9ca3af] mb-1">{edu.institution}</p>
                      <span className="text-[10px] text-[#F97316] block">{edu.dateRange}</span>
                    </div>
                  ))}
                 </div>
              </div>
           </div>
           <div className="w-[65%]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#F97316] mb-6 border-b pb-2">Experience</h2>
              <div className="space-y-8">
                {data.experience.map((exp, idx) => (
                  <div key={idx}>
                     <div className="flex justify-between items-baseline mb-2">
                       <h3 className="text-sm font-bold text-[#111827] uppercase tracking-widest">{exp.title}</h3>
                       <span className="text-[10px] font-bold text-[#F97316]">{exp.dateRange}</span>
                     </div>
                     <p className="text-xs font-medium text-[#6b7280] uppercase tracking-widest mb-3">{exp.company}</p>
                     <p className="text-xs text-[#4b5563] leading-relaxed mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                     </p>
                     <ul className="list-disc pl-4 space-y-1">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-xs text-[#4b5563] leading-relaxed marker:text-[#d1d5db]">{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (designId === 'contrast-bold') {
     return (
       <div className="bg-white text-[#111827] mx-auto print:mx-0 w-full max-w-[850px] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] print:[box-shadow:none] min-h-[1100px] flex font-sans overflow-hidden">
          <div className="w-[45%] flex flex-col relative z-20">
             <div className="h-[240px] flex items-center justify-center p-8 relative">
                <div className="absolute top-0 right-[-50px] w-full h-[60%] bg-white rounded-br-full z-0"></div>
                {data.header.profilePicture && (
                   <div className="w-48 h-48 rounded-full border-[8px] border-[#F97316] p-1 bg-white [box-shadow:0_20px_25px_-5px_rgba(0,0,0,0.1)] z-30 ml-8 mt-12">
                      <div className="w-full h-full rounded-full overflow-hidden">
                         <img src={data.header.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                   </div>
                )}
             </div>
             <div className="p-10 pt-4 space-y-10">
                <div>
                   <h2 className="text-sm font-black text-[#111827] uppercase tracking-[0.2em] mb-6 bg-[#F97316] text-white py-2 px-4 rounded-r-full -ml-10 inline-block w-4/5 print:shadow-[0_0_0_1000px_#f97316_inset]">Education</h2>
                   <div className="space-y-6">
                    {data.education.map((edu, idx) => (
                      <div key={idx} className="relative pl-6">
                        <div className="absolute left-0 top-1 w-3 h-3 bg-[#F97316]"></div>
                        <span className="text-[10px] font-bold text-[#6b7280] mb-1 block">{edu.dateRange}</span>
                        <h3 className="text-xs font-bold text-[#111827] uppercase tracking-widest mb-1 leading-snug">{edu.degree}</h3>
                        <p className="text-xs text-[#4b5563]">{edu.institution}</p>
                      </div>
                    ))}
                   </div>
                </div>
                <div>
                   <h2 className="text-sm font-black text-[#111827] uppercase tracking-[0.2em] mb-6 bg-[#F97316] text-white py-2 px-4 rounded-r-full -ml-10 inline-block w-4/5 print:shadow-[0_0_0_1000px_#f97316_inset]">Experience</h2>
                   <div className="space-y-8">
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="relative pl-6">
                        <div className="absolute left-0 top-1 w-3 h-3 bg-[#F97316]"></div>
                        <span className="text-[10px] font-bold text-[#6b7280] mb-1 block">{exp.dateRange}</span>
                        <h3 className="text-xs font-bold text-[#111827] uppercase tracking-widest mb-1 leading-snug">{exp.title}</h3>
                        <p className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest mb-2">{exp.company}</p>
                        <ul className="space-y-1.5 border-t border-[#f3f4f6] pt-2">
                          {exp.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-[11px] text-[#4b5563] leading-snug">- {bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                   </div>
                </div>
             </div>
          </div>
          <div className="w-[55%] bg-[#1F2937] text-white flex flex-col print:shadow-[0_0_0_1000px_#1F2937_inset]">
             <div className="min-h-[220px] bg-[#F97316] w-[120%] -ml-12 p-10 pl-24 pt-16 flex flex-col justify-center rounded-l-[100px] [box-shadow:0_10px_15px_-3px_rgba(0,0,0,0.1)] z-10 print:shadow-[0_0_0_1000px_#f97316_inset]">
                <h1 className="text-4xl font-extrabold uppercase tracking-tighter text-white mb-2 leading-none">{data.header.fullName}</h1>
                <p className="text-sm font-bold text-white/90 uppercase tracking-[0.25em]">{data.header.title}</p>
             </div>
             <div className="p-10 pl-16 space-y-12 shrink-0">
                <div>
                   <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-4 border border-white/20 rounded-full px-6 py-2 inline-block">Contact Me</h2>
                   <div className="space-y-4 text-xs text-[#d1d5db] mt-2">
                      {data.header.contactInfo.split('|').map((info, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                           <span className="w-6 h-6 rounded bg-[#F97316] text-white flex items-center justify-center shrink-0 text-[10px]">C</span>
                           <span className="leading-snug break-all">{info.trim()}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div>
                   <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-4 border border-white/20 rounded-full px-6 py-2 inline-block">Pro Skills</h2>
                   <div className="space-y-6 mt-2">
                    {data.skills.map((skillGroup, idx) => (
                      <div key={idx}>
                        <span className="block text-xs font-bold text-white uppercase tracking-widest mb-2 text-center">{skillGroup.category}</span>
                        <div className="flex flex-wrap justify-center gap-1.5 text-xs text-[#F97316]">
                           {skillGroup.items.map((item, i) => (
                             <span key={i} className="text-[10px] border border-white/10 px-2 py-1 rounded bg-white/5 text-[#d1d5db]">{item}</span>
                           ))}
                        </div>
                      </div>
                    ))}
                   </div>
                </div>
             </div>
          </div>
       </div>
     )
  }

  if (designId === 'split') {
    return (
      <div className="bg-white text-[#111827] mx-auto print:mx-0 w-full max-w-[850px] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] print:[box-shadow:none] min-h-[1100px] flex font-sans overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[30%] bg-[#1f2937] text-white p-8 flex flex-col pt-12 items-center">
          {data.header.profilePicture && (
            <div className="mb-6 rounded-full overflow-hidden border-4 border-[#eab308] w-32 h-32 flex-shrink-0">
              <img src={data.header.profilePicture} alt={data.header.fullName} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="w-full mb-8">
             <h2 className="text-xs font-bold tracking-widest text-[#eab308] uppercase mb-4 text-center border-b border-[#4b5563] pb-2">Contact</h2>
             <div className="space-y-3 text-xs text-[#d1d5db] flex flex-col items-center text-center">
               {data.header.contactInfo.split('|').map((info, idx) => (
                  <span key={idx} className="block">{info.trim()}</span>
               ))}
             </div>
          </div>
          
          <div className="w-full mb-8 text-center">
             <h2 className="text-xs font-bold tracking-widest text-[#eab308] uppercase mb-4 border-b border-[#4b5563] pb-2">Education</h2>
             <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-bold text-white mb-1">{edu.degree}</h3>
                  <p className="text-xs text-[#9ca3af] capitalize">{edu.institution}</p>
                  <span className="text-[10px] text-[#eab308] mt-1 block">{edu.dateRange}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full text-center">
             <h2 className="text-xs font-bold tracking-widest text-[#eab308] uppercase mb-4 border-b border-[#4b5563] pb-2">Skills</h2>
             <div className="space-y-4">
              {data.skills.map((skillGroup, idx) => (
                <div key={idx}>
                  <span className="block text-xs font-bold text-white mb-1">{skillGroup.category}</span>
                  <span className="text-xs text-[#9ca3af] leading-relaxed block">{skillGroup.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="w-[70%] bg-white p-10 pt-12">
          {/* Header */}
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#111827] mb-2 uppercase">
              {data.header.fullName}
            </h1>
            <p className="text-lg text-[#eab308] font-bold tracking-widest uppercase">
              {data.header.title}
            </p>
          </header>

          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#1f2937] flex items-center justify-center">
                <div className="w-3 h-3 bg-[#eab308] rounded-full"></div>
              </div>
              <h2 className="text-lg font-bold text-[#111827] uppercase tracking-widest">About Me</h2>
            </div>
            <p className="text-sm leading-relaxed text-[#4b5563]">
              {data.summary}
            </p>
          </section>

          <section>
             <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#1f2937] flex items-center justify-center">
                <div className="w-3 h-3 bg-[#eab308] rounded-full"></div>
              </div>
              <h2 className="text-lg font-bold text-[#111827] uppercase tracking-widest">Job Experience</h2>
            </div>
             <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-bold text-[#111827] uppercase">{exp.title}</h3>
                    <span className="text-xs font-bold text-[#111827]">{exp.dateRange}</span>
                  </div>
                  <p className="text-sm font-bold text-[#eab308] mb-2">{exp.company}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-sm text-[#4b5563] leading-relaxed marker:text-[#d1d5db]">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (designId === 'modern') {
    return (
      <div className="bg-white text-[#111827] mx-auto print:mx-0 w-full max-w-[850px] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] print:[box-shadow:none] min-h-[1100px] p-8 sm:p-12 font-sans overflow-hidden">
        {/* Header */}
        <header className="border-l-4 border-[#FF6321] pl-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827] mb-2">
            {data.header.fullName}
          </h1>
          <p className="text-2xl text-[#FF6321] font-semibold mb-3">
            {data.header.title}
          </p>
          <div className="text-sm text-[#4b5563] flex flex-wrap gap-x-4 gap-y-1 font-medium">
            {data.header.contactInfo.split('|').map((info, idx) => (
              <span key={idx}>{info.trim()}</span>
            ))}
          </div>
        </header>

        {/* Summary */}
        <section className="mb-8">
          <p className="text-[15px] leading-relaxed text-[#374151]">
            {data.summary}
          </p>
        </section>

        {/* Experience */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-4">
            Experience <div className="h-px flex-1 bg-[#e5e7eb]"></div>
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-[17px] font-bold text-[#111827]">{exp.title}</h3>
                  <span className="text-sm font-medium bg-[#f3f4f6] px-2 py-1 rounded text-[#4b5563]">{exp.dateRange}</span>
                </div>
                <p className="text-[15px] font-semibold text-[#FF6321] mb-2">{exp.company}</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-sm text-[#374151] leading-relaxed marker:text-[#9ca3af]">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          <section>
            <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-4">
              Education <div className="h-px flex-1 bg-[#e5e7eb]"></div>
            </h2>
            <div className="space-y-4">
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="text-base font-bold text-[#111827]">{edu.degree}</h3>
                  <p className="text-[15px] text-[#FF6321] font-medium">{edu.institution}</p>
                  <span className="text-sm text-[#6b7280]">{edu.dateRange}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-4">
              Skills <div className="h-px flex-1 bg-[#e5e7eb]"></div>
            </h2>
            <div className="space-y-3">
              {data.skills.map((skillGroup, idx) => (
                <div key={idx} className="text-[15px]">
                  <div className="font-bold text-[#111827] mb-1">{skillGroup.category}</div>
                  <div className="text-[#4b5563] leading-snug">{skillGroup.items.join(' • ')}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (designId === 'minimal') {
    return (
      <div className="bg-white text-[#111827] mx-auto print:mx-0 w-full max-w-[850px] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] print:[box-shadow:none] min-h-[1100px] p-8 sm:p-12 font-sans overflow-hidden">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-medium tracking-wide text-[#111827] mb-2">
            {data.header.fullName}
          </h1>
          <p className="text-lg text-[#6b7280] mb-4">
            {data.header.title}
          </p>
          <div className="text-xs text-[#9ca3af] flex flex-wrap justify-center gap-x-6 gap-y-1 uppercase tracking-wider">
            {data.header.contactInfo.split('|').map((info, idx) => (
              <span key={idx}>{info.trim()}</span>
            ))}
          </div>
        </header>

        {/* Summary */}
        <section className="mb-10 text-center max-w-2xl mx-auto">
          <p className="text-sm leading-loose text-[#4b5563]">
            {data.summary}
          </p>
        </section>

        {/* Experience */}
        <section className="mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] text-[#9ca3af] uppercase mb-6 text-center">
            Experience
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-4">
                <div className="text-sm text-[#6b7280] pt-1">
                  {exp.dateRange}
                </div>
                <div>
                  <h3 className="text-base font-medium text-[#111827]">{exp.title}</h3>
                  <p className="text-sm text-[#6b7280] mb-3">{exp.company}</p>
                  <ul className="space-y-2">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-sm text-[#4b5563] leading-relaxed flex items-start">
                        <span className="mr-3 text-[#d1d5db]">-</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section>
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#9ca3af] uppercase mb-6 text-center md:text-left">
              Education
            </h2>
            <div className="space-y-6">
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="text-sm font-medium text-[#111827]">{edu.degree}</h3>
                  <p className="text-sm text-[#6b7280]">{edu.institution}</p>
                  <span className="text-xs text-[#9ca3af] mt-1 block">{edu.dateRange}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#9ca3af] uppercase mb-6 text-center md:text-left">
              Skills
            </h2>
            <div className="space-y-4">
              {data.skills.map((skillGroup, idx) => (
                <div key={idx}>
                  <span className="block text-sm font-medium text-[#111827] mb-1">{skillGroup.category}</span>
                  <span className="text-sm text-[#6b7280] leading-relaxed">{skillGroup.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // default classic design
  return (
    <div className="bg-white text-[#111827] mx-auto print:mx-0 w-full max-w-[850px] [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] print:[box-shadow:none] min-h-[1100px] p-8 sm:p-12 font-sans overflow-hidden">
      {/* Header */}
      <header className="text-center border-b-2 border-[#1f2937] pb-6 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-[#111827] mb-2">
          {data.header.fullName}
        </h1>
        <p className="text-xl text-[#374151] font-medium tracking-wide mb-3">
          {data.header.title}
        </p>
        <div className="text-sm text-[#4b5563] flex flex-wrap justify-center gap-x-4 gap-y-1">
          {data.header.contactInfo.split('|').map((info, idx) => (
            <span key={idx}>{info.trim()}</span>
          ))}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-sm font-bold tracking-widest text-[#111827] uppercase border-b border-[#d1d5db] pb-1 mb-3">
          Professional Summary
        </h2>
        <p className="text-sm leading-relaxed text-[#1f2937]">
          {data.summary}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-sm font-bold tracking-widest text-[#111827] uppercase border-b border-[#d1d5db] pb-1 mb-3">
          Experience
        </h2>
        <div className="space-y-5">
          {data.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-base font-bold text-[#111827]">{exp.title}</h3>
                <span className="text-sm font-medium text-[#4b5563]">{exp.dateRange}</span>
              </div>
              <p className="text-sm font-semibold text-[#374151] mb-2">{exp.company}</p>
              <ul className="list-disc pl-5 space-y-1">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="text-sm text-[#1f2937] leading-relaxed marker:text-[#6b7280]">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-sm font-bold tracking-widest text-[#111827] uppercase border-b border-[#d1d5db] pb-1 mb-3">
          Education
        </h2>
        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <h3 className="text-base font-bold text-[#111827]">{edu.degree}</h3>
                <p className="text-sm text-[#374151]">{edu.institution}</p>
              </div>
              <span className="text-sm font-medium text-[#4b5563]">{edu.dateRange}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-sm font-bold tracking-widest text-[#111827] uppercase border-b border-[#d1d5db] pb-1 mb-3">
          Skills
        </h2>
        <div className="space-y-2">
          {data.skills.map((skillGroup, idx) => (
            <div key={idx} className="text-sm">
              <span className="font-bold text-[#111827] mr-2">{skillGroup.category}:</span>
              <span className="text-[#1f2937]">{skillGroup.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

