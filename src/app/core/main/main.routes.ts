import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { UsersLayoutComponent } from "./users/layout/userslayout/userslayout.component";


export const mainRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'users',
                component: UsersLayoutComponent
            }
        ]
        
    }
]