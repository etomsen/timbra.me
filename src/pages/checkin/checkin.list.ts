//angular
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
//ionic
import { LoadingController, Loading, NavController, Events, AlertController, ModalController, MenuController, Refresher } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { Geolocation } from '@ionic-native/geolocation';
//3d party
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs/rx';
import * as moment from 'moment';

//mine
import { CheckinPage } from './checkin';
import { TimbraAppState, getCheckinsData, getCheckinsLoading, getCheckinsError }  from '../../reducers';
import { TimbraActions } from '../../actions';


@Component({
  templateUrl: 'checkin.list.html'
})
export class CheckinListPage {
    translations: {[key: string]: string} = {};
    title: string = '';
    loading: Loading;
    refresher: Refresher;
    public filter = new Date();
    public items$: Observable<any[]>;
    public error$: Observable<string>;
    public loading$: Observable<boolean>;

    constructor(private loadingCtrl: LoadingController, private datePicker: DatePicker, public menuCtrl: MenuController, public translate: TranslateService, public modalCtrl: ModalController, public alertCtrl: AlertController, public nav: NavController, public events: Events, private store: Store<TimbraAppState>) {
        this.items$ = this.store.select(getCheckinsData);
        this.error$ = this.store.select(getCheckinsError);
        this.loading$ = this.store.select(getCheckinsLoading);
        this.loading = this.loadingCtrl.create({content: this.translations["checkinlist.progress"]});
        this.loading$.subscribe(this.onLoading)
    }

    private onLoading = (value: any) => {
        if (!value){
            if (this.refresher) {
                this.refresher.complete();
            }
            this.loading.dismiss();
        }
    }

    public onDateFilterClick(){
        //TODO: testing only
        this.loading.present();
        this.filter = new Date('2017-01-10')
        this.store.dispatch(TimbraActions.setCheckinFilter(this.filter));
        return;
        // this.datePicker.show({
        //     date: this.filter,
        //     mode: 'date'
        // }).then(
        //     date => {
        //         this.filter = date;
        //         this.store.dispatch(this.actions.setCheckinFilter(date));
        //     },
        //     err => console.log('Error occurred while getting date: ', err)
        // );
    }

    public onAddClick(event: Event){
        if (event) {
            event.preventDefault();
        }
        this.nav.push(CheckinPage);
    }

    getTitle(): string{
        if (moment(this.filter).dayOfYear() === moment().dayOfYear()) {
            return this.translations['checkinlist.title_today'];
        } else {
            return moment(this.filter).format('DD/MM/YYYY');;
        }
    }

    async doRefresh(refresher: Refresher){
        if (!this.refresher && refresher) {
            this.refresher = refresher;
        }
        this.store.dispatch(TimbraActions.setCheckinFilter(this.filter));
    }

    async ionViewWillEnter() {
        this.translations = await this.translate.get([
            'checkinlist.title_today',
            'checkinlist.progress'
        ]).toPromise();
        this.title = this.getTitle();
        this.events.publish('timbra.menu.update');
        this.menuCtrl.enable(true);
    }

    public itemTapped(event: any, item: any){

    }
}
