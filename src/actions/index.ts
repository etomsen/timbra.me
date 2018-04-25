import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/rx';
import { TimbraError } from '../common/errors';

export class TimbraActions {

    static FETCH_PROFILE = 'FETCH_PROFILE';
    static FETCH_PROFILE_REMOTE = 'FETCH_PROFILE_REMOTE';
    static FETCH_PROFILE_LOCAL = 'FETCH_PROFILE_LOCAL';
    static FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
    static FETCH_PROFILE_FAILED = 'FETCH_PROFILE_FAILED';
    
    static FETCH_LOCATIONS = 'FETCH_LOCATIONS';
    static FETCH_LOCATIONS_REMOTE = 'FETCH_LOCATIONS_REMOTE';
    static FETCH_LOCATIONS_LOCAL = 'FETCH_LOCATIONS_LOCAL';
    static FETCH_LOCATIONS_SUCCESS = 'FETCH_LOCATIONS_SUCCESS';
    static FETCH_LOCATIONS_FAILED = 'FETCH_LOCATIONS_FAILED';

    static FETCH_ACTIVITIES = 'FETCH_ACTIVITIES';
    static FETCH_ACTIVITIES_REMOTE = 'FETCH_ACTIVITIES_REMOTE';
    static FETCH_ACTIVITIES_LOCAL = 'FETCH_ACTIVITIES_LOCAL';
    static FETCH_ACTIVITIES_SUCCESS = 'FETCH_ACTIVITIES_SUCCESS';
    static FETCH_ACTIVITIES_FAILED = 'FETCH_ACTIVITIES_FAILED';

    static FETCH_CHECKINS = 'FETCH_CHECKINS';
    static FETCH_CHECKINS_LOCAL = 'FETCH_CHECKINS_LOCAL';
    static FETCH_CHECKINS_REMOTE = 'FETCH_CHECKINS_REMOTE';
    static SET_CHECKINS_FILTER = 'SET_CHECKINS_FILTER';
    static FETCH_CHECKINS_SUCCESS = 'FETCH_CHECKINS_SUCCESS';
    static FETCH_CHECKINS_FAILED = 'FETCH_CHECKINS_FAILED';
    static SYNC_PENDING_CHECKINS = 'SYNC_PENDING_CHECKINS';
    static SYNC_PENDING_CHECKINS_ERROR = 'SYNC_PENDING_CHECKINS_ERROR';

    static ADD_CHECKIN_LOCAL = 'ADD_CHECKIN_LOCAL';
    static ADD_CHECKIN_LOCAL_FAILED = 'ADD_CHECKIN_LOCAL_FAILED';
    static ADD_CHECKIN_LOCAL_SUCCESS = 'ADD_CHECKIN_LOCAL_SUCCESS';

    static errCodeFromError(err: Error): string {
        return ((err instanceof TimbraError) ? err.errCode : 'unknown_error');
    }


    static fetchProfileError(err: Error): Observable<Action> {
        return Observable.of({ type: TimbraActions.FETCH_PROFILE_FAILED, payload: TimbraActions.errCodeFromError(err)});
    }

    static fetchProfileSuccess(profile: any): Observable<Action> {
        return Observable.of({ type: TimbraActions.FETCH_PROFILE_SUCCESS, payload: profile});
    }

    static fetchProfile(): Action {
        return {
            type: TimbraActions.FETCH_PROFILE,
            payload: {}
        }
    }

    static syncPendingCheckins(): Action {
        return {
            type: TimbraActions.SYNC_PENDING_CHECKINS,
            payload: {}
        }
    }

    static syncPendingCheckinsError(err: Error): Observable<Action> {
        return Observable.of({ type: TimbraActions.SYNC_PENDING_CHECKINS_ERROR, payload: TimbraActions.errCodeFromError(err)});
    }

    static fetchLocationsError(err: Error): Observable<Action> {
        return Observable.of({ type: TimbraActions.FETCH_LOCATIONS_FAILED, payload: TimbraActions.errCodeFromError(err)});
    }

    static fetchLocationsSuccess(locations: any): Observable<Action> {
        return Observable.of({ type: TimbraActions.FETCH_LOCATIONS_SUCCESS, payload: locations});
    }

    static fetchLocations(): Action {
        return {
            type: TimbraActions.FETCH_LOCATIONS,
            payload: {}
        }
    }

    static fetchActivitiesError(errCode: any): Observable<Action> {
        return Observable.of({ type: TimbraActions.FETCH_ACTIVITIES_FAILED, payload: errCode});
    }

    static fetchActivitiesSuccess(activities: any): Observable<Action> {
        return Observable.of({ type: TimbraActions.FETCH_ACTIVITIES_SUCCESS, payload: activities});
    }

    static fetchActivities(): Action {
        return {
            type: TimbraActions.FETCH_ACTIVITIES,
            payload: {}
        }
    }

    static fetchCheckins(): Action {
        return {
            type: TimbraActions.FETCH_CHECKINS,
            payload: {}
        }
    }

    static fetchCheckinsError(err: Error): Observable<Action> {
        return Observable.of({ type: TimbraActions.FETCH_CHECKINS_FAILED, payload: TimbraActions.errCodeFromError(err)});
    }

    static fetchCheckinsSuccess(checkins: any): Observable<Action> {
        return Observable.of({ type: TimbraActions.FETCH_CHECKINS_SUCCESS, payload: checkins});
    }

    static addCheckinLocal(checkin: {}): Action {
        return {
            type: TimbraActions.ADD_CHECKIN_LOCAL,
            payload: checkin
        }
    }

    static addCheckinLocalSuccess(checkin: {}): Observable<Action> {
        return Observable.of({ type: TimbraActions.ADD_CHECKIN_LOCAL_SUCCESS, payload: checkin});
    }

    static fetchCheckinsRemote(): Observable<Action> {
        return Observable.of({
            type: TimbraActions.FETCH_CHECKINS_REMOTE,
            payload: {}
        });
    }

    static addCheckinLocalError(err: Error): Observable<Action> {
        return Observable.of({ type: TimbraActions.ADD_CHECKIN_LOCAL_FAILED, payload: TimbraActions.errCodeFromError(err)});
    }

    static setCheckinFilter(filter: Date): Action {
        return {
            type: TimbraActions.SET_CHECKINS_FILTER,
            payload: filter
        }
    }


}