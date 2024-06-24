import { Routes } from "@angular/router";
import { ProductLayoutComponent } from "./layout/layout/layout.component";
import { ProductCreatePageComponent } from "./pages/product-create-page/product-create-page.component";
import { ProductUpdatePageComponent } from "./pages/product-update-page/product-update-page.component";
import { ProductTableComponent } from "./pages/product-table/product-table.component";


export const productsRoutes: Routes = [
    {
        path: '',
        component: ProductLayoutComponent,
        children: [
            {
                path: 'lists', component: ProductTableComponent,
            },
            {
                path: 'create', component: ProductCreatePageComponent,
            },
            {
                path: 'edit/:id', component: ProductUpdatePageComponent,
            },
            {
                path: '', redirectTo: 'lists', pathMatch: 'full',
            }
            
        ]
    }
]