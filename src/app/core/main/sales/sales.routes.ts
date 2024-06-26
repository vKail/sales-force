import { Routes } from "@angular/router";
import { SalesLayoutComponent } from "./layout/sales-layout/sales-layout.component";
import { SalesTablePageComponent } from "./pages/sales-table-page/sales-table-page.component";
import { SalesUpdatePageComponent } from "./pages/sales-update-page/sales-update-page.component";
import { SalesFormPageComponent } from "./pages/sales-form-page/sales-form-page.component";



export const SalesRoutes: Routes = [
    {
        path: '',
        component: SalesLayoutComponent,
        children: [
            {
                path: 'lists', component: SalesTablePageComponent
            },
            {
                path: 'create', component: SalesFormPageComponent
            },
            {
                path: 'edit/:id', component: SalesUpdatePageComponent
            },
            {
                path: '', redirectTo: 'lists', pathMatch: 'full'
            }
        ]
    }
];