import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingListService } from '../shopping-list.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/models/ingredient.models';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  shoppingForm: FormGroup;

  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedIngredient: Ingredient;

  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit(): void {
    this.shoppingForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
    });

    // For Editing Ingredient
    this.subscription = this.shoppingService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedIngredient = this.shoppingService.getIngredient(index);
        this.shoppingForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (this.editMode) {
      this.shoppingService.updateIngredient(this.editedItemIndex, this.shoppingForm.value);
    } else {
      this.shoppingService.addIngredient(this.shoppingForm.value);
    }

    this.onReset();
  }

  onReset() {
    this.editMode = false;
    this.shoppingForm.reset();
  }

  onDelete() {
    this.shoppingService.deleteIngredient(this.editedItemIndex);
    this.onReset();
  }
}
