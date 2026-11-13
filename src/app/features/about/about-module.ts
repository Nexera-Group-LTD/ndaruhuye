import { NgModule } from '@angular/core';
import { AboutRoutingModule } from './about-routing-module';
import { AboutPage } from './pages/about-page/about-page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AboutPage],
  imports: [AboutRoutingModule, SharedModule],
})
export class AboutModule {}
