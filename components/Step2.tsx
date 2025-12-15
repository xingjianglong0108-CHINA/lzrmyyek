import React from 'react';
import { AssessmentData } from '../types';
import { QUESTIONS, ANTIBODY_DATA } from '../constants';

interface Step2Props {
  data: AssessmentData;
  setData: React.Dispatch<React.SetStateAction<AssessmentData>>;
  updateAnswer: (qid: string, val: boolean) => void;
  toggleDetail: (field: keyof AssessmentData['details'], value: any) => void;
}

const Step2: React.FC<Step2Props> = ({ data, setData, updateAnswer, toggleDetail }) => {
  return (
      <div className="max-w-xl mx-auto space-y-4 slide-up">
          {QUESTIONS.map(q => (
              <div key={q.id} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all duration-300 ${data.answers[q.id] ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
                  <div className="flex justify-between items-center">
                      <div>
                          <h3 className="font-medium text-slate-800">{q.label}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{q.sub}</p>
                      </div>
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                          <button 
                              onClick={() => updateAnswer(q.id, true)}
                              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${data.answers[q.id] === true ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400'}`}
                          >是</button>
                          <button 
                              onClick={() => updateAnswer(q.id, false)}
                              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${data.answers[q.id] === false ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400'}`}
                          >否</button>
                      </div>
                  </div>

                  {data.answers[q.id] && (
                      <div className="mt-4 pt-4 border-t border-slate-200/50 animate-fade-in">
                          {q.id === 'blood' && (
                              <div className="grid grid-cols-1 gap-3">
                                  <select 
                                      className="w-full text-sm p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-400 transition-colors"
                                      onChange={e => setData(prev => ({...prev, details: {...prev.details, bloodType: e.target.value}}))}
                                      value={data.details.bloodType}
                                  >
                                      <option value="">选择制品类型...</option>
                                      {Object.entries(ANTIBODY_DATA).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                                  </select>
                                  <input 
                                      type="date" 
                                      className="w-full text-sm p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-400 transition-colors"
                                      onChange={e => setData(prev => ({...prev, details: {...prev.details, bloodDate: e.target.value}}))}
                                      value={data.details.bloodDate}
                                  />
                              </div>
                          )}
                          {q.id === 'immune' && (
                              <div className="flex flex-wrap gap-2">
                                  {[
                                      { key: 'hiv', label: 'HIV感染' },
                                      { key: 'asplenia', label: '无脾/脾切除' },
                                      { key: 'chemo', label: '化疗/放疗' }
                                  ].map(({ key, label }) => (
                                      <button 
                                          key={key}
                                          onClick={() => toggleDetail('immuneTypes', key)}
                                          className={`px-3 py-1 rounded-lg text-xs border ${data.details.immuneTypes.includes(key) ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-200'}`}
                                      >
                                          {label}
                                      </button>
                                  ))}
                              </div>
                          )}
                          {!['blood', 'immune'].includes(q.id) && (
                              <p className="text-xs text-amber-700 bg-amber-100/50 p-2 rounded">
                                  ⚠️ 此项阳性可能需要医疗干预或推迟接种。
                              </p>
                          )}
                      </div>
                  )}
              </div>
          ))}
      </div>
  );
};

export default Step2;