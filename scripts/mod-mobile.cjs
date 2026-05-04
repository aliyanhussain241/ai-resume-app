const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = content.substring(
    content.indexOf('<div className="w-full overflow-x-auto pb-12 scrollbar-hide">'),
    content.indexOf('</motion.div>', content.indexOf('<div className="w-full overflow-x-auto pb-12 scrollbar-hide">'))
);

const newStr = `<div className="w-full pb-12 flex justify-center">
              {previewMode === 'desktop' ? (
                <div className="print:w-auto" style={{ height: windowWidth < 898 ? \`calc(\${Math.max(0.4, (windowWidth - 48) / 850)} * 1100px)\` : 'auto' }}>
                  <div 
                    className="origin-top flex justify-center print:transform-none"
                    style={{ transform: \`scale(\${Math.min(1, Math.max(0.4, (windowWidth - 48) / 850))})\` }}
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
          `;
fs.writeFileSync(file, content.replace(targetStr, newStr));
console.log('Successfully replaced');
