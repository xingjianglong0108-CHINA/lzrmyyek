import React from 'react';
import { X } from 'lucide-react';

interface ReferenceTablesProps {
  onClose: () => void;
}

const ReferenceTables: React.FC<ReferenceTablesProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 print:p-0 print:static print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col print:shadow-none print:max-h-none print:rounded-none print:h-auto print:block">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-4 flex justify-between items-center z-10 print:hidden">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                📚 疫苗接种临床决策备查表
            </h2>
            <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-800"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto print:p-0 print:overflow-visible">
            
            {/* Table 1 */}
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900 border-l-4 border-blue-500 pl-3">
                        1. 含抗体血液制品与含麻疹/水痘疫苗推荐间隔时间表
                    </h3>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                        基于 CDC Pink Book
                    </span>
                </div>
                
                <div className="border border-slate-200 rounded-lg overflow-hidden print:border-black">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 print:bg-gray-100 print:border-black">
                            <tr>
                                <th className="p-3 w-1/3">血液制品/抗体类型</th>
                                <th className="p-3 w-1/6 text-center">推迟 (月)</th>
                                <th className="p-3 w-1/2">备注</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 print:divide-black">
                            {[
                                ["洗涤红细胞 (Washed RBCs)", "0", "抗体含量极低，无干扰"],
                                ["单克隆抗体 (Palivizumab/Nirsevimab)", "0", "特异性抗体，不干扰MMR/水痘"],
                                ["腺病毒/破伤风免疫球蛋白 (TIG)", "3", "-"],
                                ["乙肝免疫球蛋白 (HBIG)", "3", "-"],
                                ["红细胞 (Packed RBCs, 腺嘌呤-生理盐水)", "5", "10 ml/kg"],
                                ["全血 (Whole Blood)", "6", "10 ml/kg"],
                                ["血浆 / 血小板制品", "7", "10 ml/kg"],
                                ["IVIG - 替代治疗剂量 (300-400 mg/kg)", "8", "用于免疫缺陷治疗"],
                                ["IVIG - ITP治疗剂量 (400 mg/kg)", "8", "-"],
                                ["IVIG - ITP治疗剂量 (1000 mg/kg)", "10", "-"],
                                ["IVIG - 川崎病治疗剂量 (2 g/kg)", "11", "高剂量抗体需极长代谢期"],
                            ].map(([name, month, note], i) => (
                                <tr key={i} className="hover:bg-slate-50/50 print:break-inside-avoid">
                                    <td className="p-3 font-medium text-slate-900">{name}</td>
                                    <td className="p-3 text-center font-bold text-blue-600 print:text-black">{month}</td>
                                    <td className="p-3 text-slate-600">{note !== '-' ? note : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

             {/* Table 2 */}
            <section className="space-y-4 print:mt-8">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900 border-l-4 border-amber-500 pl-3">
                        2. 特殊临床状况下的疫苗接种决策速查
                    </h3>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden print:border-black">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 print:bg-gray-100 print:border-black">
                            <tr>
                                <th className="p-3 w-1/4">临床状况</th>
                                <th className="p-3 w-1/5">灭活疫苗 (IIV等)</th>
                                <th className="p-3 w-1/5">减毒活疫苗 (MMR等)</th>
                                <th className="p-3">关键注意事项</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 print:divide-black">
                             {[
                                ["轻度急性疾病 (低热)", "接种", "接种", "关注发热管理"],
                                ["正在使用抗生素", "接种", "接种", "口服伤寒疫苗例外"],
                                ["早产儿", "接种 (按时)", "接种 (按时)", "乙肝需关注体重<2kg情况"],
                                ["孕妇 (青少年)", "接种 (Tdap等)", "禁忌", "HPV也不推荐"],
                                ["白血病/淋巴瘤 (缓解期)", "接种", "延迟", "需化疗结束3个月后评估"],
                                ["实体器官移植", "接种", "禁忌", "移植后通常长期免疫抑制"],
                                ["无脾 (Asplenia)", "接种 (强化Hib/Men)", "慎用/禁忌", "MenACWY-D与PCV13需间隔"],
                                ["HIV感染 (无症状)", "接种", "接种 (MMR/Var)", "需确认CD4计数安全"],
                                ["湿疹/特应性皮炎", "接种", "接种", "避免接种部位发生广泛皮炎"],
                                ["鸡蛋过敏", "接种", "接种", "黄热病疫苗需特殊处理"],
                            ].map(([cond, iiv, live, note], i) => (
                                <tr key={i} className="hover:bg-slate-50/50 print:break-inside-avoid">
                                    <td className="p-3 font-medium text-slate-900">{cond}</td>
                                    <td className="p-3 text-green-700 font-medium print:text-black">{iiv}</td>
                                    <td className={`p-3 font-medium ${live.includes('禁忌') ? 'text-red-600' : 'text-slate-700'} print:text-black`}>{live}</td>
                                    <td className="p-3 text-slate-600">{note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 text-center bg-slate-50 print:hidden">
            <button 
                onClick={onClose} 
                className="px-8 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium shadow-sm transition-all"
            >
                关闭备查表
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReferenceTables;