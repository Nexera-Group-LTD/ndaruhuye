export interface Project {
  readonly id: string;
  readonly number: string;
  readonly modifier: string;
  readonly label: string;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly role: string;
  readonly status?: string;
  readonly technologies: readonly string[];
  readonly url?: string;
  readonly linkText?: string;
  readonly featured?: boolean;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'daily-infrastructure-digest',
    number: '01',
    modifier: 'digest',
    label: 'Infrastructure intelligence',
    category: 'Infrastructure intelligence',
    title: 'Daily Infrastructure Digest System',
    description:
      'An AI-enabled platform for aggregating, organizing, and sharing infrastructure information with greater clarity and speed.',
    role: 'Full-stack engineering · Architecture · AI integration',
    status: 'Live',
    technologies: ['Angular', 'NestJS', 'PostgreSQL', 'AI', 'Automation'],
    url: 'https://digest.mininfra.gov.rw/',
    linkText: 'Visit platform',
    featured: true,
  },
  {
    id: 'national-zoning',
    number: '02',
    modifier: 'zoning',
    label: 'Public information',
    category: 'Public information',
    title: 'National Zoning Regulation Platform',
    description:
      'A national digital platform that makes zoning regulations easier to access and navigate through a structured public experience.',
    role: 'Full-stack development · Platform engineering',
    status: 'Live',
    technologies: ['Angular', 'Backend APIs', 'Database', 'Infrastructure'],
    url: 'https://zoning.mininfra.gov.rw/',
    linkText: 'Visit platform',
  },
  {
    id: 'akagera-aviation',
    number: '03',
    modifier: 'aviation',
    label: 'Operational systems',
    category: 'Operational systems',
    title: 'Akagera Aviation Inventory Management System',
    description:
      'An inventory management platform designed around aviation operations, asset visibility, and structured internal workflows.',
    role: 'System design · Full-stack development',
    technologies: ['Web application', 'Backend', 'Database', 'Inventory workflows'],
  },
  {
    id: 'kubaka-bpmis',
    number: '04',
    modifier: 'kubaka',
    label: 'Business process management',
    category: 'Business process management',
    title: 'Kubaka BPMIS',
    description:
      'A digital system supporting structured infrastructure business processes and more consistent operational workflows.',
    role: 'Software engineering · Systems integration',
    status: 'Live',
    technologies: ['Full stack', 'APIs', 'Database', 'Workflow systems'],
    url: 'https://kubaka.gov.rw/',
    linkText: 'Visit platform',
  },
  {
    id: 'mina-ai',
    number: '05',
    modifier: 'mina',
    label: 'AI solutions',
    category: 'Artificial intelligence',
    title: 'MINA AI',
    description:
      'An AI-focused application within the infrastructure information ecosystem, designed to make information easier to discover and use.',
    role: 'AI integration · Application engineering',
    status: 'Development',
    technologies: ['Generative AI', 'AI agents', 'APIs', 'Information retrieval'],
    url: 'https://testing-digest.mininfra.gov.rw/mina/',
    linkText: 'Explore MINA AI',
  },
  {
    id: 'nezeza-ijuru',
    number: '06',
    modifier: 'nezeza-ijuru',
    label: 'Spiritual and cultural heritage',
    category: 'Spiritual',
    title: 'Nezeza Ijuru',
    description:
      'The official digital platform for Nezeza Ijuru, an annual evangelism and discipleship mission of Zion Temple Kimironko, connecting people with the mission and its message.',
    role: 'Software engineering · Systems integration',
    status: 'Live',
    technologies: ['Full stack', 'APIs', 'Database', 'Workflow systems'],
    url: 'https://nezezaijuru.org',
    linkText: 'Visit platform',
  },
  {
    id: 'ndaruhuye',
    number: '07',
    modifier: 'ndaruhuye',
    label: 'Portfolio',
    category: 'Digital platform',
    title: 'Ndaruhuye',
    description:
      'A personal portfolio that presents software engineering, systems, data, and AI work through a clear online experience.',
    role: 'Full-stack development · Product delivery',
    status: 'Live',
    technologies: ['Web development', 'Backend', 'Database', 'Deployment'],
    url: 'https://ndaruhuye.nexeragroup.rw/',
    linkText: 'Visit website',
  },
];
