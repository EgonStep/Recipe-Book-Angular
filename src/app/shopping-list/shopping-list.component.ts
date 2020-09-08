import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/models/ingredient.models';
import { ShoppingListService } from './shopping-list.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingredients: Observable<{ingredients: Ingredient[] }>;

  selectedIngredient: Ingredient;

  constructor(
    private shoppingService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  onSelect(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
