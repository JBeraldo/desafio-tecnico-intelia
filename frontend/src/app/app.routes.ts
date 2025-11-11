import { Routes } from '@angular/router'
import { MainLayout } from './layouts/main-layout/main-layout'
import { LEAD_ROUTES } from './features/lead/lead.routes'

export const routes: Routes = [
    {
        path: '', component: MainLayout, children: LEAD_ROUTES
    }
]
