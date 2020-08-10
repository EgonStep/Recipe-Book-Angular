import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/models/ingredient.models';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];

  selectedIngredient: Ingredient;

  // Good practice to clean the subject when we leave the component
  private ingredientChangeSub: Subscription;

  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingService.getIngredients();

    this.ingredientChangeSub = this.shoppingService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }

  ngOnDestroy(): void {
    this.ingredientChangeSub.unsubscribe();
  }

  onSelect(index: number) {
    this.shoppingService.startedEditing.next(index);
  }
}
