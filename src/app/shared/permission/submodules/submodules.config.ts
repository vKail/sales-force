// submodules.config.ts
export interface SubModule {
    id: number;
    name: string;
    description: string;
    routerLink: string;
    icon: string;
  }
  
  export interface ModuleSubModules {
    moduleId: number;
    subModules: SubModule[];
  }
  
  export const MODULES_SUBMODULES: ModuleSubModules[] = [
    {
      moduleId: 1,
      subModules: [
        { id: 1, name: 'users', description: 'Usuarios', routerLink: '/dashboard/users', icon: 'person' },
        { id: 2, name: 'products', description: 'Productos', routerLink: '/dashboard/products', icon: 'store' },
        { id: 3, name: 'clients', description: 'Clientes', routerLink: '/dashboard/clients', icon: 'person' },
        { id: 4, name: 'delegations', description: 'Delegaciones', routerLink: '/dashboard/delegations', icon: 'store' },
        { id: 5, name: 'quotas', description: 'Cuotas', routerLink: '/dashboard/quotas', icon: 'store' },
        { id: 6, name: 'sales', description: 'Facturas', routerLink: '/dashboard/sales', icon: 'store' },
        { id: 7, name: 'tasks', description: 'Tareas', routerLink: '/dashboard/tasks', icon: 'store' },
        { id: 8, name: 'opportunities', description: 'Oportunidades', routerLink: '/dashboard/opportunities', icon: 'store' },
      ]
    },
    {
      moduleId: 2,
      subModules: [
        { id: 1, name: 'users', description: 'Usuarios', routerLink: '/dashboard/users', icon: 'person' },
        { id: 2, name: 'products', description: 'Productos', routerLink: '/dashboard/products', icon: 'store' },
        { id: 3, name: 'clients', description: 'Clientes', routerLink: '/dashboard/clients', icon: 'person' },
        { id: 4, name: 'delegations', description: 'Delegaciones', routerLink: '/dashboard/delegations', icon: 'store' },
        { id: 5, name: 'quotas', description: 'Cuotas', routerLink: '/dashboard/quotas', icon: 'store' },
        { id: 6, name: 'sales', description: 'Facturas', routerLink: '/dashboard/sales', icon: 'store' },
        { id: 7, name: 'tasks', description: 'Tareas', routerLink: '/dashboard/tasks', icon: 'store' },
        { id: 8, name: 'opportunities', description: 'Oportunidades', routerLink: '/dashboard/opportunities', icon: 'store' },
      ]
    },
    {
      moduleId: 3,
      subModules: [
        { id: 2, name: 'products', description: 'Productos', routerLink: '/dashboard/products', icon: 'store' },
        { id: 3, name: 'clients', description: 'Clientes', routerLink: '/dashboard/clients', icon: 'person' },
        { id: 4, name: 'delegations', description: 'Delegaciones', routerLink: '/dashboard/delegations', icon: 'store' },
        { id: 5, name: 'quotas', description: 'Cuotas', routerLink: '/dashboard/quotas', icon: 'store' },
        { id: 6, name: 'sales', description: 'Facturas', routerLink: '/dashboard/sales', icon: 'store' },
        { id: 7, name: 'tasks', description: 'Tareas', routerLink: '/dashboard/tasks', icon: 'store' },
        { id: 8, name: 'opportunities', description: 'Oportunidades', routerLink: '/dashboard/opportunities', icon: 'store' },
      ]
    }
  ];
  