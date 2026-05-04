const fs = require('fs');

const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = content.substring(
    content.indexOf('<div className="bg-white border rounded-3xl p-6 sm:p-8 lg:p-12 [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] space-y-8 relative overflow-hidden">'),
    content.indexOf('</motion.div>', content.indexOf('<div className="bg-white border rounded-3xl p-6 sm:p-8 lg:p-12 [box-shadow:0_1px_2px_0_rgba(0,0,0,0.05)] space-y-8 relative overflow-hidden">'))
);

const newStr = `<div className="bg-white border border-[#f3f4f6] rounded-3xl p-6 sm:p-10 lg:p-14 [box-shadow:0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-12 relative overflow-hidden">
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
                            placeholder={\`Role \${index + 1}: e.g. Stripe, 2021-2023.\\nManaged risk team, increased revenue by 10%...\`}
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
                            placeholder={\`Skill Group \${index + 1}: e.g. Python, React, SQL...\`}
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
`;
fs.writeFileSync(file, content.replace(targetStr, newStr));
console.log('Successfully replaced');
