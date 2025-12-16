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

             {/* Table 3: 中国儿童免疫规划表 */}
             <section className="space-y-4 print:mt-8">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900 border-l-4 border-emerald-500 pl-3">
                        3. 中国儿童免疫规划 (一类) 与常见非免疫规划 (二类) 疫苗参考表
                    </h3>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden print:border-black">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 print:bg-gray-100 print:border-black">
                            <tr>
                                <th className="p-3 w-1/4">接种月龄/年龄</th>
                                <th className="p-3 w-1/3">一类疫苗 (免费/强制)</th>
                                <th className="p-3">常见二类疫苗 (自费/自愿)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 print:divide-black">
                            {[
                                ["出生时", "乙肝①、卡介苗", "-"],
                                ["1 月龄", "乙肝②", "-"],
                                ["2 月龄", "脊灰① (IPV)", "13价肺炎①、五联①、轮状病毒"],
                                ["3 月龄", "脊灰② (IPV)、百白破①", "13价肺炎②、五联②"],
                                ["4 月龄", "脊灰③ (OPV)、百白破②", "13价肺炎③、五联③"],
                                ["5 月龄", "百白破③", "-"],
                                ["6 月龄", "乙肝③、流脑A群①", "手足口(EV71)、流感、13价肺炎④(12月前)"],
                                ["8 月龄", "麻腮风①、乙脑①", "-"],
                                ["9 月龄", "流脑A群②", "-"],
                                ["12-15 月龄", "-", "水痘①、Hib"],
                                ["18 月龄", "百白破④、麻腮风②、甲肝①", "五联④"],
                                ["2 周岁", "乙脑②", "-"],
                                ["3 周岁", "流脑A+C群①", "-"],
                                ["4 周岁", "脊灰④ (OPV)", "水痘②"],
                                ["6 周岁", "白破、流脑A+C群②", "-"],
                            ].map(([age, class1, class2], i) => (
                                <tr key={i} className="hover:bg-slate-50/50 print:break-inside-avoid">
                                    <td className="p-3 font-medium text-slate-900">{age}</td>
                                    <td className="p-3 text-emerald-700 font-medium print:text-black">{class1}</td>
                                    <td className="p-3 text-slate-600 print:text-black">{class2}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

             {/* Table 4: 禁忌症 */}
             <section className="space-y-4 print:mt-8">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900 border-l-4 border-red-500 pl-3">
                        4. 常见疫苗接种绝对禁忌症速查
                    </h3>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                        依据中国药典及说明书
                    </span>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden print:border-black">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 print:bg-gray-100 print:border-black">
                            <tr>
                                <th className="p-3 w-1/4">疫苗类型</th>
                                <th className="p-3">绝对禁忌症 (Contraindications)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 print:divide-black">
                            {[
                                ["所有疫苗 (通用)", "1. 对疫苗中任何成分（包括辅料、抗生素）严重过敏者。\n2. 既往接种该疫苗发生过严重过敏反应（如过敏性休克、喉头水肿）。\n3. 患急性疾病、严重慢性疾病、慢性疾病的急性发作期、发热者（暂缓）。"],
                                ["减毒活疫苗 (卡介苗/麻腮风/乙脑/水痘等)", "1. 免疫缺陷、免疫功能低下或正在接受免疫抑制治疗者。\n2. 妊娠期妇女。"],
                                ["百白破疫苗 (DTaP)", "1. 患有进行性神经系统疾病（如未控制的癫痫、婴儿痉挛症、进行性脑病）。\n2. 既往接种含百日咳成分疫苗后发生脑病。"],
                                ["脊灰减毒活疫苗 (OPV)", "1. 免疫缺陷者及其家庭成员接触者（应改用IPV）。\n2. 肛周脓肿（暂缓）。"],
                                ["流感疫苗", "1. 对鸡蛋或疫苗辅料成分严重过敏者（注：轻微鸡蛋过敏非禁忌，但需留观）。"],
                            ].map(([type, contra], i) => (
                                <tr key={i} className="hover:bg-slate-50/50 print:break-inside-avoid">
                                    <td className="p-3 font-medium text-slate-900 align-top">{type}</td>
                                    <td className="p-3 text-red-700 whitespace-pre-line leading-relaxed print:text-black">{contra}</td>
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