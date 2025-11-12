import { viewChild, Component, inject, OnDestroy, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
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
import { HttpError, ValidationErrorResponse } from '../../../shared/shared.types'
import { MatIconModule } from '@angular/material/icon';
import { StepperController } from '../../../shared/utils/stepper-controller'
import { StepForm } from '../../../shared/utils/step-form'
import { LeadFormBuilder } from '../utils/lead-form-builder'
@Component({
  selector: 'app-lead-form',
  imports: [MatCardModule, MatButtonModule, MatStepperModule, ReactiveFormsModule, FormsModule, CommonModule, FormInput, FormDateInput, MatIconModule],
  templateUrl: './lead-form.html',
  styleUrl: './lead-form.scss',
})
export class LeadForm implements OnInit, OnDestroy {
  private breakpoint = inject(BreakpointObserver)
  private leadService = inject(LeadService)
  private lead$: Observable<Lead | null>
  private stepper = viewChild.required(MatStepper)
  private stepperController = new StepperController(this.stepper);

  private formBuilder = inject(LeadFormBuilder);

  personalForm = this.formBuilder.personal();
  addressForm = this.formBuilder.address();
  contactForm = this.formBuilder.contact();

  private readonly unsub$ = new Subject<void>()
  private stepForm = new StepForm([this.personalForm, this.addressForm, this.contactForm], this.stepperController)

  stepperOrientation$: Observable<StepperOrientation>
  constructor() {
    this.lead$ = this.leadService.lead$
    this.stepperOrientation$ = this.breakpoint
      .observe('(min-width: 800px)')
      .pipe(takeUntil(this.unsub$), map(({ matches }) => (matches ? 'horizontal' : 'vertical')))
  }

  ngOnInit(): void {
    this.lead$.pipe(takeUntil(this.unsub$), filter(Boolean)).subscribe((lead) => {
      this.stepForm.patchForms(lead)
    })

    if (!this.leadService.uuid) {
      this.watchPostalCode();
      return;
    }

    this.leadService.get()
      .pipe(takeUntil(this.unsub$))
      .subscribe((response) => {
        this.stepperController.restorePosition(response.lead.step ?? 0)
        this.watchPostalCode();
      });
  }

  ngOnDestroy(): void {
    this.unsub$.next()
    this.unsub$.complete()
  }

  next() {
    const lastChangedForm = this.stepForm.lastChangedStep
    if (lastChangedForm != -1) {
      this.submit(lastChangedForm)
    }
  }

  private submit(lastChangedForm: number) {
    const leadFormData: Lead = {
      ...this.stepForm.getRawValue(),
      step: lastChangedForm,
      uuid: this.leadService.uuid
    }

    const response$ = leadFormData.uuid
      ? this.leadService.update(leadFormData)
      : this.leadService.store(leadFormData)

    response$.pipe(
      takeUntil(this.unsub$),
      catchError((err: HttpError<ValidationErrorResponse>) => {
        this.stepForm.handleInputErrors(err.error.violations, lastChangedForm)
        return of(null)
      }),
      filter(Boolean))
      .subscribe(() => {
        this.stepper().steps.forEach((step) => step.hasError = false)
      })

    this.stepForm.markAsPristineForm()
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

  resetForm() {
    this.stepperController.reset()
    this.leadService.discartLead()
    this.stepForm.resetForm()
  }
}
