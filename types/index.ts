export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  itemCount: number;
  averageValue: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface MiniTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  estimatedTime: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
}