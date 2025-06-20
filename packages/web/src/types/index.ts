export interface Destination {
  id: string;
  name: string;
  nameEn: string;
  summary?: string;
  flightTime?: string;
  recommendation?: string;
  scores?: Record<string, number>;
  weather?: { text: string; icon: string };
  flight?: { time: string; cost: string };
  expenses?: { total: string; breakdown: Record<string, number> };
  activities?: string[];
  accommodations?: string[];
}

export type Priority = { 
  id: 'cost' | 'weather' | 'activity' | 'flight' | 'uniqueness';
  label: string;
  icon: string;
};
