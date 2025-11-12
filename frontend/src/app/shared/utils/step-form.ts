import { Lead } from "../../features/lead/lead.model"
import { Violation } from "../shared.types"
import { FormControl, FormGroup } from "@angular/forms"
import { StepperController } from "./stepper-controller"

type FormGroupValue<T> = T extends FormGroup<infer Controls>
  ? { [K in keyof Controls]: Controls[K] extends FormControl<infer V> ? V : never }
  : never;

type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

export class StepForm<T extends readonly FormGroup[]> {
    steps: T
    private stepperController: StepperController
    constructor(forms: T, stepperController: StepperController) {
        this.steps = forms
        this.stepperController = stepperController
    }

    patchForms(lead: Lead) {
        for (const group of this.steps) {
            group.patchValue({ ...lead })
        }
        this.markAsPristineForm()
    }

    markAsPristineForm() {
        for (const step of this.steps) {
            step.markAsPristine()
        }
    }

    getRawValue(): UnionToIntersection<FormGroupValue<T[number]>> {
        return Object.assign({}, ...this.steps.map(f => f.getRawValue()));
    } 

    handleInputErrors(violations: Violation[], errorIndex: number) {
        for (const violation of violations) {
            this.stepperController.goTo(errorIndex)
            this.displayError(violation)
        }
    }

    private displayError(violation: Violation) {
        this.steps.forEach((form, index) => {
            const control = form.get(violation.propertyPath)
            if (control) {
                control.setErrors({ custom: { message: violation.title } })
                this.stepperController.setStepError(index, true)
            }
        })
    }

    get lastChangedStep(): number {
        return this.steps.map(g => g.dirty).lastIndexOf(true);
    }

    resetForm() {
        this.steps.forEach((form) => form.reset())
    }
}