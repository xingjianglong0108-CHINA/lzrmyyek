export interface AntibodyInfo {
  name: string;
  wait: number;
}

export type Gender = 'male' | 'female';
export type AgeUnit = 'years' | 'months';

export interface AssessmentDetails {
  immuneTypes: string[];
  bloodType: string;
  bloodDate: string;
  isPseudo: number[];
}

export interface AssessmentData {
  name: string;
  gender: Gender;
  age: string;
  ageUnit: AgeUnit;
  answers: Record<string, boolean>;
  details: AssessmentDetails;
}

export interface Report {
  risks: string[];
  notes: string[];
  pass: string[];
  level: 'high' | 'medium' | 'low';
}

export interface Question {
  id: string;
  label: string;
  sub: string;
}
