import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { Lead } from '../lead.model';
import { LeadService } from '../lead.service';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../../shared/components/form-input/form-input';
import { FormDateInput } from '../../../shared/components/form-date-input/form-date-input';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

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

  firstStepForm = this._formBuilder.group({
    full_name: [null, [Validators.required,Validators.maxLength(255)]],
    birth_date: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email,Validators.maxLength(255)]]
  });
  secondStepForm = this._formBuilder.group({
    street: [null, [Validators.required,Validators.maxLength(255)]],
    street_number: [0, [Validators.required]],
    postal_code: [null, [Validators.required,Validators.maxLength(8)]],
    city: [null, [Validators.required,Validators.maxLength(255)]],
    state: [null, [Validators.required, Validators.pattern('^[A-Z]{2}$'),Validators.maxLength(2)]]
  });
  thirdStepForm = this._formBuilder.group({
    landline: [null],
    cellphone: [null, [Validators.required]]
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
    })
    this.leadService.get()
  }

  ngOnDestroy(): void {
    this.unsub$.next()
    this.unsub$.complete()
  }

  submit(index:number) {
    let hasChanged = this.leadForm.some((group) => group.dirty)
    if (hasChanged) {
      let leadFormData: Lead = {
        ...this.firstStepForm.getRawValue(),
        ...this.secondStepForm.getRawValue(),
        ...this.thirdStepForm.getRawValue(),
        step: index
      }

      this.leadService.updateUser(leadFormData).subscribe(()=> console.log('a'));

      for (let step of this.leadForm) {
        step.markAsPristine()
      }
    }
  }
}
