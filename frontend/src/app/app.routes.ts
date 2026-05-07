import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/plats', pathMatch: 'full' },
  {
    path: 'plats',
    loadComponent: () => import('./components/plats/plats.component').then(m => m.PlatsComponent)
  },
  {
    // Route pour la page détail d'un plat
    path: 'plats/:id',
    loadComponent: () => import('./components/plats/plat-detail/plat-detail.component').then(m => m.PlatDetailComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'commandes',
    loadComponent: () => import('./components/commandes/commandes.component').then(m => m.CommandesComponent)
  },
  {
    path: 'panier',
    loadComponent: () => import('./components/panier/panier.component').then(m => m.PanierComponent)
  }
];