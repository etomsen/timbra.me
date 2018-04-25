import { Injectable } from '@angular/core';
// 3d party
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/rx';
import { Store } from '@ngrx/store';
import * as _pick from 'lodash.pick';
//timbra
import { TimbraActions} from '../actions';
import { ApiProvider } from  "../providers/api";
import { DbService } from  "../providers/db";
import { TimbraAppState } from  "../reducers";

@Injectable()
export class TimbraEffects {
 
    constructor(private db: DbService, private actions$: Actions, private api: ApiProvider, private store$: Store<TimbraAppState>){
    }

    private fetchLocations = () => {
        return this.actions$.ofType(TimbraActions.FETCH_LOCATIONS)
            .mergeMap(() => ([
                {type: TimbraActions.FETCH_LOCATIONS_LOCAL},
                {type: TimbraActions.FETCH_LOCATIONS_REMOTE},
            ]));
    }

    private fetchLocationsRemote = () => {
        return this.actions$.ofType(TimbraActions.FETCH_LOCATIONS_REMOTE).mergeMap(() => 
            Observable.fromPromise(this.api.getUserLocations())
            .switchMap((locations, index) => {
                this.db.addLocations(locations);
                return TimbraActions.fetchLocationsSuccess(locations);
            })
            .catch((err) => TimbraActions.fetchLocationsError(err))
        );
    }

    private fetchLocationsLocal = () => {
        return this.actions$.ofType(TimbraActions.FETCH_LOCATIONS_LOCAL).mergeMap(() =>
            Observable.fromPromise(this.db.getLocations())
            .switchMap(locations => TimbraActions.fetchLocationsSuccess(locations))
            .catch((err) => TimbraActions.fetchLocationsError(err))
        );
    }

    private fetchProfile = () => {
        return this.actions$.ofType(TimbraActions.FETCH_PROFILE)
            .mergeMap(() => ([
                {type: TimbraActions.FETCH_PROFILE_LOCAL},
                {type: TimbraActions.FETCH_PROFILE_REMOTE},
            ]));
    }

    private fetchProfileRemote = () => {
        return this.actions$.ofType(TimbraActions.FETCH_PROFILE_REMOTE).mergeMap(() => 
            Observable.fromPromise(this.api.getUserProfile())
            .switchMap((profile, index) => {
                this.db.addProfile(profile);
                return TimbraActions.fetchProfileSuccess(profile);
            })
            .catch(err => TimbraActions.fetchProfileError(err))
        );
    }

    private fetchProfileLocal = () => {
        return this.actions$.ofType(TimbraActions.FETCH_PROFILE_LOCAL).mergeMap(() =>
            Observable.fromPromise(this.db.getProfile())
            .switchMap(profile => TimbraActions.fetchProfileSuccess(profile))
            .catch((err) => TimbraActions.fetchProfileError(err))
        );
    }

    private fetchActivities = () => {
        return this.actions$.ofType(TimbraActions.FETCH_ACTIVITIES)
            .mergeMap(() => ([
                {type: TimbraActions.FETCH_ACTIVITIES_LOCAL},
                {type: TimbraActions.FETCH_ACTIVITIES_REMOTE},
            ]));
    }

    private fetchActivitiesRemote = () => {
        return this.actions$.ofType(TimbraActions.FETCH_ACTIVITIES_REMOTE).mergeMap(() =>
            Observable.fromPromise(this.api.getUserActivities())
            .switchMap(activities => {
                this.db.addActivities(activities);
                return TimbraActions.fetchActivitiesSuccess(activities);
            })
            .catch((err) => TimbraActions.fetchActivitiesError(err))
        );
    }

    private fetchActivitiesLocal = () => {
        return this.actions$.ofType(TimbraActions.FETCH_ACTIVITIES_LOCAL).mergeMap(() =>
            Observable.fromPromise(this.db.getActivities())
            .switchMap(activities => TimbraActions.fetchActivitiesSuccess(activities))
            .catch((err) => TimbraActions.fetchActivitiesError(err))
        );
    }

