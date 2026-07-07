export interface AntibodyInfo {
  name: string;
  wait: number;
}

export type Gender = 'male' | 'female';
export type AgeUnit = 'years' | 'months';

export interface SteroidDetails {
  weight: string;
  dose: string;
  duration: string;
}

export interface SOTDetails {
  phase: 'candidate' | 'early' | 'maintenance' | '';
  hbsabLessThan10: boolean;
}

export interface HSCTDetails {
  phase: 'donor' | 'rebuilding' | '';
  isDonor: boolean;
  rebuildMonths: string;
  hasGVHD: 'none' | 'chronic' | '';
  clinicalConditions: {
    immunosuppressantsStopped3m: boolean;
    noActiveGVHD: boolean;
    bCellRecoveredIvigStopped3m: boolean;
  };
}

export interface AspleniaDetails {
  isAspleniaOrHiv: boolean;
  requiresBothPcvAndMenacwyD: boolean;
}

export interface AssessmentDetails {
  immuneTypes: string[];
  steroid: SteroidDetails;
  sot: SOTDetails;
  hsct: HSCTDetails;
  asplenia: AspleniaDetails;
  bloodType: string;
  bloodDate: string;
  bloodPostVaccine14d: boolean;
  isPseudo: number[];
  q1_subType: 'severe' | 'mild' | '';
  q2_subType: 'severe' | 'mild' | '';
  q3_subType: 'anaphylaxis' | 'dtap_reaction' | 'none' | '';
  q4_subType: 'asplenia' | 'ckd' | 'chronic_aspirin' | '';
  q7_subType: 'uncontrolled' | 'stable' | 'history' | '';
  q8_subType: 'covid_vaccine_3w' | 'unrelated_recovered' | '';
  currentLocation: 'nicu' | 'home' | '';
  
  // 2026年中国指南增补字段
  gestationalAge: string;     // 胎龄 (周)，用于卡介苗 31 周界限
  birthWeight: string;        // 出生体重 (g)，用于乙肝 2000g 界限
  motherHbsag: 'positive' | 'negative' | 'unknown' | ''; // 母亲 HBsAg 状态
  hivStatus: 'infected_symptoms' | 'infected_no_symptoms' | 'unknown_symptoms' | 'unknown_no_symptoms' | 'uninfected' | ''; // HIV 感染母亲所生儿童状态
  jaundiceStatus: 'physiological' | 'breastmilk' | 'stable_high_bilirubin' | 'unstable' | ''; // 黄疸状态
}

export interface AssessmentData {
  name: string;
  gender: Gender;
  age: string;
  ageUnit: AgeUnit;
  answers: Record<string, boolean>;
  details: AssessmentDetails;
}

export interface ConflictTip {
  title: string;
  chinaPolicy: string;
  westernPolicy: string;
}

export interface DecisionItem {
  code: 'green' | 'yellow' | 'red' | 'cocooning';
  title: string;
  ruleId: string;
  ruleTitle: string;
  action: string;
  guidance: string;
  advice: string; // 家长沟通话术
  mechanism: string; // 临床药理机制
  conflict?: ConflictTip; // 中国与欧美不符时的双重提示
}

export interface Report {
  level: 'green' | 'yellow' | 'red' | 'cocooning';
  decisions: DecisionItem[];
  overallSummary: string;
}

export interface Question {
  id: string;
  label: string;
  sub: string;
}
