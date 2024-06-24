import { Routes } from "@angular/router";
import { TasksLayoutComponent } from "./layout/tasks-layout/tasks-layout.component";
import { TasksTablePageComponent } from "./pages/tasks-table-page/tasks-table-page.component";
import { TasksFormPageComponent } from "./pages/tasks-form-page/tasks-form-page.component";
import { TasksUpdatePageComponent } from "./pages/tasks-update-page/tasks-update-page.component";


export const TaksRoutes: Routes = [
    {
        path: '',
        component: TasksLayoutComponent,
        children: [
            {
                path: 'lists', component: TasksTablePageComponent
            },
            {
                path: 'create', component: TasksFormPageComponent
            },
            {
                path: 'edit/:id', component: TasksUpdatePageComponent
            },
            {
                path: '', redirectTo: 'lists', pathMatch: 'full'
            }
        ]
    }
];