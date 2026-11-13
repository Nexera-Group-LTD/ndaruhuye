import { NgModule } from '@angular/core';
import { SkillsRoutingModule } from './skills-routing-module';
import { SkillsPage } from './pages/skills-page/skills-page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SkillsPage],
  imports: [SkillsRoutingModule, SharedModule],
})
export class SkillsModule {}
