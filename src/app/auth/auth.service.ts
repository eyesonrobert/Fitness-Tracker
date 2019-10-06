import { User } from './user.model';
import { AuthData } from './auth-data';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';

@Injectable()

export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthentiacated = false;

    // tslint:disable-next-line:max-line-length
    constructor(private router: Router, private afauth: AngularFireAuth, private trainingService: TrainingService, private uiService: UIService, private store: Store<{ ui: fromApp.State }>) { }


    initAuthListener() {
        this.afauth.authState.subscribe(user => {
            if (user) {
                this.isAuthentiacated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthentiacated = false;
            }
        });
    }

    registerUser(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch({ type: 'START_LOADING' });

        this.afauth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });

            })
            .catch(error => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });

                this.uiService.showSnackbar(error.message, null, 3000);
            });
    }

    login(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch({ type: 'START_LOADING' });

        this.afauth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });

            })
            .catch(error => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });

                this.uiService.showSnackbar(error.message, null, 3000);
            });
    }

    logout() {
        this.afauth.auth.signOut();
    }

    isAuth() {
        return this.isAuthentiacated;
    }
}
