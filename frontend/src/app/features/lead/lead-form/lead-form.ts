import { viewChild, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {
  MatStepper,
  MatStepperModule, StepperOrientation
} from '@angular/material/stepper';
import { Lead } from '../lead.model';
import { LeadService } from '../lead.service';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../../shared/components/form-input/form-input';
import { FormDateInput } from '../../../shared/components/form-date-input/form-date-input';
import { map, Observable, Subject, take, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-lead-form',
  imports: [MatCardModule, MatButtonModule, MatStepperModule, ReactiveFormsModule, FormsModule, CommonModule, FormInput, FormDateInput],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.scss',
})
export class LeadForm implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private breakpoint = inject(BreakpointObserver)
  private leadService = inject(LeadService);
  private lead$: Observable<Lead | null>
  private stepper = viewChild.required(MatStepper);

  firstStepForm = this._formBuilder.group({
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
  secondStepForm = this._formBuilder.group({
    street: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    street_number: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    postal_code: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(8)],
    }),
    city: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    state: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.pattern('^[A-Z]{2}$'), Validators.maxLength(2)],
    }),
  });
  thirdStepForm = this._formBuilder.group({
    landline: new FormControl<string | null>(null),
    cellphone: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  });

  private leadForm: Array<FormGroup> = [this.firstStepForm, this.secondStepForm, this.thirdStepForm]
  private readonly unsub$ = new Subject<void>();
  stepperOrientation: Observable<StepperOrientation>;

  constructor() {
    this.lead$ = this.leadService.lead$
    this.stepperOrientation = this.breakpoint
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }


  ngOnInit(): void {
    this.lead$.pipe(takeUntil(this.unsub$)).subscribe((lead) => {
      for (let group of this.leadForm) {
        group.patchValue({ ...lead })
      }
      this.setStepperPosition(lead?.step ?? 0)
    })
    this.leadService.get()
  }

  ngOnDestroy(): void {
    this.unsub$.next()
    this.unsub$.complete()
  }

  submit(index: number) {
    let hasChanged = this.leadForm.some((group) => group.dirty)
    if (hasChanged) {
      let leadFormData: Lead = {
        ...this.firstStepForm.getRawValue(),
        ...this.secondStepForm.getRawValue(),
        ...this.thirdStepForm.getRawValue(),
        step: index
      }

      this.leadService.updateUser(leadFormData).pipe(take(1)).subscribe()

      this.markAsPristineForm()
    }
  }

  markAsPristineForm() {
    for (let step of this.leadForm) {
      step.markAsPristine()
    }
  }

  private setStepperPosition(step: number) {
    setTimeout(() => {
      for (let i = 0; i < step; i++) {
        this.stepper().next();
      }
    }, 0);
  }
}
