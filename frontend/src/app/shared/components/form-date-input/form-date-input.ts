import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { format } from 'date-fns';

@Component({
  selector: 'app-date-input',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDateFnsModule,
  ],
  templateUrl: './form-date-input.html',
})
export class FormDateInput {
  label = input.required<string>();
  placeholder = input<string>('DD/MM/YYYY');
  control = input.required<FormControl>();
  required = input<boolean>(false);

   onDateChange(event: any) {
    const date = event.value;
    if (date instanceof Date) {
      const formatted = format(date, 'yyyy-MM-dd');
      this.control().setValue(formatted, { emitEvent: true });
    } else {
      this.control().setValue(null);
    }
  }
}