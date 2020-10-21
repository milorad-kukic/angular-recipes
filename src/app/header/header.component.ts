import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {map} from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;

  isAuthenticated = false;

  private userSub: Subscription;

  constructor(private dataStorage: DataStorageService,
              private authService: AuthService,
              private store: Store<fromApp.AppState>) {}

  onSaveData() {
    this.dataStorage.storeRecipes();
  }

  onFetchData() {
    this.dataStorage.fetchRecipes();
  }
  
  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.userSub = this.store.select('auth')
      .pipe(
        map(authState=> {
          return authState.user;
        })
      )
      .subscribe(user=> {
      this.isAuthenticated = !!user;
    }); 
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
