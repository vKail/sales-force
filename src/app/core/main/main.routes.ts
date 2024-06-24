import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { UsersLayoutComponent } from "./users/layout/userslayout/userslayout.component";
import { ClientsLayoutComponent } from "./clients/layout/clients-layout/clients-layout.component";


export const mainRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'users',
                loadChildren: () => import('./users/users.routes').then(m => m.usersRoutes)
            },
            {
                path: 'clients',
                loadChildren: () => import('./clients/clients.routes').then(m => m.clientsRoutes)
            },
            {
                path: 'quotas',
                loadChildren: () => import('./quotas/quotas.routes').then(m => m.QuotasRoutes)
            },
            {
                path: 'delegations',
                loadChildren: () => import('./delegations/delegations.routes').then(m => m.delegationsRoutes)
            },
            {
                path: 'tasks',
                loadChildren: () => import('./tasks/tasks.routes').then(m => m.TasksRoutes)
            },
            {
                path: 'products',
                loadChildren: () => import('./products/products.routes').then(m => m.productsRoutes)
            },
            {
                path: 'opportunities',
                loadChildren: () => import('./oportiunities/opportunities.routes').then(m => m.OpportunityRoutes)
            },
            {
                path: 'sales',
                loadChildren: () => import('./sales/sales.routes').then(m => m.SalesRoutes)
            }
        ]
        
    }
]