import { Routes } from "@angular/router";
import path from "path";
import { CategoriesLayoutComponent } from "./layout/categories-layout/categories-layout.component";
import { CategoriesTablePageComponent } from "./pages/categories-table-page/categories-table-page.component";
import { CategoriesFormPageComponent } from "./pages/categories-form-page/categories-form-page.component";
import { CategoriesUpdatePageComponent } from "./pages/categories-update-page/categories-update-page.component";




export const CategoriesRoutes: Routes = [
    {
        path: '',
        component: CategoriesLayoutComponent,
        children: [
            {
                path: 'lists', component: CategoriesTablePageComponent

            },
            {
                path: 'create', component: CategoriesFormPageComponent
            },
            {
                path: 'edit/:id', component: CategoriesUpdatePageComponent
            },
            {
                path: '', redirectTo: 'lists', pathMatch: 'full'
            }
        ]
    }
]