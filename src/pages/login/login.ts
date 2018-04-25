import { Component, ViewChild, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
//ionic
import { LoadingController, NavController, Platform, Events, MenuController, AlertController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
//3d party
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Device } from '@ionic-native/device';
import 'web-animations-js/web-animations.min'
//timbra
import { ApiProvider } from '../../providers/api';
import { CheckinPage } from '../checkin/checkin';
import { CheckinListPage } from '../checkinlist/checkinlist';
import { AbsenceListPage } from '../absence/list';
import { NewAbsencePage } from '../absence/new';
import { TimbraError } from '../../common/errors';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    animations: [
        trigger('flyInBottomFast', [
            state('in', style({transform: 'translate3d(0,0,0)'})),
            transition('void => *', [style({transform: 'translate3d(0,2000px,0'}), animate('2000ms ease-in-out')])]),
        trigger('bounceInBottom', [
            state('in', style({transform: 'translate3d(0,0,0)'})),
            transition('void => *', [
                animate('2000ms 200ms ease-in', keyframes([
                    style({transform: 'translate3d(0,2000px,0)', offset: 0}),
                    style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
                    style({transform: 'translate3d(0,0,0)', offset: 1})
                ]))
            ])
        ]),
        trigger('fadeIn', [
            state('in', style({opacity: 1})),
            transition('void => *', [
                style({opacity: 0}),
                animate('1000ms 2000ms ease-in')
            ])
        ])
    ]

})
export class LoginPage {
    error: any;
    loginForm: FormGroup;
    logoState: any = "in";
    loginState: any = "in";
    formState: any = "in";
    submitted = false;
    translations: {[key: string]: string};

    private async checkPermissions(data: any) {
        if (!this.platform.is('android')) {
            return Promise.resolve(data);
        }
        try {
            await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA);
            return data;
        } catch (error) {
            try {
                this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.CAMERA);
                return data;
            } catch (error) {
                return Promise.reject({code: 'timbra.noCameraPermission'})
            }
        }
    }

    constructor(
            private device: Device, 
            public translate: TranslateService, 
            private events: Events, 
            private platform: Platform, 
            private menuCtrl: MenuController, 
            private loadingController: LoadingController, 
            private auth: ApiProvider, 
            private formBuilder: FormBuilder, 
            private nav: NavController, 
            private alertCtrl: AlertController,
            private androidPermissions: AndroidPermissions) {
        this.loginForm = formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        translate.get(["login.progress", "login.init_camera_error_title", "login.init_camera_error_text"]).subscribe((res: {[key: string]: string}) => {
            this.translations = res;
        });
        this.checkPermissions({}).catch(()=>{
            let alert = this.alertCtrl.create({
                title: this.translations['login.init_camera_error_title'],
                subTitle: this.translations['login.init_camera_error_text'],
                buttons: [
                    {
                        role: 'cancel',
                        text: 'OK'
                    }
                ]
            });

        });
    }

    ngAfterViewInit() {
        this.menuCtrl.enable(false);
    }

    async login(credentials: any) {
        this.error = null;
        const loader = this.loadingController.create({content: this.translations["login.progress"]});
        loader.present();
        const request = {
            username: this.loginForm.value['username'],
            password: this.loginForm.value['password'],
            deviceId: this.platform.is("cordova") ? this.device.uuid : null,
            deviceModel: this.platform.is("cordova") ? this.device.model : null,
            osVersion: this.platform.is("cordova") ? this.device.version : null
        };
        try {
            await this.auth.login(request);
            await loader.dismiss()
            this.events.publish('timbra.checkins.savependings');
            this.nav.setRoot(CheckinPage);
        } catch (error) {
            loader.dismiss();
            if (error instanceof TimbraError) {
                this.error = `login.${error.errCode}`;
            } else {
                this.error = 'login.unknown-error';
            }
        }
    }
}
