import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/models/ingredient.models';
import { Store } from '@ngrx/store';
import  * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  shoppingForm: FormGroup;

  subscription: Subscription;
  editMode = false;
  editedIngredient: Ingredient;

  constructor(
    private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit(): void {
    this.shoppingForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    });

    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedIngredient = stateData.editedIngredient;
        this.shoppingForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(this.shoppingForm.value));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(this.shoppingForm.value));
    }

    this.onReset();
  }

  onReset() {
    this.editMode = false;
    this.shoppingForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onReset();
  }
}
