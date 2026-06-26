import { Routes } from '@angular/router';

export const landingRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then((m) => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then((m) => m.ContactComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pricing/pricing.component').then((m) => m.PricingComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq.component').then((m) => m.FaqComponent)
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./categories/categories.component').then((m) => m.CategoriesComponent)
  }
];

