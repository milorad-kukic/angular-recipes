import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuth from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'recipes';

  constructor(private store: Store<fromAuth.AppState>){}

  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
  }
}

