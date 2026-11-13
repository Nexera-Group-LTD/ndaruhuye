export interface ProfessionalHighlight {
  readonly title: string;
  readonly description: string;
}

export interface ImpactArea {
  readonly modifier: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
}

export interface Project {
  readonly modifier: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly url?: string;
  readonly linkText?: string;
}

export interface Experience {
  readonly period: string;
  readonly type: string;
  readonly title: string;
  readonly organization?: string;
  readonly description: string;
  readonly current?: boolean;
}

export interface Capability {
  readonly modifier: string;
  readonly label: string;
  readonly title: string;
  readonly skills: readonly string[];
}
