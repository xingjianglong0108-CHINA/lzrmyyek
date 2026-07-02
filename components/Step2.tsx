import React from 'react';
import { AssessmentData } from '../types';
import { QUESTIONS, ANTIBODY_DATA } from '../constants';
import { AlertCircle, HelpCircle, Activity, ShieldAlert, Check, PlusCircle } from 'lucide-react';

interface Step2Props {
  data: AssessmentData;
  setData: React.Dispatch<React.SetStateAction<AssessmentData>>;
  updateAnswer: (qid: string, val: boolean) => void;
  toggleDetail: (field: keyof AssessmentData['details'], value: any) => void;
}

const Step2: React.FC<Step2Props> = ({ data, setData, updateAnswer, toggleDetail }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 slide-up">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 space-y-1">
          <p className="font-semibold">第二阶段：临床接种前置筛查 (16 标准化规则)</p>
          <p className="text-xs text-blue-600 leading-relaxed">
            请逐一评估以下 16 项临床筛查问询。如某项为“是”，请进一步点选或输入精确的临床分支参数，决策引擎将基于 ACIP 和最新中国临床共识进行深度多条件联合计算。
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {QUESTIONS.map(q => {
          const answeredYes = data.answers[q.id] === true;
          const answeredNo = data.answers[q.id] === false;

          return (
            <div 
              key={q.id} 
              className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 ${
                answeredYes 
                  ? 'border-blue-200 bg-blue-50/10 shadow-md shadow-blue-50/50' 
                  : answeredNo 
                    ? 'border-slate-100 opacity-90' 
                    : 'border-slate-200 shadow-sm'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    {answeredYes && <PlusCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                    {q.label}
                  </h3>
                  <p className="text-xs text-slate-500">{q.sub}</p>
                </div>
                
                {/* Yes / No Buttons */}
                <div className="flex bg-slate-100 p-1 rounded-xl w-fit self-start shrink-0">
                  <button 
                    type="button"
                    onClick={() => updateAnswer(q.id, true)}
                    className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      answeredYes 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    是 (Yes)
                  </button>
                  <button 
                    type="button"
                    onClick={() => updateAnswer(q.id, false)}
                    className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      answeredNo 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    否 (No)
                  </button>
                </div>
              </div>

              {/* Collapsible Details Panel when Answered Yes */}
              {answeredYes && (
                <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 animate-slide-up">
                  
                  {/* q1_acute_illness sub-type */}
                  {q.id === 'q1_acute_illness' && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">请选择今日急性疾病的临床严重程度分级：</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${data.details.q1_subType === 'severe' ? 'bg-amber-50/50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                          <input 
                            type="radio" 
                            name="q1_subType" 
                            value="severe"
                            checked={data.details.q1_subType === 'severe'}
                            onChange={() => setData(prev => ({ ...prev, details: { ...prev.details, q1_subType: 'severe' }}))}
                            className="mt-1 text-amber-600 focus:ring-amber-500"
                          />
                          <div>
                            <p className="text-xs font-semibold">中重度急性疾病 (发热或不伴发热)</p>
                            <p className="text-[10px] opacity-80 mt-0.5">如高烧、精神委靡、严重咳嗽或剧烈腹泻。</p>
                          </div>
                        </label>
                        
                        <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${data.details.q1_subType === 'mild' ? 'bg-emerald-50/30 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                          <input 
                            type="radio" 
                            name="q1_subType" 
                            value="mild"
                            checked={data.details.q1_subType === 'mild'}
                            onChange={() => setData(prev => ({ ...prev, details: { ...prev.details, q1_subType: 'mild' }}))}
                            className="mt-1 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <p className="text-xs font-semibold">轻微疾病/不伴发热</p>
                            <p className="text-[10px] opacity-80 mt-0.5">如轻度流涕、打喷嚏、无发热的中耳炎或精神完好的轻微腹泻。</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* q2_severe_allergies sub-type */}
                  {q.id === 'q2_severe_allergies' && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">请选择过敏反应的类型与严重程度：</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${data.details.q2_subType === 'severe' ? 'bg-red-50/50 border-red-300 text-red-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                          <input 
                            type="radio" 
                            name="q2_subType" 
                            value="severe"
                            checked={data.details.q2_subType === 'severe'}
                            onChange={() => setData(prev => ({ ...prev, details: { ...prev.details, q2_subType: 'severe' }}))}
                            className="mt-1 text-red-600 focus:ring-red-500"
                          />
                          <div>
                            <p className="text-xs font-semibold">特异性组分严重过敏性休克</p>
                            <p className="text-[10px] opacity-80 mt-0.5">确证对疫苗特定抗原/辅料(明胶、酵母、新霉素)或包装胶塞发生过全身性过敏性休克 (Anaphylaxis)。</p>
                          </div>
                        </label>

                        <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${data.details.q2_subType === 'mild' ? 'bg-emerald-50/30 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                          <input 
                            type="radio" 
                            name="q2_subType" 
                            value="mild"
                            checked={data.details.q2_subType === 'mild'}
                            onChange={() => setData(prev => ({ ...prev, details: { ...prev.details, q2_subType: 'mild' }}))}
                            className="mt-1 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <p className="text-xs font-semibold">普通的皮肤湿疹/非重度过敏</p>
                            <p className="text-[10px] opacity-80 mt-0.5">对普通食物（如牛奶、鸡蛋、芒果等）、花粉或不相关药物的非重度过敏，或伴随普通湿疹。</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* q3_past_severe_reaction sub-type */}
                  {q.id === 'q3_past_severe_reaction' && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">请点选历史发生的具体疫苗不良反应表现：</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${data.details.q3_subType === 'anaphylaxis' ? 'bg-red-50/50 border-red-300 text-red-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                          <input 
                            type="radio" 
                            name="q3_subType" 
                            value="anaphylaxis"
                            checked={data.details.q3_subType === 'anaphylaxis'}
                            onChange={() => setData(prev => ({ ...prev, details: { ...prev.details, q3_subType: 'anaphylaxis' }}))}
                            className="mt-1 text-red-600 focus:ring-red-500"
                          />
                          <div>
                            <p className="text-xs font-semibold">接种同款疫苗后发生严重反应</p>
                            <p className="text-[10px] opacity-80 mt-0.5">曾发生全身性过敏性休克、喉头水肿或严重呼吸困难等致命表现。</p>
                          </div>
                        </label>

                        <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${data.details.q3_subType === 'dtap_reaction' ? 'bg-amber-50/50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                          <input 
                            type="radio" 
                            name="q3_subType" 
                            value="dtap_reaction"
                            checked={data.details.q3_subType === 'dtap_reaction'}
                            onChange={() => setData(prev => ({ ...prev, details: { ...prev.details, q3_subType: 'dtap_reaction' }}))}
                            className="mt-1 text-amber-600 focus:ring-amber-500"
                          />
                          <div>
                            <p className="text-xs font-semibold">接种 DTaP (百白破) 后发生非特异性反应</p>
                            <p className="text-[10px] opacity-80 mt-0.5">48小时内高烧 &ge; 40.5℃、持续 &ge; 3小时无法抚慰的哭闹、低张性低反应发作 (HHE) 或 3天内发生惊厥。</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* q4_chronic_diseases sub-type */}
                  {q.id === 'q4_chronic_diseases' && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">请选择具体的慢性病或器官障碍：</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { key: 'asplenia', label: '无脾/解剖或功能性无脾/补体缺陷', desc: '触发强化MenACWY、PCV和Hib重建程序' },
                          { key: 'ckd', label: '慢性肾脏病 (CKD)', desc: '触发高剂量、多倍剂量乙肝接种程序，LAIV绝对禁用' },
                          { key: 'chronic_aspirin', label: '慢性基础病/长期吃阿司匹林', desc: 'LAIV流感活疫苗禁用，必须注射IIV' }
                        ].map(opt => (
                          <label key={opt.key} className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${data.details.q4_subType === opt.key ? 'bg-blue-50/50 border-blue-300 text-blue-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                            <div className="flex items-start gap-2">
                              <input 
                                type="radio" 
                                name="q4_subType" 
                                value={opt.key}
                                checked={data.details.q4_subType === opt.key}
                                onChange={() => setData(prev => ({ ...prev, details: { ...prev.details, q4_subType: opt.key as any }}))}
                                className="mt-1 text-blue-600 focus:ring-blue-500"
                              />
                              <p className="text-xs font-semibold">{opt.label}</p>
                            </div>
                            <p className="text-[9px] opacity-80 mt-1 pl-5">{opt.desc}</p>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* q7_neurological_disorders sub-type */}
                  {q.id === 'q7_neurological_disorders' && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">请点选精确的神经系统病情表现状态：</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { key: 'uncontrolled', label: '进行性或未控制疾病', desc: '进行性、未用药或控制不佳的癫痫、婴儿痉挛症、进行性脑病 (百白破暂缓)' },
                          { key: 'stable', label: '稳定的神经系统状况', desc: '稳定的脑瘫、发育迟缓、用药已良好控制的惊厥 (准予常规接种)' },
                          { key: 'history', label: '惊厥史个人/家族首代史', desc: '惊厥个人史或直系亲属史。在12-47月龄时触发首剂MMRV拆分红线' }
                        ].map(opt => (
                          <label key={opt.key} className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${data.details.q7_subType === opt.key ? 'bg-blue-50/50 border-blue-300 text-blue-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                            <div className="flex items-start gap-2">
                              <input 
                                type="radio" 
                                name="q7_subType" 
                                value={opt.key}
                                checked={data.details.q7_subType === opt.key}
                                onChange={() => setData(prev => ({ ...prev, details: { ...prev.details, q7_subType: opt.key as any }}))}
                                className="mt-1 text-blue-600 focus:ring-blue-500"
                              />
                              <p className="text-xs font-semibold">{opt.label}</p>
                            </div>
                            <p className="text-[9px] opacity-80 mt-1 pl-5">{opt.desc}</p>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* q8_myocarditis_misc sub-type */}
                  {q.id === 'q8_myocarditis_misc' && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700">请确定心肌炎的病因与当前状态：</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${data.details.q8_subType === 'covid_vaccine_3w' ? 'bg-amber-50/50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                          <input 
                            type="radio" 
                            name="q8_subType" 
                            value="covid_vaccine_3w"
                            checked={data.details.q8_subType === 'covid_vaccine_3w'}
                            onChange={() => setData(prev => ({ ...prev, details: { ...prev.details, q8_subType: 'covid_vaccine_3w' } }))}
                            className="mt-1 text-amber-600 focus:ring-amber-500"
                          />
                          <div>
                            <p className="text-xs font-semibold">与疫苗相关或伴随 MIS-C 史</p>
                            <p className="text-[10px] opacity-80 mt-0.5">在前一剂 COVID-19 接种后的 3 周内发生过心肌炎/心包炎，或既往得过新冠引起的多系统炎症综合征。</p>
                          </div>
                        </label>

                        <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${data.details.q8_subType === 'unrelated_recovered' ? 'bg-emerald-50/30 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                          <input 
                            type="radio" 
                            name="q8_subType" 
                            value="unrelated_recovered"
                            checked={data.details.q8_subType === 'unrelated_recovered'}
                            onChange={() => setData(prev => ({ ...prev, details: { ...prev.details, q8_subType: 'unrelated_recovered' } }))}
                            className="mt-1 text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <p className="text-xs font-semibold">与接种无关且已完全康复</p>
                            <p className="text-[10px] opacity-80 mt-0.5">因其他感染或不明原因导致，目前心脏彩超及生化指标已恢复正常并恢复常规活动。</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* q9_immunodeficiency deep evaluation: SOT, HSCT, SCID, Rituximab, Steroids */}
                  {q.id === 'q9_immunodeficiency' && (
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <ShieldAlert className="w-4 h-4 text-blue-600" />
                        <h4 className="text-xs font-bold text-slate-800">深度病理分支分流评估 (Branch A & B)</h4>
                      </div>
                      
                      <p className="text-[10px] text-slate-500">点选以下患儿具体被诊断或正处于的特定高危临床状态：</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { key: 'scid', label: 'SCID / T 细胞缺陷 (严重免疫缺陷)' },
                          { key: 'rituximab', label: '抗 CD20 单抗治疗 (如利妥昔单抗)' },
                          { key: 'steroids', label: '全身服用糖皮质激素治疗' },
                          { key: 'sot', label: '实体器官移植 (SOT) 患者' },
                          { key: 'hsct', label: '造血干细胞移植 (HSCT) 患者' }
                        ].map(opt => {
                          const active = data.details.immuneTypes.includes(opt.key);
                          return (
                            <button 
                              key={opt.key}
                              type="button"
                              onClick={() => toggleDetail('immuneTypes', opt.key)}
                              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1 transition-all ${active ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600'}`}
                            >
                              {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Expanded Sub-forms based on active immune types */}
                      
                      {/* Steroids Form */}
                      {data.details.immuneTypes.includes('steroids') && (
                        <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-3 animate-slide-up">
                          <p className="text-xs font-bold text-blue-800">1. 糖皮质激素分层计算器 (Steroid Stratification)</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500">每日激素剂量 (Prednisone等同量)</label>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  value={data.details.steroid.dose}
                                  onChange={e => setData(prev => ({ ...prev, details: { ...prev.details, steroid: { ...prev.details.steroid, dose: e.target.value } } }))}
                                  className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white"
                                  placeholder="如: 25"
                                  min="0"
                                />
                                <span className="absolute right-3 top-2 text-[10px] text-slate-400">mg/day</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500">连续应用时长 (Duration)</label>
                              <div className="relative">
                                <input 
                                  type="number" 
                                  value={data.details.steroid.duration}
                                  onChange={e => setData(prev => ({ ...prev, details: { ...prev.details, steroid: { ...prev.details.steroid, duration: e.target.value } } }))}
                                  className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white"
                                  placeholder="如: 15"
                                  min="0"
                                />
                                <span className="absolute right-3 top-2 text-[10px] text-slate-400">天 (Days)</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-400 leading-normal">
                            * 注：大剂量定义为 剂量 &ge; 2.0 mg/kg/天 或 体重 &gt; 10kg 且每日剂量 &ge; 20 mg，且持续 &ge; 14 天。未达指标者在停药后即可接种活疫苗。
                          </p>
                        </div>
                      )}

                      {/* SOT Form */}
                      {data.details.immuneTypes.includes('sot') && (
                        <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-3 animate-slide-up">
                          <p className="text-xs font-bold text-blue-800">2. 实体器官移植临床时限 (SOT Timeline Phase)</p>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500">当前所处移植时限：</label>
                            <select 
                              value={data.details.sot.phase}
                              onChange={e => setData(prev => ({ ...prev, details: { ...prev.details, sot: { ...prev.details.sot, phase: e.target.value as any } } }))}
                              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-400 transition-colors"
                            >
                              <option value="">选择移植阶段时限...</option>
                              <option value="candidate">移植前候选阶段 (SOT Candidates) - 抢在术前打齐</option>
                              <option value="early">移植后早期 (0~2 个月) - 大剂量抗排异诱导期，全绝对禁忌</option>
                              <option value="maintenance">移植后维持期 (2~6 个月起) - 逐步回复死针，禁止活针</option>
                            </select>
                          </div>
                          
                          {data.details.sot.phase === 'maintenance' && (
                            <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer text-xs select-none border border-slate-100">
                              <input 
                                type="checkbox" 
                                checked={data.details.sot.hbsabLessThan10}
                                onChange={e => setData(prev => ({ ...prev, details: { ...prev.details, sot: { ...prev.details.sot, hbsabLessThan10: e.target.checked } } }))}
                                className="rounded text-blue-600"
                              />
                              <div>
                                <span className="font-semibold text-slate-700">常规复查 HBsAb 滴度 &lt; 10 mIU/mL ?</span>
                                <span className="block text-[9px] text-slate-400">若阳性，需强制执行双倍高剂量（40 mcg）乙肝强化疫苗程序。</span>
                              </div>
                            </label>
                          )}
                        </div>
                      )}

                      {/* HSCT Form */}
                      {data.details.immuneTypes.includes('hsct') && (
                        <div className="bg-white p-4 rounded-xl border border-blue-100 space-y-3 animate-slide-up">
                          <p className="text-xs font-bold text-blue-800">3. 造血干细胞移植重建评估器 (HSCT Immune Reconstitution)</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500">患者临床移植阶段：</label>
                              <select 
                                value={data.details.hsct.phase}
                                onChange={e => setData(prev => ({ ...prev, details: { ...prev.details, hsct: { ...prev.details.hsct, phase: e.target.value as any } } }))}
                                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-400 transition-colors"
                              >
                                <option value="">选择阶段...</option>
                                <option value="donor">干细胞供体 (Donor) - 规范术前接种</option>
                                <option value="rebuilding">接受移植后重建阶段 (Recipient) - 重打全套</option>
                              </select>
                            </div>
                            
                            {data.details.hsct.phase === 'rebuilding' && (
                              <div className="space-y-1 animate-fade-in">
                                <label className="text-[10px] font-bold text-slate-500">移植手术后时间 (Rebuilding Months)</label>
                                <div className="relative">
                                  <input 
                                    type="number" 
                                    value={data.details.hsct.rebuildMonths}
                                    onChange={e => setData(prev => ({ ...prev, details: { ...prev.details, hsct: { ...prev.details.hsct, rebuildMonths: e.target.value } } }))}
                                    className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white"
                                    placeholder="如: 18"
                                    min="0"
                                  />
                                  <span className="absolute right-3 top-2 text-[10px] text-slate-400">个月 (Months)</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {data.details.hsct.phase === 'rebuilding' && (
                            <div className="space-y-3 animate-fade-in pt-2 border-t border-slate-100">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500">移植物抗宿主病 (GVHD) 临床状态：</label>
                                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 w-fit">
                                  {[
                                    { key: 'none', label: '无 GVHD / 稳定' },
                                    { key: 'chronic', label: '伴有慢性 GVHD (多糖疫苗禁用)' }
                                  ].map(item => (
                                    <button 
                                      key={item.key}
                                      type="button"
                                      onClick={() => setData(prev => ({ ...prev, details: { ...prev.details, hsct: { ...prev.details.hsct, hasGVHD: item.key as any } } }))}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${data.details.hsct.hasGVHD === item.key ? 'bg-white shadow-sm text-blue-600 border border-slate-100' : 'text-slate-400'}`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500">减毒活疫苗 (MMR/VAR) 重建必须检验临床硬指标 (3个必须全部勾选)：</label>
                                <div className="space-y-1.5">
                                  {[
                                    { key: 'immunosuppressantsStopped3m', label: '系统性免疫抑制剂、抗 GVHD 治疗及肿瘤维持化疗已完全停用 >= 3个月' },
                                    { key: 'noActiveGVHD', label: '临床评估完全无任何活动性的急性或慢性 GVHD' },
                                    { key: 'bCellRecoveredIvigStopped3m', label: 'B 细胞功能已确认完全恢复，且停止使用静脉丙球 (IVIG) 替代疗法 >= 3个月' }
                                  ].map(item => (
                                    <label key={item.key} className="flex items-start gap-2 p-2 bg-slate-50 hover:bg-slate-100/50 rounded-lg cursor-pointer text-xs select-none">
                                      <input 
                                        type="checkbox" 
                                        checked={(data.details.hsct.clinicalConditions as any)[item.key]}
                                        onChange={e => setData(prev => ({
                                          ...prev,
                                          details: {
                                            ...prev.details,
                                            hsct: {
                                              ...prev.details.hsct,
                                              clinicalConditions: {
                                                ...prev.details.hsct.clinicalConditions,
                                                [item.key]: e.target.checked
                                              }
                                            }
                                          }
                                        }))}
                                        className="rounded text-blue-600 mt-0.5"
                                      />
                                      <span className="text-slate-600 font-medium leading-normal">{item.label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* q12_blood_products_antivirals sub-type dropdown and details */}
                  {q.id === 'q12_blood_products_antivirals' && (
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Activity className="w-4 h-4 text-blue-500" />
                        血液制品及抗体暴露安全洗脱计算 (Branch G)
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">输注/暴露的血液制品类型：</label>
                          <select 
                            className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-400 transition-colors font-medium text-slate-700"
                            onChange={e => setData(prev => ({...prev, details: {...prev.details, bloodType: e.target.value}}))}
                            value={data.details.bloodType}
                          >
                            <option value="">选择制品类型...</option>
                            {Object.entries(ANTIBODY_DATA).map(([k, v]) => (
                              <option key={k} value={k}>{v.name} (洗脱期: {v.wait}月)</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">输注/输入日期：</label>
                          <input 
                            type="date" 
                            className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-400 transition-colors text-slate-700"
                            onChange={e => setData(prev => ({...prev, details: {...prev.details, bloodDate: e.target.value}}))}
                            value={data.details.bloodDate}
                          />
                        </div>
                      </div>

                      <label className="flex items-start gap-2 p-2 bg-white rounded-lg cursor-pointer text-xs select-none border border-slate-200">
                        <input 
                          type="checkbox" 
                          checked={data.details.bloodPostVaccine14d}
                          onChange={e => setData(prev => ({ ...prev, details: { ...prev.details, bloodPostVaccine14d: e.target.checked } }))}
                          className="rounded text-blue-600 mt-0.5"
                        />
                        <div>
                          <span className="font-semibold text-slate-700">是否是在接种 MMR/VAR (麻腮风/水痘) 疫苗后 14 天内被迫输注了上述制品的？</span>
                          <span className="block text-[9px] text-red-500">※ 注意：如果是，意味着该次 MMR/VAR 活疫苗接种被判定为【无效接种】，必须在安全洗脱期满后完全重新补种！</span>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* General feedback notice if not special custom handled */}
                  {!['q1_acute_illness', 'q2_severe_allergies', 'q3_past_severe_reaction', 'q4_chronic_diseases', 'q7_neurological_disorders', 'q8_myocarditis_misc', 'q9_immunodeficiency', 'q12_blood_products_antivirals'].includes(q.id) && (
                    <div className="flex gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-700 leading-relaxed">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        此项阳性可能将触发特异的局部接种限制，例如：
                        {q.id === 'q5_wheezing_asthma_12m' && <span className="font-bold">「2-4岁过去12个月内有哮喘，喷鼻流感活疫苗(LAIV)绝对禁用」</span>}
                        {q.id === 'q6_intussusception' && <span className="font-bold">「既往肠套叠，口服轮状病毒疫苗(RV)属于永久绝对禁忌」</span>}
                        {q.id === 'q10_immunosuppressants_chemo' && <span className="font-bold">「化疗/放疗期间绝对禁用一切活疫苗。需化疗结束至少3个月后医生评估才能接种」</span>}
                        {q.id === 'q11_family_immunodeficiency' && <span className="font-bold">「直系家族免疫缺陷，卡介苗/轮状/麻腮风/水痘暂缓，必须先完成TREC或基因筛查」</span>}
                        {q.id === 'q13_pregnancy' && <span className="font-bold">「孕期绝对禁用一切活疫苗，且不推荐HPV接种；接种活疫苗后应避孕1个月」</span>}
                        {q.id === 'q14_recent_vaccines_4w' && <span className="font-bold">「注射型活疫苗若非同天注射，强制间隔28天以上」</span>}
                        {q.id === 'q15_syncope_history' && <span className="font-bold">「晕针史非禁忌，启动临床体位保护与强制留观15分钟护理」</span>}
                        {q.id === 'q16_anxiety' && <span className="font-bold">「接种焦虑非禁忌，启动无痛/非药物触觉分心舒缓接种护理」</span>}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step2;
