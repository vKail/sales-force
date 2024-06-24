import { Routes } from "@angular/router";
import { UsersLayoutComponent } from "./layout/userslayout/userslayout.component";
import { UserTablePageComponent } from "./pages/user-table-page/user-table-page.component";
import { UserFormPageComponent } from "./pages/user-form-page/user-form-page.component";
import { UserUpdatePageComponent } from "./pages/user-update-page/user-update-page.component";

export const usersRoutes: Routes = [
    {
        path: '',
        component: UsersLayoutComponent,
        children: [
            {
                path: 'lists', component: UserTablePageComponent
            },
            {
                path: 'create', component: UserFormPageComponent
            },
            {
                path: 'edit/:id', component: UserUpdatePageComponent
            },
            {
                path: '', redirectTo: 'lists', pathMatch: 'full'
            }
        ]
    }
];