import { Routes } from "@angular/router";
import { DelegationsTablePageComponent } from "./pages/delegations-table-page/delegations-table-page.component";
import { DelegationsFormPageComponent } from "./pages/delegations-form-page/delegations-form-page.component";
import { DelegationsUpdatePageComponent } from "./pages/delegations-update-page/delegations-update-page.component";


export const delegationsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'lists',
                component: DelegationsTablePageComponent
            },
            {
                path: 'create', 
                component: DelegationsFormPageComponent
            }, 
            {
                path: 'edit/:id',
                component: DelegationsUpdatePageComponent
            },
            {
                 path: '', redirectTo: 'lists', pathMatch: 'full'
            }
        ]
    }
];