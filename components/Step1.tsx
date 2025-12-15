import React from 'react';
import { AssessmentData } from '../types';
import { PSEUDO_CONTRAINDICATIONS } from '../constants';

interface Step1Props {
  data: AssessmentData;
  setData: React.Dispatch<React.SetStateAction<AssessmentData>>;
  toggleDetail: (field: keyof AssessmentData['details'], value: any) => void;
}

const Step1: React.FC<Step1Props> = ({ data, setData, toggleDetail }) => {
  return (
      <div className="max-w-md mx-auto slide-up">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
              <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 ml-1">儿童姓名</label>
                  <input 
                      type="text" 
                      value={data.name}
                      onChange={e => setData(prev => ({...prev, name: e.target.value}))}
                      className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="输入姓名 (支持汉字)"
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 ml-1">性别</label>
                      <div className="flex bg-slate-50 p-1 rounded-xl">
                          {(['male', 'female'] as const).map(g => (
                              <button 
                                  key={g}
                                  onClick={() => setData(prev => ({...prev, gender: g}))}
                                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${data.gender === g ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                              >
                                  {g === 'male' ? '男' : '女'}
                              </button>
                          ))}
                      </div>
                  </div>
                  <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 ml-1">年龄</label>
                      <div className="flex gap-2">
                          <input 
                              type="number" 
                              value={data.age}
                              onChange={e => setData(prev => ({...prev, age: e.target.value}))}
                              className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="0"
                          />
                          <select 
                              value={data.ageUnit}
                              onChange={e => setData(prev => ({...prev, ageUnit: e.target.value as any}))}
                              className="bg-slate-50 border-0 rounded-xl px-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          >
                              <option value="years">岁</option>
                              <option value="months">月</option>
                          </select>
                      </div>
                  </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-3 ml-1 uppercase tracking-wider font-semibold">快速排除 (假性禁忌)</p>
                  <div className="flex flex-wrap gap-2">
                      {PSEUDO_CONTRAINDICATIONS.map((item, idx) => (
                          <button 
                              key={idx}
                              onClick={() => toggleDetail('isPseudo', idx)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                  data.details.isPseudo.includes(idx) 
                                  ? 'bg-green-50 border-green-200 text-green-700' 
                                  : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'
                              }`}
                          >
                              {item}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  );
};

export default Step1;