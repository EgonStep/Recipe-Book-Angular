import { Ingredient } from '../../shared/models/ingredient.models';
import * as ShoppingListActions from './shopping-list.actions';


export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: State;
}

const initialState: State = {
  ingredients: [
    {
      name: 'Apple',
      amount: 5
    },
    {
      name: 'Tomatoes',
      amount: 10
    }
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.AllowActions) {
  switch(action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state, // Copy the old state and add these properties into new data
        ingredients:  [...state.ingredients, action.payload] // ingredients is a new merged array with old and new values
      };

    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients:  [...state.ingredients, ...action.payload] // Returns the elements of the array to a new one
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[action.payload.index];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload.ingredient // Overwrite the values of ingredient if any values has changed from the payload
      };

      const updatedIngredients = [...state.ingredients];
      updatedIngredients[action.payload.index] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ingredient, ingredientIndex) => {
          return ingredientIndex !== action.payload;
        })
      };

    default:
      return state;
  }
}
