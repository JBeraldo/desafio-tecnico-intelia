import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Lead } from '../lead.model';
import { LeadService } from '../lead.service';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../../shared/components/form-input/form-input';
import { FormDateInput } from '../../../shared/components/form-date-input/form-date-input';

@Component({
  selector: 'app-lead-form',
  imports: [MatCardModule, MatButtonModule, MatStepperModule, ReactiveFormsModule, FormsModule, CommonModule,FormInput,FormDateInput],
  providers: [provideNativeDateAdapter()],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.scss',
})
export class LeadForm {
  private _formBuilder = inject(FormBuilder);
  private leadService = inject(LeadService);

  firstStepForm = this._formBuilder.group({
    fullName: [null, [Validators.required]],
    birthDate: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]]
  });
  secondStepForm = this._formBuilder.group({
    street: [null, [Validators.required]],
    street_number: [null, [Validators.required]],
    postal_code: [null, [Validators.required]],
    city: [null, [Validators.required]],
    state: [null, [Validators.required,Validators.pattern('^[A-Z]{2}$')]]
  });
  thirdStepForm = this._formBuilder.group({
    landline: [null],
    cellphone: [null, [Validators.required]]
  });

  private leadForm: Array<FormGroup> = [this.firstStepForm, this.secondStepForm, this.thirdStepForm]

  submit() {
    let hasChanged = this.leadForm.some((group) => group.dirty)
    if (hasChanged) {
      let leadFormData: Lead = {
        ...this.firstStepForm.getRawValue(),
        ...this.secondStepForm.getRawValue(),
        ...this.thirdStepForm.getRawValue()
      }

      this.leadService.store(leadFormData);

      for (let step of this.leadForm) {
        step.markAsPristine()
      }
    }
  }
}
