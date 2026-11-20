import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PROJECTS, Project } from '../../../../shared/data/projects.data';
import { ProjectPrinciple } from '../../interfaces/projects.interface';

@Component({
  selector: 'app-projects-page',
  standalone: false,
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPage {
  readonly projects: readonly Project[] = PROJECTS;

  readonly projectPrinciples: readonly ProjectPrinciple[] = [
    {
      number: '01',
      label: 'Understand',
      title: 'Start with the problem',
      description:
        'Understand the people, workflows, constraints, information, and real operational problem before deciding what should be built.',
    },
    {
      number: '02',
      label: 'Design',
      title: 'Shape the system',
      description:
        'Translate requirements into architecture, data models, interfaces, integrations, security boundaries, and a practical delivery plan.',
    },
    {
      number: '03',
      label: 'Build',
      title: 'Connect the layers',
      description:
        'Develop the frontend, backend, data, integrations, automation, and infrastructure as parts of one complete system.',
    },
    {
      number: '04',
      label: 'Deliver',
      title: 'Move into operation',
      description:
        'Deploy, secure, monitor, improve, and support the system so it can create value beyond the development environment.',
    },
  ];

  readonly featuredProject: Project =
    this.projects.find((project) => project.featured) ?? this.projects[0];

  readonly remainingProjects: readonly Project[] = this.projects.filter(
    (project) => project.id !== this.featuredProject.id,
  );
}
