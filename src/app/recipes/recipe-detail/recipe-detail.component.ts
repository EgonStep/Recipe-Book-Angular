import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { Ingredient } from 'src/app/shared/models/ingredient.models';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import { map, switchMap } from 'rxjs/operators';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;

  private ingredients: Ingredient[];
  selectManager: string;
  managerItems: SelectItem[] = [
    {
      label: 'Add Ingredientes to Shopping List',
      value: 'add'
    },
    {
      label: 'Edit Recipe',
      value: 'edit'
    },
    {
      label: 'Delete Recipe',
      value: 'delete'
    }
  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => {
        return +params['id'];
      }),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })
    )
    .subscribe(recipe => {
      this.recipe = recipe;
      }
    );
  }

  addToShoppingList() {
    if (!this.ingredients) {
      window.alert('Before adding to shopping list, select at least one ingredient!');
      return;
    }
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.ingredients));
  }

  onOptionSelect(selectedIngredients: Ingredient[]) {
    this.ingredients = selectedIngredients;
  }

  onEditRecipe() {
    this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDelete() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
