import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    collapsed = true;
    @Output() itemSelected: EventEmitter<string> = new EventEmitter<string>();

    onSelect(item: string) {
       this.itemSelected.emit(item);
    }
}
