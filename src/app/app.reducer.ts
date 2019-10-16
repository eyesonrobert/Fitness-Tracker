// appReducer takes the old state and incoming action. remember you dispatch actions to change the store. You don't do it directly.

import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
    ui: fromUi.State;
    auth: fromAuth.State;
}

// ActionReducerMap is a map of all of the reducers we have
export const reducers: ActionReducerMap<State> = {
    ui: fromUi.UiReducer,
    auth: fromAuth.AuthReducer
};


// selectors are helper functions which help us retrieve information from our state
export const getUiState = createFeatureSelector<fromUi.State>('ui');

export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);


export const getAuthState = createFeatureSelector<fromAuth.State>('auth');

export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);


