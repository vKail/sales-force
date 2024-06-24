import { Routes } from "@angular/router";
import { ClientsLayoutComponent } from "./layout/clients-layout/clients-layout.component";
import { ClientTablePageComponent } from "./pages/client-table-page/client-table-page.component";
import { ClientFormPageComponent } from "./pages/client-form-page/client-form-page.component";
import { ClientUpdatePageComponent } from "./pages/client-update-page/client-update-page.component";


export const clientsRoutes: Routes = [
    {
        path: '',
        component: ClientsLayoutComponent,
        children: [
            {
                path: 'lists', component: ClientTablePageComponent
            },
            {
                path: 'create', component: ClientFormPageComponent
            },
            {
                path: 'edit/:id', component: ClientUpdatePageComponent
            },
            {
                path: '', redirectTo: 'lists', pathMatch: 'full'
            }
        ]
    }
];