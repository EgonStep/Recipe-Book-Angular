import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Recipe } from 'src/app/shared/models/recipe.model';
import { Ingredient } from 'src/app/shared/models/ingredient.models';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

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
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    );
  }

  addToShoppingList() {
    if (!this.ingredients) {
      window.alert('Before adding to shopping list, select at least one ingredient!');
      return;
    }
    this.recipeService.addIngredientsToShoppingList(this.ingredients);
  }

  onOptionSelect(selectedIngredients: Ingredient[]) {
    this.ingredients = selectedIngredients;
  }

  onEditRecipe() {
    this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
