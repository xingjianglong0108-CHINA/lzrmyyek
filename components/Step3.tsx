import React from 'react';
import { AssessmentData, Report } from '../types';
import { PSEUDO_CONTRAINDICATIONS } from '../constants';
import { Shield, CheckCircle2 } from 'lucide-react';

interface Step3Props {
  data: AssessmentData;
  report: Report;
}

const Step3: React.FC<Step3Props> = ({ data, report }) => {
  return (
      <div className="max-w-2xl mx-auto slide-up">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 print:border-0 print:shadow-none">
              
              <div className="hidden print:block p-8 pb-0">
                  <div className="flex justify-between items-end border-b-2 border-black pb-4">
                      <div>
                          <h1 className="text-2xl font-serif font-bold">儿童免疫接种临床决策评估单</h1>
                          <p className="text-sm mt-1">Clinical Assessment for Immunization</p>
                      </div>
                      <div className="text-right text-xs">
                          <p>日期: {new Date().toLocaleDateString()}</p>
                          <p>流水号: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6 text-sm border p-4 print-border">
                      <div><strong>姓名：</strong>{data.name}</div>
                      <div><strong>性别：</strong>{data.gender === 'male' ? '男' : '女'}</div>
                      <div><strong>年龄：</strong>{data.age} {data.ageUnit === 'years' ? '岁' : '月'}</div>
                  </div>
              </div>

              <div className={`p-8 text-center no-print ${
                  report.level === 'high' ? 'bg-red-50' : 
                  report.level === 'medium' ? 'bg-amber-50' : 'bg-emerald-50'
              }`}>
                  <div className={`inline-flex p-3 rounded-full mb-3 ${
                      report.level === 'high' ? 'bg-red-100 text-red-600' : 
                      report.level === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                      {report.level === 'low' ? <CheckCircle2 className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                      {report.level === 'high' ? '建议暂缓或禁忌' : 
                       report.level === 'medium' ? '需谨慎评估' : '建议接种'}
                  </h2>
                  <p className="text-slate-600 mt-2 text-sm max-w-sm mx-auto">
                      {report.level === 'low' ? '未发现标准禁忌症，请按计划接种。' : '检测到潜在风险因素，请阅读下方详细医疗建议。'}
                  </p>
              </div>

              <div className="p-8 space-y-6">
                  <div className="hidden print:block mb-4">
                      <h3 className="font-bold border-b border-black pb-1 mb-2">评估结论</h3>
                      <div className="p-2 border print-border">
                          {report.level === 'high' ? '⛔ 存在禁忌症 / 高风险' : 
                           report.level === 'medium' ? '⚠️ 存在注意事项 (Precautions)' : '✅ 适合接种'}
                      </div>
                  </div>

                  {report.risks.length > 0 && (
                      <div>
                          <h4 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-red-600"></span> 绝对禁忌 (Contraindications)
                          </h4>
                          <ul className="bg-red-50 rounded-xl p-4 text-sm text-red-800 space-y-2">
                              {report.risks.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                      </div>
                  )}

                  {report.notes.length > 0 && (
                      <div>
                          <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber-600"></span> 注意事项 (Precautions)
                          </h4>
                          <ul className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800 space-y-2">
                              {report.notes.map((n, i) => <li key={i}>{n}</li>)}
                          </ul>
                      </div>
                  )}

                  {data.details.isPseudo.length > 0 && (
                      <div>
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">已排除的假性禁忌</h4>
                          <div className="flex flex-wrap gap-2">
                              {data.details.isPseudo.map(idx => (
                                  <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded border border-slate-200">
                                      {PSEUDO_CONTRAINDICATIONS[idx]}
                                  </span>
                              ))}
                          </div>
                      </div>
                  )}

                  {report.level === 'low' && data.details.isPseudo.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-sm">
                          - 无特殊医疗状况备注 -
                      </div>
                  )}

                  <div className="hidden print:block pt-12 mt-12">
                      <div className="print-grid gap-8">
                          <div>
                              <p className="text-sm mb-8 border-b border-black pb-1">评估医生签名 (Physician Signature):</p>
                          </div>
                          <div>
                              <p className="text-sm mb-8 border-b border-black pb-1">监护人知情同意签名 (Parent Signature):</p>
                          </div>
                      </div>
                      <p className="text-xs text-center mt-8 text-slate-500">
                          本报告仅供临床参考，最终接种决定请遵循现场医师判断。<br/>
                          Reference: CDC Pink Book, General Best Practice Guidelines for Immunization.
                      </p>
                  </div>
              </div>
          </div>
      </div>
  );
};

export default Step3;