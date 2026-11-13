export interface Project {
  readonly id: string;
  readonly number: string;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly role: string;
  readonly year?: string;
  readonly status?: string;
  readonly technologies: readonly string[];
  readonly url?: string;
  readonly linkText?: string;
  readonly featured?: boolean;
}

export interface ProjectPrinciple {
  readonly number: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
}
