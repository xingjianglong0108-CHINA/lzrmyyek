import React, { useState, useMemo } from 'react';
import { AssessmentData } from './types';
import { generateAssessmentReport } from './utils';
import ProgressBar from './components/ProgressBar';
import Header from './components/Header';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import ReferenceTables from './components/ReferenceTables';
import Watermark from './components/Watermark';
import { ChevronLeft, ChevronRight, Printer, BookOpen, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [showRef, setShowRef] = useState(false);
  const [data, setData] = useState<AssessmentData>({
      name: '', 
      gender: 'male', 
      age: '', 
      ageUnit: 'years',
      answers: {}, 
      details: {
          immuneTypes: [],
          steroid: { weight: '', dose: '', duration: '' },
          sot: { phase: '', hbsabLessThan10: false },
          hsct: { 
            phase: '', 
            isDonor: false, 
            rebuildMonths: '', 
            hasGVHD: '', 
            clinicalConditions: { 
              immunosuppressantsStopped3m: false, 
              noActiveGVHD: false, 
              bCellRecoveredIvigStopped3m: false 
            } 
          },
          asplenia: { isAspleniaOrHiv: false, requiresBothPcvAndMenacwyD: false },
          bloodType: '',
          bloodDate: '',
          bloodPostVaccine14d: false,
          isPseudo: [],
          q1_subType: '',
          q2_subType: '',
          q3_subType: '',
          q4_subType: '',
          q7_subType: '',
          q8_subType: '',
          currentLocation: 'home'
      }
  });

  const updateAnswer = (qid: string, val: boolean) => {
      setData(prev => ({ ...prev, answers: { ...prev.answers, [qid]: val } }));
  };

  const toggleDetail = (field: keyof AssessmentData['details'], value: any) => {
      setData(prev => {
          const current = prev.details[field] as any[];
          const updated = current.includes(value) 
              ? current.filter(i => i !== value)
              : [...current, value];
          return { ...prev, details: { ...prev.details, [field]: updated } };
      });
  };

  const report = useMemo(() => generateAssessmentReport(data), [data]);

  return (
      <div className="min-h-screen pb-24 relative bg-slate-50/50">
          <Watermark />
          <ProgressBar step={step} />
          
          <button 
              type="button"
              onClick={() => setShowRef(true)}
              className="fixed top-3 right-4 z-50 flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-blue-100 shadow-sm rounded-full text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-all cursor-pointer print:hidden"
          >
              <BookOpen className="w-4 h-4 text-blue-500" /> 
              <span>临床决策备查表</span>
          </button>

          {showRef && <ReferenceTables onClose={() => setShowRef(false)} />}

          {step === 1 && <Header />}
          
          <main className="px-4 py-6 relative z-10 max-w-4xl mx-auto">
              {step === 1 && <Step1 data={data} setData={setData} toggleDetail={toggleDetail} />}
              {step === 2 && <Step2 data={data} setData={setData} updateAnswer={updateAnswer} toggleDetail={toggleDetail} />}
              {step === 3 && <Step3 data={data} report={report} />}
          </main>

          {/* Bottom Floating Navigation bar */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 no-print safe-area-pb z-50 shadow-lg shadow-slate-100">
              <div className="max-w-2xl mx-auto flex justify-between items-center">
                  <button 
                      type="button"
                      onClick={() => setStep(s => Math.max(1, s-1))}
                      disabled={step === 1}
                      className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                      <ChevronLeft className="w-5 h-5" /> 上一步
                  </button>

                  <div className="text-xs font-bold text-slate-400 font-mono tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                      STEP {step} / 3
                  </div>

                  {step < 3 ? (
                      <button 
                          type="button"
                          onClick={() => setStep(s => Math.min(3, s+1))}
                          disabled={step === 1 && !data.name}
                          className="flex items-center gap-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold shadow-md shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all cursor-pointer"
                      >
                          下一步 <ChevronRight className="w-5 h-5" />
                      </button>
                  ) : (
                      <button 
                          type="button"
                          onClick={() => window.print()}
                          className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-full text-sm font-bold shadow-md transition-all cursor-pointer"
                      >
                          <Printer className="w-5 h-5" /> 生成并打印 PDF
                      </button>
                  )}
              </div>
          </div>
      </div>
  );
};

export default App;
