import { Component, Renderer } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { LoadingController, Platform, Loading, NavController, Events, AlertController, ModalController, MenuController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { UUID } from 'angular2-uuid';

import { ApiProvider } from '../../providers/api';
import { DbService } from '../../providers/db';
import { LoginPage } from '../login/login';
import { CheckinListPage } from './checkin.list';
import { LocationsModal } from '../modals/locations';
import { ActivitiesModal } from '../modals/activities';
import { TimbraError } from "../../common/errors";
import { TimbraAppState }  from '../../reducers';
import { TimbraActions } from '../../actions';
import { PendingCheckin } from '../../common';


@Component({
    selector: 'page-checkin',
    templateUrl: 'checkin.html',
})
export class CheckinPage {
    form: FormGroup;
    activity: any;
    location: any;
    inOut: boolean;
    translations: {[key: string]: string};


    constructor(public renderer: Renderer, private geolocation: Geolocation, public translate: TranslateService, public platform: Platform, public menuCtrl: MenuController, public modalCtrl: ModalController, public loadCtrl: LoadingController, public alertCtrl: AlertController, public nav: NavController, public events: Events, public formBuilder: FormBuilder, private store: Store<TimbraAppState>) {
        this.form = formBuilder.group({
            activity: ['', Validators.required],
            location: ['', Validators.required],
            inOut: [null, Validators.required]
        });
        translate.get([
            "ckeckin.progress",
            "checkin.ok_btn",
            "checkin.result.title",
            "checkin.result.in_out",
            "checkin.result.date",
            "checkin.result.activity",
            "checkin.result.area",
            "checkin.result.location",
            "checkin.result.in",
            "checkin.result.out",
            "checkin.error_title",
            "checkin.error.checkin__location_check_failed",
            "checkin.error_new_pending"
        ]).subscribe((res: {[key: string]: string}) => {this.translations = res;});
    }

    showLocationModal(event: Event) {
        this.renderer.invokeElementMethod(event.target, "blur");
        if (event) {
            event.preventDefault();
        }
        let modal = this.modalCtrl.create(LocationsModal);
        modal.onDidDismiss((value: any) => {
            if (value) {
                this.form.patchValue({'location': `${value.location.area.description}: ${value.location.description}`});
                this.location = value;
            }
        });
        modal.present();
    }

    public submit(event: Event){

    }

    public cancel(event: Event){
        if (this.nav.canGoBack()){
            this.nav.pop();
        } else {
            this.nav.setRoot(CheckinListPage);
        }
    }

    showActivityModal(event: Event) {
        this.renderer.invokeElementMethod(event.target, "blur");
        if (event) {
            event.preventDefault();
        }
        const modal = this.modalCtrl.create(ActivitiesModal);
        modal.onDidDismiss((value: any) => {
            if (value) {
                this.form.patchValue({'activity': value.activity.description});
                this.activity = value;
            }
        });
        modal.present();
    }

    onInOutClick(event: Event, value: boolean){
        if (event) {
            event.preventDefault();
        }
        this.form.patchValue({'inOut': value});
    }

    public async send(event: Event){
        if (event) {
            event.preventDefault();
        }
        
        let request: PendingCheckin = {
            id: UUID.UUID(),
            activity: {
                id: this.activity.activityId,
                description: this.activity.activity.description
            },
            location: {
                id: this.location.locationId,
                description: this.location.location.description,
                area:{
                    description: this.location.location.area.description
                },
            },
            date: new Date(),
            in: this.form.value['inOut']
        }
        try {
            const pos = await this.geolocation.getCurrentPosition();
            request.position = {
                lat: +pos.coords.latitude,
                lon: +pos.coords.longitude
            };
        } catch (error) {
            console.log('Unable to get location');
        }
        this.store.dispatch(TimbraActions.addCheckinLocal(request));
        this.showNewCheckinAlert(request);
    }

    showNewCheckinAlert(request: PendingCheckin){
        let msg = `
        <ul class="leaders">
            <li>
                <span>${this.translations["checkin.result.in_out"]}</span>
                <span>${request.in ? this.translations["checkin.result.in"] : this.translations["checkin.result.out"]}</span>
            </li>
            <li>
                <span>${this.translations["checkin.result.date"]}</span>
                <span>${moment(request.date).format('DD/MM/YYYY HH:mm')}</span>
            </li>
            <li>
                <span>${this.translations["checkin.result.activity"]}</span>
                <span>${request.activity.description}</span>
            </li>
            <li>
                <span>${this.translations["checkin.result.area"]}</span>
                <span>${request.location.area.description}</span>
            </li>
            <li>
                <span>${this.translations["checkin.result.location"]}</span>
                <span>${request.location.description}</span>
            </li>
        </ul>`;
        let self = this;
        let alert = this.alertCtrl.create({
            title: this.translations["checkin.result.title"],
            message: msg,
            buttons: [
            {
                role: 'cancel',
                text: "OK",
                handler: (data) => {
                    self.nav.setRoot(CheckinListPage);
                    return true;
                }
            }
            ]
        });
        alert.present(alert);
    }


    ngAfterViewInit() {
        this.events.publish("timbra.menu.update");
        this.menuCtrl.enable(true);
    }
}