import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './app.routes'
import { MAT_DATE_LOCALE } from '@angular/material/core'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper'
import { provideEnvironmentNgxMask } from 'ngx-mask'
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter'
import { ptBR } from 'date-fns/locale'
import { provideHttpClient } from '@angular/common/http'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideEnvironmentNgxMask(),
    provideHttpClient(),
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: ptBR },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: STEPPER_GLOBAL_OPTIONS,useValue: { showError: true, displayDefaultIndicatorType: false }}
  ]
}
