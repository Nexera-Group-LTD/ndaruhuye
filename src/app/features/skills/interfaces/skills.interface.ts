export interface Skill {
  readonly name: string;
  readonly description?: string;
}

export interface SkillGroup {
  readonly id: string;
  readonly number: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly skills: readonly Skill[];
}

export interface EngineeringStrength {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface SystemLayer {
  readonly number: string;
  readonly label: string;
  readonly title: string;
  readonly technologies: string;
}
