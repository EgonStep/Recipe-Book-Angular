import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from 'src/app/recipes/recipe.service';
import { Recipe } from '../models/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable()
export class DataStorageService {

  constructor(
    private readonly http: HttpClient,
    private readonly recipeService: RecipeService,
    private readonly authService: AuthService
  ) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.http.put( // Firebase will not generate an ID, since is a put method.
      'https://angular-backend-bee64.firebaseio.com/recipes.json',
      recipes
    ).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://angular-backend-bee64.firebaseio.com/recipes.json'
      )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients: []}; // Ensure that we return at least an empty array of ingredients.
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }
    ));
  }
}
