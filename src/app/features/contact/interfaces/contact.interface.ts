export type ProjectType =
  | 'digital-platform'
  | 'software-development'
  | 'data-ai'
  | 'automation'
  | 'architecture'
  | 'consulting'
  | 'other';

export interface ProjectTypeOption {
  readonly value: ProjectType;
  readonly label: string;
}

export interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly organization: string;
  readonly projectType: ProjectType | '';
  readonly message: string;
}

export interface ContactChannel {
  readonly number: string;
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  readonly external?: boolean;
}

export interface CollaborationTopic {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}
