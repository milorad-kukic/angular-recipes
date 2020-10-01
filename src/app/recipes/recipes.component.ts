import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [RecipeService]
})
export class RecipesComponent implements OnInit {

  selectedRecipe: Recipe;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    // const id: number = +this.route.snapshot.paramMap['id'];
    // this.selectedRecipe = this.recipeService.getRecipeById(id);

    // this.route.params
    //   .subscribe(
    //     (params: Params) => {
    //       let id: number = +params['id'];
    //       this.selectedRecipe = this.recipeService.getRecipeById(id);
    //     } 
    //   )

    // this.recipeService.recipeSelected
    //   .subscribe(
    //     (recipe: Recipe) => {
    //       this.selectedRecipe = recipe;
    //     }
    //   );
  }

}
