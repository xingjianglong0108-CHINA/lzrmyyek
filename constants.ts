import { AntibodyInfo, Question } from './types';

export const ANTIBODY_DATA: Record<string, AntibodyInfo> = {
  washed_rbc: { name: "洗涤红细胞 (Washed RBCs)", wait: 0 },
  whole_blood: { name: "全血/浓缩红细胞 (Whole Blood/Packed RBCs)", wait: 6 }, // Wait 5-6 months, we put 6 as safe or handle 5-6 dynamically
  plasma: { name: "血浆/血小板制品", wait: 7 },
  igim: { name: "麻疹预防性普通免疫球蛋白 (IGIM)", wait: 6 },
  ivig_kawasaki: { name: "川崎病剂量静脉注射丙球 (IVIG 2 g/kg)", wait: 11 },
};

export const PSEUDO_CONTRAINDICATIONS = [
  "轻微急性疾病 (如低热/感冒且精神食欲良好)",
  "正在使用抗生素治疗（非中重度感染）",
  "早产儿与低体重儿（只要病情稳定，不按矫正年龄）",
  "近期有传染病接触史",
  "普通食物、花粉、不相关药物的非重度过敏",
  "普通的皮肤湿疹、轻微皮疹",
  "家族普通成员有变态反应性疾病或过敏史",
  "母乳喂养者"
];

export const QUESTIONS: Question[] = [
  { 
    id: 'q1_acute_illness', 
    label: '1. 急性期发热/疾病 (q1_acute_illness)', 
    sub: '今日是否有发热或急性发病？' 
  },
  { 
    id: 'q2_severe_allergies', 
    label: '2. 严重过敏史 (q2_severe_allergies)', 
    sub: '是否对疫苗特定成分/包装材质有过敏性休克史，或有其他普通/食物过敏？' 
  },
  { 
    id: 'q3_past_severe_reaction', 
    label: '3. 既往疫苗严重反应史 (q3_past_severe_reaction)', 
    sub: '既往接种同款疫苗是否发生过全身过敏性休克、喉头水肿，或接种 DTaP 发生过异常发热/哭闹/惊厥等？' 
  },
  { 
    id: 'q4_chronic_diseases', 
    label: '4. 慢性病/器官缺陷 (q4_chronic_diseases)', 
    sub: '患儿是否具有无脾、慢性肾脏病、器官缺陷或其他基础病，或长期服用阿司匹林？' 
  },
  { 
    id: 'q5_wheezing_asthma_12m', 
    label: '5. 哮喘或喘息发作 (q5_wheezing_asthma_12m)', 
    sub: '在过去 12 个月内是否曾有哮喘或喘息发作史？' 
  },
  { 
    id: 'q6_intussusception', 
    label: '6. 婴儿肠套叠史 (q6_intussusception)', 
    sub: '患儿既往是否有过肠套叠病史（口服轮状病毒疫苗绝对禁忌）？' 
  },
  { 
    id: 'q7_neurological_disorders', 
    label: '7. 惊厥/神经系统疾病史 (q7_neurological_disorders)', 
    sub: '是否有癫痫、脑瘫、惊厥史或进行性/控制不佳的神经系统疾病？' 
  },
  { 
    id: 'q8_myocarditis_misc', 
    label: '8. 心肌炎/MIS-C 史 (q8_myocarditis_misc)', 
    sub: '既往是否发生过心肌炎、心包炎或新冠相关多系统炎症综合征（MIS-C）？' 
  },
  { 
    id: 'q9_immunodeficiency', 
    label: '9. 免疫系统缺陷 (q9_immunodeficiency)', 
    sub: '是否具有原发或继发性免疫缺陷，如 SCID、抗 CD20 治疗、使用大剂量糖皮质激素、器官移植或 HSCT 移植等？' 
  },
  { 
    id: 'q10_immunosuppressants_chemo', 
    label: '10. 免疫抑制剂/化疗史 (q10_immunosuppressants_chemo)', 
    sub: '近期是否接受过放疗、化疗，或正在使用其他免疫抑制剂药物？' 
  },
  { 
    id: 'q11_family_immunodeficiency', 
    label: '11. 家族免疫缺陷史 (q11_family_immunodeficiency)', 
    sub: '直系亲属（父母、兄弟姐妹）是否有先天性严重联合免疫缺陷（SCID）等家族史？' 
  },
  { 
    id: 'q12_blood_products_antivirals', 
    label: '12. 血液制品及抗体暴露 (q12_blood_products_antivirals)', 
    sub: '近期是否输入过免疫球蛋白（IVIG）、全血、血浆或红细胞等血液制品？' 
  },
  { 
    id: 'q13_pregnancy', 
    label: '13. 妊娠状态 (q13_pregnancy)', 
    sub: '患儿（青少年女性）目前是否处于妊娠期？' 
  },
  { 
    id: 'q14_recent_vaccines_4w', 
    label: '14. 近期 4 周接种史 (q14_recent_vaccines_4w)', 
    sub: '过去 28 天内（4周）是否接种过注射型减毒活疫苗（如水痘、麻腮风等）或 LAIV？' 
  },
  { 
    id: 'q15_syncope_history', 
    label: '15. 晕针/迷走神经反射史 (q15_syncope_history)', 
    sub: '既往注射是否有过头晕、紧张或晕针史？' 
  },
  { 
    id: 'q16_anxiety', 
    label: '16. 接种焦虑 (q16_anxiety)', 
    sub: '患儿是否对打针表现出高度紧张、恐惧或抗拒？' 
  }
];
