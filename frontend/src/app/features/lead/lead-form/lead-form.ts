import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-lead-form',
  imports: [MatCardModule, MatButtonModule, MatStepperModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.scss',
})
export class LeadForm {
  private _formBuilder = inject(FormBuilder);

  firstStepForm = this._formBuilder.group({
    fullName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    email: ['', [Validators.required,Validators.email]]
  });
  secondStepForm = this._formBuilder.group({
    street: ['', [Validators.required]],
        street_number: ['', [Validators.required]],
            postal_code: ['', [Validators.required]],
                city: ['', [Validators.required]],
                state: ['', [Validators.required]]
  });
  thirdStepForm = this._formBuilder.group({
    landline: ['', []],
    cellphone: ['', [Validators.required]]
  });

}
