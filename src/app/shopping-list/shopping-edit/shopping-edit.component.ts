import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import {Store} from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: false}) addToListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<{shoppingList: {ingredients: Ingredient[]}}>) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedItem = this.shoppingListService.getIngredient(index);

          this.addToListForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAddItem() {
    const ingName = this.addToListForm.value['name'];
    const ingAmount = this.addToListForm.value['amount'];
    const newIngredient = new Ingredient(ingName, ingAmount);

    if (this.editMode) {
      /* this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient); */
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(
            { index: this.editedItemIndex, 
              ingredient: newIngredient
            }
        )
      );
    } else {
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    }

    this.addToListForm.reset();
    this.editMode = false;
    this.editedItemIndex = -1;
    this.editedItem = null;
  }

  onClear() {
    this.addToListForm.reset();
    this.editMode = false;
  }

  onDelete() {
    //this.shoppingListService.deleteItem(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex));
    this.addToListForm.reset();
    this.editMode = false;
  }

}
