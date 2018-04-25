import { Component, ChangeDetectionStrategy } from '@angular/core';
//ionic
import {ViewController, LoadingController, NavController, NavParams, Refresher}  from 'ionic-angular';
//3d party
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/rx';
//timbra
import { TimbraAppState, getActivitiesData, getActivitiesLoading, getActivitiesError }  from '../../reducers';
import { TimbraActions } from '../../actions';


@Component({
    templateUrl: "activities.html"
})
export class ActivitiesModal {    
    public items$: Observable<any[]>;
    public error$: Observable<string>;
    public loading$: Observable<boolean>;
    private userId: string;
    private refresher: Refresher;

    constructor(private store: Store<TimbraAppState>, public inputData: NavParams, public viewCtrl: ViewController) {
        this.userId = inputData.get('userId');
        this.items$ = this.store.select(getActivitiesData);
        this.error$ = this.store.select(getActivitiesError);
        this.loading$ = this.store.select(getActivitiesLoading);
        this.loading$.subscribe((value) => {
            if (!value && this.refresher) {
                this.refresher.complete();
            }
        });
    }

    doRefresh(refresher?: Refresher) {
        this.store.dispatch(TimbraActions.fetchActivities());
        if (refresher) {
            this.refresher = refresher;
        }
    }

    ionViewWillEnter() {
        this.doRefresh();
    }
        
    itemSelected(item: any) {
        this.viewCtrl.dismiss(item);
    }

    close() {
        this.viewCtrl.dismiss();
    }
}