import { Ingredient } from '../shared/models/ingredient.models';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ShoppingListService {

  ingredientsChanged = new Subject<Ingredient[]>();

  private ingredients: Ingredient[] = [
    {
      name: 'Apple',
      amount: 5
    },
    {
      name: 'Tomatoes',
      amount: 10
    }
  ];

  getIngredientes() {
    return this.ingredients.slice(); // Only returns the copy of the array
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);

    // Subject use next() to send new values
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients); // ... is called "spread operator". When used as a function's args is called "rest operator"
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
