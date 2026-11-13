export interface Service {
  readonly id: string;
  readonly number: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly outcome: string;
}

export interface EngagementStep {
  readonly number: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
}

export interface ServiceArea {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}
