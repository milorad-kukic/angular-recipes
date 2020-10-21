import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {

  ingredients:  [
      new Ingredient('Apples', 5),
      new Ingredient('Tomatoes', 10)
  ],

  editedIngredient: null,
  editedIngredientIndex: -1
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
      /* const payload = action.payload as Ingredient; */
      const ingredient = state.ingredients[state.editedIngredientIndex];

      const updatedIngredient = {
        ...ingredient,
        ...action.payload,
        editedIngredient: null,
        editedIngredientIndex: -1
      }
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== state.editedIngredientIndex;
        }),
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.START_EDIT_INGREDIENT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: {...state.ingredients[action.payload]}
      }
    case ShoppingListActions.STOP_EDIT_INGREDIENT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      }
    default:
      return state;

  }
}
