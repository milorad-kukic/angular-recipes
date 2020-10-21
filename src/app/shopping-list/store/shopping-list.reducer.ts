import {State} from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const initialState = {

  ingredients:  [
      new Ingredient('Apples', 5),
      new Ingredient('Tomatoes', 10)
  ]
}

export function shoppingListReducer(
  state = initialState, 
  action: ShoppingListActions.ShoppingListActions
) {
  
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      const addedIngredients: Ingredient[] = action.payload as Ingredient[];
      return {
        ...state,
        ingredients: [...state.ingredients, ...addedIngredients]
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      const payload = action.payload as {index: number, ingredient: Ingredient};
      const ingredient = state.ingredients[payload.index];

      const updatedIngredient = {
        ...ingredient,
        ...payload.ingredient
      }
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[payload.index] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== action.payload;
        })
      };
    default:
      return state;

  }
}
