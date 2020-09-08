import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/models/ingredient.models';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingredients: Observable<{ingredients: Ingredient[] }>;

  selectedIngredient: Ingredient;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  onSelect(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
