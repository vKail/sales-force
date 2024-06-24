import { Routes } from "@angular/router";
import path from "path";
import { OpportunitiesLayoutComponent } from "./layout/opportunities-layout/opportunities-layout.component";
import { OpportunitiesFormPagesComponent } from "./pages/opportunities-form-pages/opportunities-form-pages.component";
import { OpportunitiesTablePagesComponent } from "./pages/opportunities-table-pages/opportunities-table-pages.component";
import { OpportunitiesUpdatePagesComponent } from "./pages/opportunities-update-pages/opportunities-update-pages.component";




export const OpportunityRoutes: Routes = [
    {
        path: '',
        component: OpportunitiesLayoutComponent,
        children: [
            {
                path: 'lists', component: OpportunitiesTablePagesComponent

            },
            {
                path: 'create', component: OpportunitiesFormPagesComponent
            },
            {
                path: 'edit/:id', component: OpportunitiesUpdatePagesComponent
            },
            {
                path: '', redirectTo: 'lists', pathMatch: 'full'
            }
        ]
    }
]