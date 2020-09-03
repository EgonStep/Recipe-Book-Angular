import { NgModule } from '@angular/core';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { RecipeService } from '../recipes/recipe.service';
import { RecipesResolverService } from '../recipes/recipes-resolver.service';
import { DataStorageService } from '../shared/services/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth/auth-interceptor.service';
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
  providers: [
    ShoppingListService,
    RecipeService,
    RecipesResolverService,
    DataStorageService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    AuthGuard
  ]
})
export class CoreModule { }

// Core Module maintain the App's services
// Instead of using a module to track all the services.
// A better approach is to use @Injectable({providedIn: 'root'}) on each service
