/// <reference path="../timbra.d.ts" />
//angular
import { Component, ViewChild } from '@angular/core';
//ionic
import { Platform, Events, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatePicker } from '@ionic-native/date-picker';
//3d party
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/rx';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
//mine
import { TimbraAppState, getProfileData}  from '../reducers';
import { LoginPage } from '../pages/login/login';
import { CheckinPage } from '../pages/checkin/checkin';
import { CheckinListPage } from '../pages/checkin/checkin.list';
import { ApiProvider } from '../providers/api';
import { DbService } from '../providers/db';
import { TimbraActions } from '../actions';


@Component({
  templateUrl: 'app.template.html'
})
export class MyApp {
    rootPage: any;
    @ViewChild(Nav) nav: Nav;
    public profile$: Observable<any>;
    isOffline: boolean = false;
    refreshPendings: Array<{refreshEvent: string}> = [];

    constructor(private store: Store<TimbraAppState>, statusBar: StatusBar, translate: TranslateService, splashScreen: SplashScreen, platform: Platform, public api: ApiProvider, public events: Events, public menu: MenuController) {
        translate.setDefaultLang('en');
        translate.use('it');
        platform.ready().then(() => {
            if (platform.is('cordova')) {
                statusBar.overlaysWebView(false);
                statusBar.styleDefault();
                splashScreen.hide();
            }
        });
        this.profile$ = this.store.select(getProfileData);
        this.api.isTokenExpired()
            .then((result)=>{
                if (!result.isTokenExpired){
                    this.nav.setRoot(CheckinListPage);
                } else {
                    this.nav.setRoot(LoginPage);
                }
            });
    }

    stringify(obj: any){
        return obj ? JSON.stringify(obj) : 'null';
    }

    async onMenuUpdate(){
        this.store.dispatch(TimbraActions.fetchProfile());
    }

    refreshClick(){
        this.refreshPendings.forEach(pending => {
            this.events.publish(pending.refreshEvent);
        });
        this.refreshPendings = [];
        this.isOffline = false;
    }

    ngAfterViewInit() {
        this.refreshPendings = [];
        this.isOffline = false;
        this.menu.enable(false);
        this.events.subscribe("timbra.menu.update", (obj: any) => { this.onMenuUpdate();});
        this.events.subscribe("timbra.restapi.error", (obj: any) => { this.onRestApiError(obj);});
    }

    onRestApiError(error: Array<{refreshEvent: string}>){
        if (error && (error instanceof Array) && error.length) {
            this.refreshPendings.push(error[0]);
            this.isOffline = true;
        }
    }

    openCheckin(){
        this.menu.close();
        this.nav.setRoot(CheckinPage);
    }

    openNewOperation(){
        alert("TODO");
    }

    openCheckinList(){
        this.menu.close();
        this.nav.setRoot(CheckinListPage);
    }

    openAbsenceList(){
        alert("TODO");
    }

    logout() {
        this.api.logout();
        this.menu.close();
        this.isOffline = false;
        this.refreshPendings = [];
        this.nav.setRoot(LoginPage);
    }
}
