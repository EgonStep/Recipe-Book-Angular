import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/recipes' },
  { path: 'auth', component: AuthComponent },

  // Enable lazy loading for recipes. Only load when the user visits the recipes page
  // { path: 'recipes', loadChildren: './recipes/recipes.module.ts#RecipesModule' }, // Old Version
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(module => module.RecipesModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })], // Preload the bundles. Optimize lazy loading
  exports: [RouterModule]
})
export class AppRoutingModule { }
