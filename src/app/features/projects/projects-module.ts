import { NgModule } from '@angular/core';

import { ProjectsRoutingModule } from './projects-routing-module';
import { ProjectsPage } from './pages/projects-page/projects-page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ProjectsPage],
  imports: [ProjectsRoutingModule, SharedModule],
})
export class ProjectsModule {}
