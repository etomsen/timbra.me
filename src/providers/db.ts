import { Injectable } from '@angular/core';
import { Storage } from '@ionic/Storage';
import {omit as _omit, pick as _pick, values as _values} from 'lodash';
import * as moment from 'moment';
import { TimbraError } from '../common/errors';
import { PendingCheckin } from '../common';

const PROFILE_KEY: string = 'profile';
const ACTIVITIES_KEY: string = 'activities';
const LOCATIONS_KEY: string = 'locations';
const CHECKINS_KEY: string = 'checkins';
const PENDING_CHECKINS_KEY: string = 'pending_checkins';

@Injectable()
export class DbService {
    
    public constructor(public sto: Storage) {
    }

    public async setCheckins(date: Date, checkins: any[]): Promise<void>{
        // delete pendings
        const pendings = await this.sto.get(PENDING_CHECKINS_KEY) || {};
        checkins.map(ch => {
            if (ch.pendingId && pendings[ch.pendingId]) {
                delete pendings[ch.pendingId];
            }
        });
        await this.sto.set(PENDING_CHECKINS_KEY, pendings);
        // delete checkins for the given date
        const localCheckins = <any[]>await this.sto.get(CHECKINS_KEY) || [];
        const filterMoment = moment(date);
        const newLocalCheckins = localCheckins.filter(ch => {
            return !moment(ch.datetime, moment.ISO_8601).isSame(filterMoment, 'day');
        }).concat(checkins)
        await this.sto.set(CHECKINS_KEY, newLocalCheckins);
    }

    public async addPendingCheckin(checkin: PendingCheckin): Promise<void> {
        const pendings = await this.sto.get(PENDING_CHECKINS_KEY) || {};
        pendings[checkin.id] = checkin;
        await this.sto.set(PENDING_CHECKINS_KEY, pendings);
    }

    public async getPendingCheckins(): Promise<any[]>{
        //TODO:
        throw new TimbraError('no_local_data');
    }

    public async addLocations(locations: any[]){
        //TODO:
    }

    public async addActivities(activities: any[]){
        //TODO:
    }

    public async getCheckins(date: Date): Promise<any[]> {
        const localCheckins = <any[]>await this.sto.get(CHECKINS_KEY) || [];
        const pendings = await this.sto.get(PENDING_CHECKINS_KEY) || {};
        const pendingCheckins = _values(pendings).map((p: PendingCheckin) => {
            return {
                ...p,
                pending: true,
                datetime: moment(p.date).toISOString(),
                inOut: p.in ? 'IN' : 'OUT'
            };
        })
        const filterMoment = moment(date);
        return localCheckins.concat(pendingCheckins).filter(ch => {
            return moment(ch.datetime, moment.ISO_8601).isSame(filterMoment, 'day');
        });
    }

    public async getActivities(): Promise<any[]> {
        //TODO:
        throw new TimbraError('no_local_data');
    }

    public async getLocations(): Promise<any[]> {
        //TODO:
        throw new TimbraError('no_local_data');
    }

    public async addProfile(profile: any){
        //TODO:
    }

    public async getProfile(): Promise<{[key: string]: any}> {
        //TODO:
        throw new TimbraError('no_local_data');
    }
}