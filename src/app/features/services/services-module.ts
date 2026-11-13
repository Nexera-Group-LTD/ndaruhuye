import { NgModule } from '@angular/core';
import { ServicesRoutingModule } from './services-routing-module';
import { ServicesPage } from './pages/services-page/services-page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ServicesPage],
  imports: [ServicesRoutingModule, SharedModule],
})
export class ServicesModule {}
