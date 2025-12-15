import { AssessmentData, Report } from './types';
import { ANTIBODY_DATA } from './constants';

export const calculateDelayDate = (bloodType: string, bloodDate: string) => {
  if (!bloodType || !bloodDate || !ANTIBODY_DATA[bloodType]) return null;
  const months = ANTIBODY_DATA[bloodType].wait;
  const d = new Date(bloodDate);
  if (isNaN(d.getTime())) return null;
  
  d.setMonth(d.getMonth() + months);
  return { date: d.toLocaleDateString(), months };
};

export const generateAssessmentReport = (data: AssessmentData): Report => {
  const risks: string[] = [];
  const notes: string[] = [];
  const pass: string[] = [];
  
  if (data.answers.sick) notes.push("中重度疾病：建议推迟至康复。");
  if (data.answers.reaction) risks.push("既往严重反应：绝对禁忌接种同类疫苗。");
  
  if (data.answers.immune) {
      if (data.details.immuneTypes.includes('hiv')) risks.push("HIV感染：需评估CD4水平，严禁特定活疫苗。");
      if (data.details.immuneTypes.includes('asplenia')) notes.push("无脾：禁忌鼻喷流感疫苗，需强化肺炎球菌/脑膜炎疫苗。");
      if (data.details.immuneTypes.length === 0) risks.push("免疫异常：需专科医生进一步评估。");
  }
  
  if (data.answers.blood && data.details.bloodType) {
      const calc = calculateDelayDate(data.details.bloodType, data.details.bloodDate);
      if (calc) notes.push(`血液制品干扰：含抗体制品可能中和活疫苗。建议推迟麻腮风/水痘疫苗至 ${calc.date} (间隔${calc.months}月)。`);
  }
  
  if (data.answers.neuro) notes.push("进行性神经系统疾病：推迟百日咳疫苗直至病情稳定。");
  if (data.answers.liveVac) notes.push("活疫苗互斥：若非同日接种，两种注射用活疫苗需间隔28天。");

  const level = risks.length > 0 ? 'high' : (notes.length > 0 ? 'medium' : 'low');
  return { risks, notes, pass, level };
};
