import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from '../shared/models/recipe.model';
import { Observable } from 'rxjs';
import { DataStorageService } from '../shared/services/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable()
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    private readonly dataStorageService: DataStorageService,
    private readonly recipeService: RecipeService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    const recipes = this.recipeService.getRecipes();

    if (recipes.length === 0) {
      return this.dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
