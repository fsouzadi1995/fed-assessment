import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, take, tap } from 'rxjs/operators';
import { FieldNames } from '@constants/newsletter/newsletter.constants';
import { EmailOptions } from '@models/newsletter/email-options.model';
import { NewsletterResponse } from '@models/newsletter/newsletter-response.model';
import { NewsletterService } from './services/newsletter.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterComponent {
  public readonly fieldNames: typeof FieldNames;
  public options: EmailOptions[];
  public newsletterForm: FormGroup;
  public response: NewsletterResponse | null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cd: ChangeDetectorRef,
    private readonly newsletterSvc: NewsletterService,
    private readonly spinnerSvc: NgxSpinnerService,
  ) {
    this.response = null;

    this.options = [
      {
        name: 'ADVANCES',
        shortName: 'advances',
      },
      {
        name: 'ALERTS',
        shortName: 'alerts',
      },
      {
        name: 'OTHER COMMUNICATIONS',
        shortName: 'other',
      },
    ];

    this.fieldNames = FieldNames;

    // Dev note: this can also be easily generated with Formly or a custom form builder using generics
    this.newsletterForm = this.fb.group({
      [this.fieldNames.FirstName]: this.fb.control(null, Validators.required),
      [this.fieldNames.LastName]: this.fb.control(null, Validators.required),
      [this.fieldNames.Email]: this.fb.control(
        'fsouzadi@gmail.com',
        Validators.compose([Validators.required, Validators.email]),
      ),
      [this.fieldNames.Organization]: this.fb.control(null),
      [this.fieldNames.EuResident]: this.fb.control(null, Validators.required),
      [this.fieldNames.Updates]: this.fb.control([], Validators.required),
    });
  }

  public submit(): void {
    const { valid } = this.newsletterForm;

    if (!valid) {
      console.error('Invalid form');
      return;
    }

    console.log(this.newsletterForm.getRawValue());

    this.spinnerSvc.show();

    this.newsletterSvc
      .saveNewsletter(this.newsletterForm.getRawValue())
      .pipe(
        tap((res) => (this.response = res)),
        take(1),
        finalize(() => {
          this.reset();
          this.cd.detectChanges();
          this.spinnerSvc.hide();
        }),
      )
      .subscribe();
  }

  public reset(evt?: MouseEvent): void {
    evt?.preventDefault();

    this.newsletterForm.reset({ updates: [] });
  }

  public onCheckboxChange(target: HTMLInputElement): void {
    const control = this.getControl(FieldNames.Updates);
    const { id } = target;
    const { value } = control;

    if (!value) {
      control.patchValue([id]);
      return;
    }

    if (value.includes(id)) {
      control.patchValue([...value.filter((update: string) => update !== id)]);
      return;
    }

    control.patchValue([...value, id]);
  }

  public hasError(fieldName: string, type: string): boolean {
    const control = this.getControl(fieldName);

    return control.hasError(type) && control.dirty;
  }

  public getControl(name: string): FormControl {
    return this.newsletterForm.get(name) as FormControl;
  }

  public get isCheckboxSelected(): boolean {
    return !!Object.values(this.getControl(this.fieldNames.Updates)?.value).length;
  }
}
