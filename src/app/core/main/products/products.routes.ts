import { Routes } from "@angular/router";
import { ProductLayoutComponent } from "./layout/layout/layout.component";


export const productsRoutes: Routes = [
    {
        path: '',
        component: ProductLayoutComponent,
        children: [
            {
                path: 'products', component: ProductLayoutComponent,
                

            }
        ]
    }
]