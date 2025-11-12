import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AddressFormGroup, ContactFormGroup, PersonalFormGroup } from '../lead.model';



@Injectable({ providedIn: 'root' })
export class LeadFormBuilder {
  constructor(private fb: FormBuilder) {}

  /** Formulário de dados pessoais */
  personal(): FormGroup<PersonalFormGroup> {
    return this.fb.group({
      full_name: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      birth_date: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      email: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.email, Validators.maxLength(255)],
      }),
    });
  }

  /** Formulário de endereço */
  address(): FormGroup<AddressFormGroup> {
    return this.fb.group({
      street: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      street_number: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      postal_code: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.maxLength(8)],
      }),
      city: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.maxLength(255), Validators.pattern('^[A-Za-z]+$')],
      }),
      state: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.pattern('^[A-Z]{2}$'), Validators.maxLength(2)],
      }),
    });
  }

  /** Formulário de contato */
  contact(): FormGroup<ContactFormGroup> {
    return this.fb.group({
      landline: new FormControl<string | null>(null),
      cellphone: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
    });
  }
}