import React from 'react';
import { AssessmentData } from '../types';
import { PSEUDO_CONTRAINDICATIONS } from '../constants';
import { ShieldAlert, Baby, Weight, Home } from 'lucide-react';

interface Step1Props {
  data: AssessmentData;
  setData: React.Dispatch<React.SetStateAction<AssessmentData>>;
  toggleDetail: (field: keyof AssessmentData['details'], value: any) => void;
}

const Step1: React.FC<Step1Props> = ({ data, setData, toggleDetail }) => {
  return (
    <div className="max-w-xl mx-auto slide-up space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Baby className="w-5 h-5 text-blue-500" /> 第一阶段：儿童基础档案
        </h2>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700 ml-1">儿童姓名</label>
          <input 
            type="text" 
            value={data.name}
            onChange={e => setData(prev => ({...prev, name: e.target.value}))}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="输入姓名 (支持汉字)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1">性别</label>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              {(['male', 'female'] as const).map(g => (
                <button 
                  key={g}
                  type="button"
                  onClick={() => setData(prev => ({...prev, gender: g}))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${data.gender === g ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-400'}`}
                >
                  {g === 'male' ? '男 (Male)' : '女 (Female)'}
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
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                placeholder="0"
                min="0"
              />
              <select 
                value={data.ageUnit}
                onChange={e => setData(prev => ({...prev, ageUnit: e.target.value as any}))}
                className="bg-slate-50 border border-slate-100 rounded-xl px-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-slate-600"
              >
                <option value="years">岁 (Years)</option>
                <option value="months">月 (Months)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1 flex items-center gap-1">
              <Weight className="w-4 h-4 text-slate-400" /> 体重 (用于大剂量激素计算)
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={data.details.steroid.weight}
                onChange={e => setData(prev => ({
                  ...prev,
                  details: {
                    ...prev.details,
                    steroid: { ...prev.details.steroid, weight: e.target.value }
                  }
                }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-10 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                placeholder="例如: 12"
                min="0"
                step="0.1"
              />
              <span className="absolute right-3 top-3.5 text-slate-400 text-sm font-medium">kg</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 ml-1 flex items-center gap-1">
              <Home className="w-4 h-4 text-slate-400" /> 当前所处环境 (早产儿硬红线)
            </label>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              {(['home', 'nicu'] as const).map(loc => (
                <button 
                  key={loc}
                  type="button"
                  onClick={() => setData(prev => ({
                    ...prev,
                    details: { ...prev.details, currentLocation: loc }
                  }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${data.details.currentLocation === loc ? 'bg-white shadow-sm text-blue-600 font-semibold border border-slate-100' : 'text-slate-400'}`}
                >
                  {loc === 'nicu' ? '住院 (NICU)' : '家中 (Home)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3 ml-1">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">快速排除 (临床假性接种禁忌)</p>
          </div>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            注意：以下情况在临床上常被误判为禁忌症。程序已内置逻辑，选中这些项不会触发警告，以便帮助临床医生进行教育与沟通：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PSEUDO_CONTRAINDICATIONS.map((item, idx) => {
              const selected = data.details.isPseudo.includes(idx);
              return (
                <button 
                  key={idx}
                  type="button"
                  onClick={() => toggleDetail('isPseudo', idx)}
                  className={`flex items-center text-left px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    selected 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 shrink-0 ${selected ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span className="truncate">{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
