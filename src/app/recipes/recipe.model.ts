import { Ingredient } from '../shared/ingredient.model';
export class Recipe {
  public name: string;
  public description: string;
  public image_path: string;

  public ingredients: Ingredient[];

  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[]) {
    this.name = name;
    this.description = desc;
    this.image_path = imagePath;
    this.ingredients = ingredients;
  }
}
