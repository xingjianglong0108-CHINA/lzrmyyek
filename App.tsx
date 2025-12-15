import React, { useState, useMemo } from 'react';
import { AssessmentData } from './types';
import { generateAssessmentReport } from './utils';
import ProgressBar from './components/ProgressBar';
import Header from './components/Header';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import { ChevronLeft, ChevronRight, Printer } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AssessmentData>({
      name: '', 
      gender: 'male', 
      age: '', 
      ageUnit: 'years',
      answers: {}, 
      details: {
          immuneTypes: [],
          bloodType: '',
          bloodDate: '',
          isPseudo: []
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
      <div className="min-h-screen pb-24">
          <ProgressBar step={step} />
          {step === 1 && <Header />}
          
          <main className="px-4 py-6">
              {step === 1 && <Step1 data={data} setData={setData} toggleDetail={toggleDetail} />}
              {step === 2 && <Step2 data={data} setData={setData} updateAnswer={updateAnswer} toggleDetail={toggleDetail} />}
              {step === 3 && <Step3 data={data} report={report} />}
          </main>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 no-print safe-area-pb z-40">
              <div className="max-w-2xl mx-auto flex justify-between items-center">
                  <button 
                      onClick={() => setStep(s => Math.max(1, s-1))}
                      disabled={step === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                      <ChevronLeft className="w-5 h-5" /> 上一步
                  </button>

                  <div className="text-xs font-medium text-slate-400">
                      {step} / 3
                  </div>

                  {step < 3 ? (
                      <button 
                          onClick={() => setStep(s => Math.min(3, s+1))}
                          disabled={step === 1 && !data.name}
                          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all"
                      >
                          下一步 <ChevronRight className="w-5 h-5" />
                      </button>
                  ) : (
                      <button 
                          onClick={() => window.print()}
                          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-full text-sm font-medium shadow-lg transition-all"
                      >
                          <Printer className="w-5 h-5" /> 生成 PDF
                      </button>
                  )}
              </div>
          </div>
      </div>
  );
};

export default App;