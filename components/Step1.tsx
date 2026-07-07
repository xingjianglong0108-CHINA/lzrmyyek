import React from 'react';
import { AssessmentData } from '../types';
import { PSEUDO_CONTRAINDICATIONS } from '../constants';
import { ShieldAlert, Baby, Weight, Home, Calendar, Droplets, Heart, AlertTriangle, HelpCircle, Info } from 'lucide-react';

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

        {/* 临床体重与胎龄录入指引 */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 text-xs text-slate-700 space-y-2.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Info className="w-4 h-4 text-blue-500 shrink-0" />
            临床参数录入指引 (何时需要填写以下参数？)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed text-slate-600">
            <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 block mb-1">1. 出生胎龄 (周)</span>
                <span className="text-blue-600 font-medium block mb-1">何时填写：早产儿 (&lt; 37周) 必填。</span>
                主要用于评估<strong>卡介苗 (BCG)</strong>接种时机。以 31 周为界判定早产儿是否需在出院前重新评估。
              </div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 block mb-1">2. 出生体重 (克)</span>
                <span className="text-blue-600 font-medium block mb-1">何时填写：低体重儿 (&lt; 2500g) 必填。</span>
                主要用于计算<strong>首剂乙肝疫苗</strong>程序：体重 &lt; 2000g 者首剂不计入3剂次程序，需按4剂次方案接种。
              </div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 block mb-1">3. 当前体重 (公斤)</span>
                <span className="text-blue-600 font-medium block mb-1">何时填写：接受糖皮质激素治疗者必填。</span>
                用于精确计算每日每公斤体重剂量，判定是否达到大剂量激素标准（&ge; 2 mg/kg/天且连续 &ge; 14 天）。
              </div>
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
            <p className="text-[10px] text-slate-400 pl-1 leading-normal mt-1">
              * 适用于早产儿评估BCG时机
            </p>
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
            <p className="text-[10px] text-slate-400 pl-1 leading-normal mt-1">
              * 适用于低体重儿乙肝首剂分流
            </p>
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
            <p className="text-[10px] text-slate-400 pl-1 leading-normal mt-1">
              * 服用激素患儿精准算药
            </p>
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
            <p className="text-[10px] text-slate-400 pl-1 leading-normal mt-1">
              * 决定住院期隔离接种策略
            </p>
          </div>
        </div>

        {/* 2026年中国指南特色专题：黄疸、母亲乙肝、HIV暴露筛查 */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-blue-500 animate-pulse" /> 2026中国指南重点临床筛查项目
            </h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-semibold border border-blue-100/50">
              中国指南核心筛查指引
            </span>
          </div>

          {/* 重点筛查项目触发与选择条件提示卡片 */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-xs text-amber-950 space-y-2 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              重点项目选择条件 (满足以下何种条件时，必须在此进行选择？)
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
              <li><strong>母亲 HBsAg 表面抗原状态：</strong>适用于所有新生儿（尤其是出生 24 小时或 1 个月内）。只要存在乙肝抗体状态判定，必选该项用以指导是否联用 <strong>HBIG 免疫球蛋白</strong>及对低体重早产儿执行首剂后的 4 剂次重补程序。</li>
              <li><strong>新生儿黄疸状况：</strong>适用于生后 28 天内新生儿，或处于黄疸未完全消退期的患儿。用于临床排除“进行性加重或不稳定性黄疸”这一急性暂缓指征，凡生理性、母乳性或稳定高胆红素血症均非禁忌。</li>
              <li><strong>HIV 感染母亲所生儿童状态：</strong>适用于母亲确认感染 HIV 或婴儿处于 HIV 阳性暴露状态者。用于极其精细地执行脊灰减毒活疫苗（bOPV）与卡介苗（BCG）等强力活疫苗的临床安全隔离避险决策。</li>
            </ul>
          </div>

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
              <p className="text-[10px] text-slate-400 pl-1 leading-normal">
                * <strong>适用场景：</strong>所有未满 1 月龄的新生儿接种评估
              </p>
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
              <p className="text-[10px] text-slate-400 pl-1 leading-normal">
                * <strong>适用场景：</strong>生后 28 天内或仍存在黄疸的患儿
              </p>
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
            <p className="text-[10px] text-slate-400 pl-1 leading-normal">
              * <strong>适用场景：</strong>母亲为 HIV 阳性或有 HIV 暴露高危史的患儿。2026年指南明确：卡介苗暂缓，严控减毒活疫苗。
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
