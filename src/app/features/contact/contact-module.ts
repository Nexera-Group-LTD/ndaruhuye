import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ContactRoutingModule } from './contact-routing-module';
import { ContactPage } from './pages/contact-page/contact-page';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ContactPage],
  imports: [CommonModule, ContactRoutingModule, SharedModule],
})
export class ContactModule {}
