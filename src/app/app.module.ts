// angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// ionic
import { IonicApp, IonicModule } from 'ionic-angular';
import {IonicStorageModule} from '@ionic/Storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Device } from '@ionic-native/device';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { DatePicker } from '@ionic-native/date-picker';
import { AndroidPermissions } from '@ionic-native/android-permissions';


// 3-d party
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core'
import { AuthHttp } from 'angular2-jwt';
import * as moment from 'moment';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';


//react
import { reducer } from '../reducers';
import { TimbraEffects } from '../effects';


//mine
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { CheckinPage } from '../pages/checkin/checkin';
import { CheckinListPage } from '../pages/checkin/checkin.list';
import { LocationsModal } from '../pages/modals/locations';
import { ActivitiesModal } from '../pages/modals/activities';
import { Helper } from '../providers/helper';
import { ApiProvider } from '../providers/api'
import { DbService } from '../providers/db';
import { HasFooterDirective } from '../directives/has-footer';
import { PaddingTopDirective } from '../directives/padding-top';
import { TimbraMissingTranslationHandler } from "./translation";


export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
moment.relativeTimeThreshold('d', 366);
moment.locale('it');

export function instrumentOptions() {
  return {
    monitor: useLogMonitor({ visible: true, position: 'right' })
  };
}

@NgModule({
    declarations: [
        MyApp,
        HasFooterDirective,
        PaddingTopDirective,
        LoginPage,
        CheckinPage,
        CheckinListPage,
        LocationsModal,
        ActivitiesModal
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        BrowserModule,
        HttpModule,
        BrowserAnimationsModule,
        EffectsModule.run(TimbraEffects),
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentStore(instrumentOptions),
        StoreLogMonitorModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [Http]
            },
            missingTranslationHandler: {
                provide: MissingTranslationHandler,
                useClass: TimbraMissingTranslationHandler
            }
        }),
        IonicModule.forRoot(MyApp, {
            backButtonText: 'Indietro'
        }),
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginPage,
        CheckinPage,
        CheckinListPage,
        LocationsModal,
        ActivitiesModal
    ],
    providers: [
        DatePicker,
        AndroidPermissions,
        Geolocation,
        SplashScreen,
        StatusBar,
        Diagnostic,
        Device,
        ApiProvider,
        DbService,
        Helper,
        {
            provide: AuthHttp,
            useFactory: Helper.httpAuthFactory,
            deps: [Http]
        }
    ]
})
export class AppModule {}
