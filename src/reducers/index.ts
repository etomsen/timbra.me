import { createSelector } from 'reselect';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromLocations from './locations.reducer';
import * as fromActivities from './activities.reducer';
import * as fromCheckins from './checkins.reducer';
import * as fromProfile from './profile.reducer';

export interface TimbraAppState {
    profile: fromProfile.State,
    locations: fromLocations.State,
    activities: fromActivities.State,
    checkins: fromCheckins.State
}

const reducers = {
    profile: fromProfile.reducer,
    locations: fromLocations.reducer,
    activities: fromActivities.reducer,
    checkins: fromCheckins.reducer
};

const developmentReducer: ActionReducer<TimbraAppState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<TimbraAppState> = combineReducers(reducers);

export function reducer(state: any, action: any) {
    // return productionReducer(state, action);
    return developmentReducer(state, action);
}

export const getLocationsState = (state: TimbraAppState) => state.locations;
export const getLocationsError = createSelector(getLocationsState, fromLocations.getError);
export const getLocationsData = createSelector(getLocationsState, fromLocations.getData);
export const getLocationsLoading = createSelector(getLocationsState, fromLocations.getLoading);

export const getProfileState = (state: TimbraAppState) => state.profile;
export const getProfileError = createSelector(getProfileState, fromProfile.getError);
export const getProfileData = createSelector(getProfileState, fromProfile.getData);
export const getProfileLoading = createSelector(getProfileState, fromProfile.getLoading);


export const getActivitiesState = (state: TimbraAppState) => state.activities;
export const getActivitiesError = createSelector(getActivitiesState, fromActivities.getError);
export const getActivitiesData = createSelector(getActivitiesState, fromActivities.getData);
export const getActivitiesLoading = createSelector(getActivitiesState, fromActivities.getLoading);

export const getCheckinsState = (state: TimbraAppState) => state.checkins;
export const getCheckinsError = createSelector(getCheckinsState, fromCheckins.getError);
export const getCheckinsData = createSelector(getCheckinsState, fromCheckins.getData);
export const getCheckinsLoading = createSelector(getCheckinsState, fromCheckins.getLoading);
