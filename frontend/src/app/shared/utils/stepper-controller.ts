import { MatStepper } from '@angular/material/stepper';

/**
 * A helper class to manage MatStepper logic outside of a component.
 */
export class StepperController {
  constructor(private getStepper: () => MatStepper) {}

  /**
   * Move the stepper to the next step.
   */
  next(): void {
    const stepper = this.getStepper();
    if (stepper.selectedIndex < stepper.steps.length - 1) {
      stepper.next();
    }
  }

  /**
   * Move the stepper to a specific step index.
   */
  goTo(index: number): void {
    if (index >= 0 && index < this.getStepper().steps.length) {
      this.getStepper().selectedIndex = index;
    }
  }

  /**
   * Set a step as error or not.
   */
  setStepError(index: number, hasError: boolean): void {
    const step = this.getStepper().steps.get(index);
    if (step) {
      step.hasError = hasError;
    }
  }

  /**
   * Move to a saved step position (async safe for OnInit).
   */
  restorePosition(savedIndex: number): void {
    setTimeout(() => {
      for (let i = 0; i < savedIndex; i++) {
        this.next();
      }
    }, 0);
  }

  /**
   * Clear all step errors.
   */
  clearErrors(): void {
    this.getStepper().steps.forEach((step) => {
      (step as any).hasError = false;
    });
  }

  reset(){
    this.getStepper().reset()
  }
}
