import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SpinnerComponent} from '../spinner/spinner.component';
import {DropDownDirective} from './dropdown-directive';

@NgModule({
  declarations: [
    DropDownDirective,
    SpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    DropDownDirective,
    SpinnerComponent
  ]

})
export class SharedModule {

}