    private fetchCheckins = () => {
        return this.actions$.ofType(TimbraActions.FETCH_CHECKINS)
            .mergeMap(() => ([
                {type: TimbraActions.FETCH_CHECKINS_LOCAL},
                {type: TimbraActions.FETCH_CHECKINS_REMOTE},
            ]));
    }

    private setFilter = () => {
        return this.actions$.ofType(TimbraActions.SET_CHECKINS_FILTER)
            .switchMap(() => Observable.of({ type: TimbraActions.FETCH_CHECKINS, payload: {}}));
    }

    private fetchCheckinsRemote = () => {
        return this.actions$.ofType(TimbraActions.FETCH_CHECKINS_REMOTE)
            .withLatestFrom(this.store$.select(state => state.checkins.filter))
            .mergeMap((value, index) => Observable
                .from(this.api.getUserCheckins(value[1]))
                .switchMap(checkins => this.db.setCheckins(value[1], checkins))
                .switchMap(() => this.db.getCheckins(value[1]))
                .switchMap(checkins => TimbraActions.fetchCheckinsSuccess(checkins))
                .catch(err => {
                    return TimbraActions.fetchCheckinsError(err);
                })
            );
    }

    private fetchCheckinsLocal = () => {
        return this.actions$.ofType(TimbraActions.FETCH_CHECKINS_LOCAL)
        .withLatestFrom(this.store$.select(state => state.checkins.filter))
        .mergeMap((value, index) =>
            Observable.fromPromise(this.db.getCheckins(value[1]))
            .switchMap(checkins => TimbraActions.fetchCheckinsSuccess(checkins))
            .catch((err) => TimbraActions.fetchCheckinsError(err))
        );
    }

    private addCheckinLocal = () => {
        return this.actions$.ofType(TimbraActions.ADD_CHECKIN_LOCAL)
        .mergeMap(action =>
            Observable.fromPromise(this.db.addPendingCheckin(action.payload))
                .switchMap((checkin: any) => TimbraActions.addCheckinLocalSuccess(checkin))
                .catch((err) => TimbraActions.addCheckinLocalError(err))
        );
    }

    private addCheckinLocalSuccess = () => {
        return this.actions$.ofType(TimbraActions.ADD_CHECKIN_LOCAL_SUCCESS).switchMap(() => 
            Observable.of({ type: TimbraActions.FETCH_CHECKINS, payload: {}}));
    }

    private syncPendingCheckins = () => {
        return this.actions$.ofType(TimbraActions.SYNC_PENDING_CHECKINS)
        .mergeMap(action =>
            Observable.fromPromise(this.db.getPendingCheckins())
                .switchMap((checkins: any[]) => this.api.savePendingCheckins(checkins))
                .switchMap(() => TimbraActions.fetchCheckinsRemote())
                .catch((err) => TimbraActions.addCheckinLocalError(err))
        );
    }

    @Effect() addCheckinLocalSuccess$ = this.addCheckinLocalSuccess();
    @Effect() addCheckinLocal$ = this.addCheckinLocal();

    @Effect() fetchLocations$ = this.fetchLocations();
    @Effect() fetchLocationsRemote$ = this.fetchLocationsRemote();
    @Effect() fetchLocationsLocal$ = this.fetchLocationsLocal();

    @Effect() fetchProfile$ = this.fetchProfile();
    @Effect() fetchProfileRemote$ = this.fetchProfileRemote();
    @Effect() fetchProfileLocal$ = this.fetchProfileLocal();


    @Effect() fetchActivities$ = this.fetchActivities();
    @Effect() fetchActivitiesRemote$ = this.fetchActivitiesRemote();
    @Effect() fetchActivitiesLocal$ = this.fetchActivitiesLocal();

    @Effect() fetchCheckins$ = this.fetchCheckins();
    @Effect() syncPendingCheckins$ = this.syncPendingCheckins();
    @Effect() fetchCheckinsRemote$ = this.fetchCheckinsRemote();
    @Effect() fetchCheckinsLocal$ = this.fetchCheckinsLocal();
    @Effect() setFilter$ = this.setFilter();
}
