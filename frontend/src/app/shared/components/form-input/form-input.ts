import { CommonModule } from '@angular/common'
import { Component, input} from '@angular/core'
import { FormControl, ReactiveFormsModule} from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input'
import { NgxMaskDirective } from 'ngx-mask'


@Component({
  selector: 'app-input',
  templateUrl: './form-input.html',
  styleUrls: ['./form-input.scss'],
  imports: [MatError, NgxMaskDirective, MatLabel, MatFormField,ReactiveFormsModule,CommonModule,MatFormFieldModule,MatInput],
})
export class FormInput {
  label = input.required<string>()
  placeholder = input<string>('')
  control = input.required<FormControl>()
  type = input<string>('text')
  mask = input<string | undefined>()
  required = input<boolean>(true)
}