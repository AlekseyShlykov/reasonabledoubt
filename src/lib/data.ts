import type { Locale } from './i18n';

export interface CaseContent {
  id: number;
  humanHistory: string;
  aiPrediction: string;
  explanation: string;
}

export interface CaseLogic {
  id: number;
  socialCoef: number;
  financialCoef: number;
  psychologicalCoef: number;
  trends: {
    social: { direction: number; delta: number };
    financial: { direction: number; delta: number };
    psychological: { direction: number; delta: number };
  };
  predictionProbability: number;
  expectedImpact: {
    harmedPeople: { min: number; max: number };
    severityScore: number;
  };
  aiFactors: Array<{ name: string; weight: number }>;
  sparklines: {
    social: number[];
    financial: number[];
    psychological: number[];
  };
}

export async function loadCaseContent(locale: Locale, caseId: number): Promise<CaseContent | null> {
  try {
    const response = await fetch(`/data/cases/${locale}/cases.json`);
    const data = await response.json();
    return data.cases.find((c: CaseContent) => c.id === caseId) || null;
  } catch (error) {
    console.error('Error loading case content:', error);
    return null;
  }
}

export async function loadCaseLogic(caseId: number): Promise<CaseLogic | null> {
  try {
    const response = await fetch('/data/logic/cases_logic.json');
    const data = await response.json();
    return data.cases.find((c: CaseLogic) => c.id === caseId) || null;
  } catch (error) {
    console.error('Error loading case logic:', error);
    return null;
  }
}

export async function loadAllCases(locale: Locale): Promise<CaseContent[]> {
  try {
    const response = await fetch(`/data/cases/${locale}/cases.json`);
    const data = await response.json();
    return data.cases || [];
  } catch (error) {
    console.error('Error loading all cases:', error);
    return [];
  }
}

export async function loadAllLogic(): Promise<CaseLogic[]> {
  try {
    const response = await fetch('/data/logic/cases_logic.json');
    const data = await response.json();
    return data.cases || [];
  } catch (error) {
    console.error('Error loading all logic:', error);
    return [];
  }
}

