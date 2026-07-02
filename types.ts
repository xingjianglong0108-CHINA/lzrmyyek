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
}

export interface AssessmentData {
  name: string;
  gender: Gender;
  age: string;
  ageUnit: AgeUnit;
  answers: Record<string, boolean>;
  details: AssessmentDetails;
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
