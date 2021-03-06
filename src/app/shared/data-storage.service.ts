import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';

import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    const recipe = recipes[0];

    // const data = {
    //   'name': recipe.name,
    //   'image_path': recipe.image_path,
    //   'description': recipe.description
    // }

    // this.http.post('http://localhost:8000/api/recipes/', recipe)
    //   .subscribe(
    //     response => {
    //       console.log(response);
    //     }
    //   );

    this.http.put('http://localhost:8000/api/recipes/put_all_data/', recipes)
      .subscribe(
        response => {
          console.log(response);
        }
      );

  }

  fetchRecipes() {
      return this.http.get<Recipe[]>(
          'http://localhost:8000/api/recipes/')
      .subscribe(
        recipes => {
          this.recipeService.setRecipes(recipes);
        }
      );

  }

}
