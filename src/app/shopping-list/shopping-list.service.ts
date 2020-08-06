import { Ingredient } from '../shared/models/ingredient.models';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class ShoppingListService {
  ingredientsChanged = new EventEmitter<Ingredient[]>();

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
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients); // ... is called "spread operator". When used as a function's args is called "rest operator"
    this.ingredientsChanged.emit(this.ingredients.slice());
  }
}
