import { Ingredient } from '../shared/models/ingredient.models';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ShoppingListService {

  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

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

  getIngredients() {
    return this.ingredients.slice(); // Only returns the copy of the array
  }

  getIngredient(index: number) {
    return this.ingredients[index];
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

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
