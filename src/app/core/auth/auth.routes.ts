import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout-component/layout.component";
import { LoginComponent } from "./pages/login/login.component";


export const authRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'login', component: LoginComponent,
            },
            { 
                path: '**', redirectTo: 'login' 
            }
        ]
    }
];