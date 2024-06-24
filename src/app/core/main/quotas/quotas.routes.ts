import { Routes } from "@angular/router";
import path from "path";
import { QuotasLayoutComponent } from "./layout/quotas-layout/quotas-layout.component";
import { QuotasTablePageComponent } from "./pages/quotas-table-page/quotas-table-page.component";
import { QuotasFormPageComponent } from "./pages/quotas-form-page/quotas-form-page.component";
import { QuotasUpdatePageComponent } from "./pages/quotas-update-page/quotas-update-page.component";



export const QuotasRoutes: Routes = [
    {
        path: '',
        component: QuotasLayoutComponent,
        children: [
            {
                path: 'lists', component: QuotasTablePageComponent

            },
            {
                path: 'create', component: QuotasFormPageComponent
            },
            {
                path: 'edit/:id', component: QuotasUpdatePageComponent
            },
            {
                path: '', redirectTo: 'lists', pathMatch: 'full'
            }
        ]
    }
]