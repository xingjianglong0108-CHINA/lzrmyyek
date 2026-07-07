import React from 'react';
import { AssessmentData } from '../types';
import { PSEUDO_CONTRAINDICATIONS } from '../constants';
import { ShieldAlert, Baby, Weight, Home, Calendar, Droplets, Heart, AlertTriangle } from 'lucide-react';

interface Step1Props {
  data: AssessmentData;
  setData: React.Dispatch<React.SetStateAction<AssessmentData>>;
  toggleDetail: (field: keyof AssessmentData['details'], value: any) => void;
}

const Step1: React.FC<Step1Props> = ({ data, setData, toggleDetail }) => {
  return (
    <div className="max-w-2xl mx-auto slide-up space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Baby className="w-5 h-5 text-blue-500" /> 第一阶段：儿童临床基础档案
        </h2>

        {/* 基础名字、性别、年龄 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1">儿童姓名</label>
            <input 
              type="text" 
              value={data.name}
              onChange={e => setData(prev => ({...prev, name: e.target.value}))}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="输入姓名 (如：张小宝)"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1">性别</label>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
              {(['male', 'female'] as const).map(g => (
                <button 
                  key={g}
                  type="button"
                  onClick={() => setData(prev => ({...prev, gender: g}))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${data.gender === g ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-400'}`}
                >
                  {g === 'male' ? '男 (Male)' : '女 (Female)'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1">年龄</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={data.age}
                onChange={e => setData(prev => ({...prev, age: e.target.value}))}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0"
                min="0"
              />
              <select 
                value={data.ageUnit}
                onChange={e => setData(prev => ({...prev, ageUnit: e.target.value as any}))}
                className="bg-slate-50 border border-slate-100 rounded-xl px-2 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-semibold text-slate-600"
              >
                <option value="years">岁 (Years)</option>
                <option value="months">月 (Months)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 胎龄、出生体重、当前体重、所处环境 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> 出生胎龄
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={data.details.gestationalAge}
                onChange={e => setData(prev => ({
                  ...prev,
                  details: { ...prev.details, gestationalAge: e.target.value }
                }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-3 pr-8 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="如: 35"
                min="0"
              />
              <span className="absolute right-3 top-3 text-slate-400 text-xs font-medium">周</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1 flex items-center gap-1">
              <Weight className="w-3.5 h-3.5 text-slate-400" /> 出生体重
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={data.details.birthWeight}
                onChange={e => setData(prev => ({
                  ...prev,
                  details: { ...prev.details, birthWeight: e.target.value }
                }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-3 pr-8 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="如: 1800"
                min="0"
              />
              <span className="absolute right-3 top-3 text-slate-400 text-xs font-medium">g</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1 flex items-center gap-1">
              <Weight className="w-3.5 h-3.5 text-slate-400" /> 当前体重
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
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-3 pr-8 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="如: 10"
                min="0"
                step="0.1"
              />
              <span className="absolute right-3 top-3 text-slate-400 text-xs font-medium">kg</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-slate-400" /> 所处医疗环境
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
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${data.details.currentLocation === loc ? 'bg-white shadow-sm text-blue-600 font-bold border border-slate-100' : 'text-slate-400'}`}
                >
                  {loc === 'nicu' ? '住院 (NICU)' : '家中'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2026年中国指南特色专题：黄疸、母亲乙肝、HIV暴露筛查 */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-blue-500 animate-pulse" /> 2026中国指南重点临床筛查项目
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 母亲乙肝 HBsAg 状态 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" /> 母亲 HBsAg 表面抗原状态
              </label>
              <select
                value={data.details.motherHbsag}
                onChange={e => setData(prev => ({
                  ...prev,
                  details: { ...prev.details, motherHbsag: e.target.value as any }
                }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- 选择母亲乙肝状况 --</option>
                <option value="negative">阴性 (Negative) - 正常出生24h内打第1针</option>
                <option value="positive">阳性 (Positive) - 触发HBIG联合免疫与4剂方案</option>
                <option value="unknown">不详 (Unknown) - 触发HBIG联合免疫与4剂方案</option>
              </select>
            </div>

            {/* 黄疸状态 */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> 新生儿黄疸状况
              </label>
              <select
                value={data.details.jaundiceStatus}
                onChange={e => setData(prev => ({
                  ...prev,
                  details: { ...prev.details, jaundiceStatus: e.target.value as any }
                }))}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- 无黄疸 (正常状况) --</option>
                <option value="physiological">生理性黄疸 (正常接种，不暂缓)</option>
                <option value="breastmilk">母乳性黄疸 (正常接种，不暂缓)</option>
                <option value="stable_high_bilirubin">稳定的高胆红素血症/胆汁淤积症 (准予接种)</option>
                <option value="unstable">不稳定性黄疸 / 进行性加重 (必须暂缓)</option>
              </select>
            </div>
          </div>

          {/* HIV 母亲所生儿童状态（带精细分流说明） */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> HIV 感染母亲所生儿童状态
            </label>
            <select
              value={data.details.hivStatus}
              onChange={e => setData(prev => ({
                ...prev,
                details: { ...prev.details, hivStatus: e.target.value as any }
              }))}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- 非 HIV 感染母亲所生儿童 (常规接种) --</option>
              <option value="uninfected">已排除 HIV 感染 (准予接种所有疫苗，立刻补种卡介苗)</option>
              <option value="infected_no_symptoms">确诊 HIV 感染 & 无严重免疫抑制 (禁用BCG、bOPV等，允许接种MMR、IPV等)</option>
              <option value="infected_symptoms">确诊 HIV 感染 & 伴严重免疫抑制/有症状 (禁用BCG、bOPV、MMR等，允许接种IPV、百白破等)</option>
              <option value="unknown_no_symptoms">HIV 暴露且感染状况未明 & 无严重免疫抑制 (卡介苗暂缓，禁用bOPV等，允许接种MMR、IPV等)</option>
              <option value="unknown_symptoms">HIV 暴露且感染状况未明 & 伴严重免疫抑制/有症状 (卡介苗暂缓，禁用bOPV、MMR等，允许接种IPV等)</option>
            </select>
            <p className="text-[10px] text-slate-400 pl-1 leading-relaxed">
              * 2026中国指南硬红线：HIV 母亲所生儿童在确诊感染、状态不详、免疫重建阶段，减毒活疫苗接种限制极为精细，推荐参考系统自动生成的个性化处方决策。
            </p>
          </div>
        </div>

        {/* 快速排除 */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2 ml-1">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">快速排除 (临床假性接种禁忌)</p>
          </div>
          <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
            注意：以下情况在临床上常被误判为禁忌症。2026版中国指南强调，只要病情稳定，以下均非禁忌。选中这些项不会触发警告，以便帮助临床医生进行家长宣教：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PSEUDO_CONTRAINDICATIONS.map((item, idx) => {
              const selected = data.details.isPseudo.includes(idx);
              return (
                <button 
                  key={idx}
                  type="button"
                  onClick={() => toggleDetail('isPseudo', idx)}
                  className={`flex items-center text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selected 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm font-bold' 
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
