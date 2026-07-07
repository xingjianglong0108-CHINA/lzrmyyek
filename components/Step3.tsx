import React from 'react';
import { AssessmentData, Report } from '../types';
import { PSEUDO_CONTRAINDICATIONS } from '../constants';
import { Shield, CheckCircle2, AlertTriangle, HelpCircle, Eye, Printer, Users } from 'lucide-react';

interface Step3Props {
  data: AssessmentData;
  report: Report;
}

const Step3: React.FC<Step3Props> = ({ data, report }) => {
  const getLevelDetails = (lvl: Report['level']) => {
    switch (lvl) {
      case 'cocooning':
        return {
          bg: 'bg-indigo-50 border-indigo-100',
          text: 'text-indigo-800',
          darkBg: 'bg-indigo-600',
          iconBg: 'bg-indigo-100 text-indigo-600',
          title: 'IV. 蚕茧免疫 (Cocooning Strategy)',
          desc: '患儿存在极重度免疫缺陷，自身无法接种活疫苗且死疫苗应答低下。强烈启动家庭及密切接触者“蚕茧接种方案”，由周围人群筑起无菌防线。',
          icon: <Users className="w-8 h-8" />
        };
      case 'red':
        return {
          bg: 'bg-rose-50 border-rose-100',
          text: 'text-rose-800',
          darkBg: 'bg-rose-600',
          iconBg: 'bg-rose-100 text-rose-600',
          title: 'III. 绝对禁忌 (Red Light)',
          desc: '存在明确的接种后致命不良反应极高风险病理。永久或长期取消接种对应疫苗的特定剂次。记录绝对禁忌证档案，改用其他抗原或物理保护。',
          icon: <Shield className="w-8 h-8" />
        };
      case 'yellow':
        return {
          bg: 'bg-amber-50 border-amber-100',
          text: 'text-amber-800',
          darkBg: 'bg-amber-600',
          iconBg: 'bg-amber-100 text-amber-600',
          title: 'II. 暂缓接种 (Yellow Light)',
          desc: '目前处于急性期、不稳定性黄疸、小于31周早产卡介苗暂缓，或处于免疫抑制剂/血液制品药物安全洗脱等待期中。推迟当前接种。避免接种反应干扰原发病诊断。',
          icon: <AlertTriangle className="w-8 h-8" />
        };
      case 'green':
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-100',
          text: 'text-emerald-800',
          darkBg: 'bg-emerald-600',
          iconBg: 'bg-emerald-100 text-emerald-600',
          title: 'I. 准予接种 (Green Light)',
          desc: '无任何绝对禁忌与慎用，或仅存在稳定的脑瘫、已控制的癫痫、稳定早产儿、生理性或母乳性黄疸等。按照常规一类/二类程序注射。',
          icon: <CheckCircle2 className="w-8 h-8" />
        };
    }
  };

  const levelInfo = getLevelDetails(report.level);

  return (
    <div className="max-w-3xl mx-auto slide-up space-y-6">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 print:border-0 print:shadow-none">
        
        {/* A4 Printable Header */}
        <div className="hidden print:block p-8 pb-0">
          <div className="flex justify-between items-end border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-2xl font-bold font-serif text-slate-900">儿童预防接种临床决策评估单 (2026年最新版)</h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider mt-0.5">Clinical Decision Support Report for Child Immunization (China 2026 & ACIP Comparison)</p>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <p>评估日期: {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>系统流水号: IMM-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-6 text-xs border p-4 print-border rounded-xl">
            <div><strong>儿童姓名：</strong>{data.name || '未填写'}</div>
            <div><strong>性别：</strong>{data.gender === 'male' ? '男 (Male)' : '女 (Female)'}</div>
            <div><strong>实足年龄：</strong>{data.age || '0'} {data.ageUnit === 'years' ? '岁' : '月'}</div>
            <div><strong>出生胎龄/体重：</strong>{data.details.gestationalAge ? `${data.details.gestationalAge}周` : '未填写'} / {data.details.birthWeight ? `${data.details.birthWeight}g` : '未填写'}</div>
          </div>
        </div>

        {/* Dynamic overall summary block (Visual-only screen block, hidden on print) */}
        <div className={`p-8 text-center border-b print:hidden ${levelInfo.bg}`}>
          <div className={`inline-flex p-3 rounded-full mb-3 ${levelInfo.iconBg}`}>
            {levelInfo.icon}
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {levelInfo.title}
          </h2>
          <p className="text-slate-700 mt-2 text-sm max-w-xl mx-auto leading-relaxed">
            {levelInfo.desc}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 border border-slate-100 shadow-sm rounded-full text-xs font-semibold text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            自动评估引擎决策结论 (基于2026中国指南与ACIP双效算力)
          </div>
        </div>

        {/* Detailed Medical Findings */}
        <div className="p-8 space-y-6 print:p-0 print:mt-6">
          
          {/* Print only section for overall conclusion */}
          <div className="hidden print:block mb-6">
            <h3 className="text-sm font-bold border-b border-slate-900 pb-1 mb-2">一、 评估综合结论 (Evaluation Conclusion)</h3>
            <div className="p-4 border print-border rounded-xl bg-slate-50/50">
              <p className="text-sm font-bold text-slate-900">
                决策分级：{levelInfo.title}
              </p>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                {report.overallSummary}
              </p>
            </div>
          </div>

          {/* Active Rules and branching logs */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-1 flex items-center gap-2 print:border-slate-900">
              <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm"></span>
              {data.name || '儿童'}的详细临床决策路线 ({report.decisions.length} 项触发)
            </h3>

            <div className="space-y-6">
              {report.decisions.map((dec, i) => {
                const decLvl = getLevelDetails(dec.code);
                
                return (
                  <div key={i} className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-4 print:border-slate-300 print:bg-white print:break-inside-avoid">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
                          规则: {dec.ruleId}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {dec.ruleTitle}
                        </h4>
                      </div>
                      
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit ${decLvl.bg} ${decLvl.text}`}>
                        <span className={`w-2 h-2 rounded-full ${decLvl.darkBg}`}></span>
                        {dec.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Clinical Action & Guidance */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">临床执行方案 (Clinical Action)</p>
                          <p className="text-xs text-slate-800 font-semibold leading-relaxed mt-0.5">{dec.action}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">随访与监护指引 (Follow-up Guidance)</p>
                          <p className="text-xs text-slate-700 leading-relaxed mt-0.5 whitespace-pre-line">{dec.guidance}</p>
                        </div>
                      </div>

                      {/* Right: Parent Advice */}
                      <div className="bg-blue-50/20 border border-blue-50/50 p-4 rounded-xl space-y-2.5">
                        <div>
                          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">家长沟通话术 (Parent-facing Advice)</p>
                          <p className="text-xs text-blue-900 italic leading-relaxed mt-1 font-medium">{dec.advice}</p>
                        </div>
                        <div className="pt-2 border-t border-blue-100/50">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">临床药理/免疫学机制 (Mechanism)</p>
                          <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{dec.mechanism}</p>
                        </div>
                      </div>
                    </div>

                    {/* 中外政策不符时的双重提示卡片 */}
                    {dec.conflict && (
                      <div className="border border-amber-200/60 rounded-xl bg-amber-50/10 overflow-hidden animate-slide-up mt-3">
                        <div className="bg-amber-50/50 px-4 py-2 border-b border-amber-100/60 flex items-center justify-between text-xs font-bold text-amber-950">
                          <span className="flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                            {dec.conflict.title} (中外免疫接种管理规范差异提示)
                          </span>
                          <span className="text-[9px] font-mono text-amber-600 font-semibold uppercase tracking-wider bg-white border border-amber-100 px-1.5 py-0.5 rounded-md">Policy Contrast</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-amber-100">
                          {/* 中国政策栏 */}
                          <div className="p-4 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">🇨🇳</span>
                              <span className="text-xs font-bold text-slate-800">中国官方政策 (2026年最新指南)</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                              {dec.conflict.chinaPolicy}
                            </p>
                          </div>
                          
                          {/* 欧美政策栏 */}
                          <div className="p-4 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">🇪🇺 / 🇺🇸</span>
                              <span className="text-xs font-bold text-slate-800">欧美 ACIP / CDC 指南规范</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                              {dec.conflict.westernPolicy}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Excluded Pseudo Contraindications (Warm info card) */}
          {data.details.isPseudo.length > 0 && (
            <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/30 print:break-inside-avoid">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                已安全排除和宣教的假性禁忌症 (Pseudo Contraindications Excluded)
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                患儿存在以下情形，系统已确认其仅为「假性禁忌」。根据我国2026最新接种标准建议正常开展接种，并提供了宣教指引，防止无故延迟：
              </p>
              <div className="flex flex-wrap gap-2">
                {data.details.isPseudo.map(idx => (
                  <span key={idx} className="px-3 py-1.5 bg-emerald-50/50 text-emerald-700 text-xs font-medium rounded-xl border border-emerald-100">
                    &bull; {PSEUDO_CONTRAINDICATIONS[idx]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Clinician Sign-off & disclaimer */}
          <div className="hidden print:block pt-16 mt-12 border-t border-slate-900">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-16">
                <p className="text-xs border-b border-slate-900 pb-1 font-bold">评估主检医师签名 (Physician Signature):</p>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>签署日期: ________年____月____日</span>
                  <span>执业证号: ____________________</span>
                </div>
              </div>
              <div className="space-y-16">
                <p className="text-xs border-b border-slate-900 pb-1 font-bold">监护人知情同意签名 (Parent Guardian Signature):</p>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>签署日期: ________年____月____日</span>
                  <span>与患儿关系: __________________</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-[10px] text-slate-500 leading-relaxed text-center space-y-1 border-t border-slate-100 pt-4 font-serif">
              <p>本评估结果由“临床免疫预防接种决策系统”基于我国 2026 年最新预防接种规范与国际 ACIP/CDC 指南联合算力计算生成。</p>
              <p>评估单仅作临床学术及接种预审参考，不代替接种现场医师的最终面诊决定与临床体检判读。</p>
            </div>
          </div>

          {/* Quick Print guide for web view */}
          <div className="bg-slate-50 rounded-2xl p-5 flex items-center justify-between gap-4 no-print">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">📋 生成纸质处方评估单</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                点击右侧按钮将自动排版并呼起系统打印程序，可直接保存为标准的 A4 PDF 文件或连接门诊打印机。
              </p>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              <Printer className="w-4 h-4" /> 打印 A4 评估单
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Step3;
