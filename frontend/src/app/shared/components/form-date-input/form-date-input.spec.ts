import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormDateInput } from './form-date-input'

describe('FormDateInput', () => {
  let component: FormDateInput
  let fixture: ComponentFixture<FormDateInput>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDateInput]
    })
    .compileComponents()

    fixture = TestBed.createComponent(FormDateInput)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
