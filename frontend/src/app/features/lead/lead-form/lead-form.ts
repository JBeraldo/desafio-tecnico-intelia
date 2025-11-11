import { viewChild, Component, inject, OnDestroy, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import {
  MatStepper,
  MatStepperModule, StepperOrientation
} from '@angular/material/stepper'
import { Lead } from '../lead.model'
import { LeadService } from '../lead.service'
import { CommonModule } from '@angular/common'
import { FormInput } from '../../../shared/components/form-input/form-input'
import { FormDateInput } from '../../../shared/components/form-date-input/form-date-input'
import { catchError, debounceTime, distinctUntilChanged, exhaustMap, filter, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs'
import { BreakpointObserver } from '@angular/cdk/layout'
import { HttpError, ValidationErrorResponse, Violation } from '../../../shared/shared.types'
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-lead-form',
  imports: [MatCardModule, MatButtonModule, MatStepperModule, ReactiveFormsModule, FormsModule, CommonModule, FormInput, FormDateInput, MatIconModule],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.scss',
})
export class LeadForm implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder)
  private breakpoint = inject(BreakpointObserver)
  private leadService = inject(LeadService)
  private lead$: Observable<Lead | null>
  private stepper = viewChild.required(MatStepper)
  stepperOrientation$: Observable<StepperOrientation>
  private readonly unsub$ = new Subject<void>()
  personalForm = this._formBuilder.group({
    full_name: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    birth_date: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    email: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.email, Validators.maxLength(255)],
    }),
  })
  addressForm = this._formBuilder.group({
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
      validators: [Validators.required, Validators.maxLength(255),Validators.pattern('^[A-Za-z]+$')],
    }),
    state: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.pattern('^[A-Z]{2}$'), Validators.maxLength(2)],
    }),
  })
  contactForm = this._formBuilder.group({
    landline: new FormControl<string | null>(null),
    cellphone: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
  })

  private readonly leadForm: FormGroup[] = [this.personalForm, this.addressForm, this.contactForm]


  constructor() {
    this.lead$ = this.leadService.lead$
    this.stepperOrientation$ = this.breakpoint
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')))
  }


  ngOnInit(): void {
    this.lead$.pipe(takeUntil(this.unsub$), filter(Boolean)).subscribe((lead) => {
      this.patchForms(lead)
    })

    if (!this.leadService.uuid) {
      this.watchPostalCode();
      return;
    }

    this.leadService.get()
      .pipe(takeUntil(this.unsub$))
      .subscribe((response) => {
        this.setStepperPosition(response.lead.step ?? 0);
        this.watchPostalCode();
      });
  }

  ngOnDestroy(): void {
    this.unsub$.next()
    this.unsub$.complete()
  }

  next() {
    const lastChangedForm = this.leadForm.map(g => g.dirty).lastIndexOf(true);
    if (lastChangedForm != -1) {
      this.submit(lastChangedForm)
    }
  }

  private submit(lastChangedForm: number) {
    console.log(1)
    const leadFormData: Lead = {
      ...this.personalForm.getRawValue(),
      ...this.addressForm.getRawValue(),
      ...this.contactForm.getRawValue(),
      step: lastChangedForm,
      uuid: this.leadService.uuid
    }

    const response$ = leadFormData.uuid
      ? this.leadService.update(leadFormData)
      : this.leadService.store(leadFormData)

    response$.pipe(
      takeUntil(this.unsub$),
      catchError((err: HttpError<ValidationErrorResponse>) => {
        for (const violation of Object.values(err.error.violations)) {
          this.stepper().selectedIndex = lastChangedForm
        this.displayError(violation)
        }
        return of(null)
      }),
      filter(Boolean))
      .subscribe(() => {
        this.stepper().steps.forEach((step) => step.hasError = false)
      })

    this.markAsPristineForm()
  }

  private markAsPristineForm() {
    for (const step of this.leadForm) {
      step.markAsPristine()
    }
  }

  private setStepperPosition(step: number) {
    setTimeout(() => {
      for (let i = 0; i < step; i++) {
        this.stepper().next()
      }
    }, 0)
  }

  private patchForms(lead: Lead) {
    for (const group of this.leadForm) {
      group.patchValue({ ...lead })
    }
    this.markAsPristineForm()
  }

  private watchPostalCode() {
    this.addressForm.controls.postal_code.valueChanges.pipe(
      takeUntil(this.unsub$),
      debounceTime(500),
      distinctUntilChanged(),
      filter(cep => cep != null),
      filter(cep => cep.length === 8),
      exhaustMap(cep => this.leadService.searchCep(cep)),
      switchMap((response) => {
        if (response.erro) {
          this.addressForm.controls.postal_code.setErrors({ custom: { message: 'CEP inválido' } })
          return of(null)
        }
        return of(response)
      }),
      filter((response) => !!response)
    ).subscribe((response) => {
      this.addressForm.patchValue(
        {
          street: response.logradouro,
          city: response.localidade,
          state: response.uf
        }
      )
    })
  }

  private displayError(violation: Violation) {
    this.leadForm.forEach((form, index) => {
      const control = form.get(violation.propertyPath)
      if (control) {
        control.setErrors({ custom: { message: violation.title } })
        this.setStepError(index, true)
      }
    })
  }

  private setStepError(index: number, value: boolean) {
    const step = this.stepper().steps.get(index)
    if (step) {
      step.hasError = value
    }
  }
}
