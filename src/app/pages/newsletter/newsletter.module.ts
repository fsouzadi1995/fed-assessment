import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsletterComponent } from './newsletter.component';
import { NewsletterRoutingModule } from './newsletter-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [NewsletterComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  exports: [NewsletterRoutingModule],
})
export class NewsletterModule {}
