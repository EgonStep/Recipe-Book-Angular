import { Recipe } from '../shared/models/recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/models/ingredient.models';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {

  private recipes: Recipe[] = [
    {
      name: 'A Test Recipe',
      description: 'This is simply a test',
      imagePath: 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
      ingredients: [
        {
          name: 'Meat',
          amount: 1
        },
        {
          name: 'Salad',
          amount: 2
        }
      ]
    },
    {
      name: 'New Recipe',
      description: 'This is a new recipe',
      imagePath: 'https://cdn.pixabay.com/photo/2017/02/15/10/39/salad-2068220_960_720.jpg',
      ingredients: [
        {
          name: 'Tomato',
          amount: 2
        },
        {
          name: 'Cheese',
          amount: 1
        }
      ]
    }
  ];

  constructor(private shoppingService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number): Recipe {
    return this.recipes.slice()[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingService.addIngredients(ingredients);
  }
}
