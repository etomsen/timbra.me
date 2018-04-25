//angular
import { Component, ChangeDetectionStrategy } from '@angular/core';
//ionic
import {ViewController, LoadingController, NavController, NavParams, Refresher}  from 'ionic-angular';
//3d party
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/rx';
//timbra
import { TimbraAppState, getLocationsData, getLocationsError, getLocationsLoading }  from '../../reducers';
import { TimbraActions } from '../../actions';

@Component({
    selector: 'page-locations',
    templateUrl: "locations.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsModal {
    public items$: Observable<any[]>;
    public error$: Observable<string>;
    public loading$: Observable<boolean>;
    private refresher: Refresher;

    constructor(private store: Store<TimbraAppState>, public inputData: NavParams, public viewCtrl: ViewController) {
        this.items$ = this.store.select(getLocationsData);
        this.error$ = this.store.select(getLocationsError);
        this.loading$ = this.store.select(getLocationsLoading);
        this.loading$.subscribe((value) => {
            if (!value && this.refresher) {
                this.refresher.complete();
            }
        });
    }

    doRefresh(refresher: any){
        this.store.dispatch(TimbraActions.fetchLocations());
        if (refresher) {
            this.refresher = refresher;
        }
    }

    ionViewWillEnter() {
        this.doRefresh(null);
    }

    itemSelected(item: any) {
        this.viewCtrl.dismiss(item);
    }

    close() {
        this.viewCtrl.dismiss();
    }
}