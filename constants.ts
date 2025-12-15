import { AntibodyInfo, Question } from './types';

export const ANTIBODY_DATA: Record<string, AntibodyInfo> = {
  hbig: { name: "乙肝免疫球蛋白 (HBIG)", wait: 3 },
  packed_rbc: { name: "红细胞悬液 (Packed RBCs)", wait: 6 },
  whole_blood: { name: "全血 (Whole Blood)", wait: 6 },
  plasma: { name: "血浆/血小板", wait: 7 },
  ivig_std: { name: "IVIG (常规治疗 300-400mg/kg)", wait: 8 },
  ivig_high: { name: "IVIG (高剂量/川崎病 2g/kg)", wait: 11 },
};

export const PSEUDO_CONTRAINDICATIONS = [
  "轻微急性疾病 (低热/感冒)", "正在服用抗生素", "早产儿 (健康)", 
  "近期接触传染病", "青霉素过敏", "母乳喂养", "家族过敏史"
];

export const QUESTIONS: Question[] = [
  { id: 'sick', label: '今日生病', sub: '中重度疾病需推迟' },
  { id: 'allergy', label: '严重过敏史', sub: '疫苗成分/过敏性休克' },
  { id: 'reaction', label: '既往接种反应', sub: '昏厥/严重不良反应' },
  { id: 'immune', label: '免疫功能异常', sub: 'HIV/肿瘤/无脾/用药' },
  { id: 'blood', label: '血液制品史', sub: '过去1年内输血/IVIG' },
  { id: 'neuro', label: '神经系统疾病', sub: '癫痫/脑病' },
  { id: 'liveVac', label: '近期接种', sub: '4周内接种过活疫苗' },
];
