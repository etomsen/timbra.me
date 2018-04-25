import { ActionReducer, Action } from '@ngrx/store';
import { TimbraActions } from '../actions';
import {cloneDeep} from 'lodash';
import * as moment from 'moment';
import {PendingCheckin} from '../common';

export interface State {
    checkins: {[id: string]: any},
    loading: boolean;
    error: string;
    filter: Date;
};

const initialState: State = {
    checkins: {},
    loading: false,
    error: '',
    filter: new Date()
};

// function addCheckinLocalSuccess(state: State, payload: PendingCheckin){
//     let result = cloneDeep(state);
//     result.checkins[payload.id] = payload;
//     return result;
// }

export function reducer(state = initialState, action: Action) {
    let result: any;
    switch(action.type) {
        // case TimbraActions.ADD_CHECKIN_LOCAL_SUCCESS:
        //     return addCheckinLocalSuccess(state, action.payload);

        case TimbraActions.SET_CHECKINS_FILTER:
            return {...state, filter: action.payload};

        case TimbraActions.FETCH_CHECKINS:
            return Object.assign({}, state, {error: false, loading: true});

        case TimbraActions.FETCH_CHECKINS_FAILED:
            return Object.assign({}, state, {error: action.payload, loading: false});

        case TimbraActions.FETCH_CHECKINS_SUCCESS:
            result = cloneDeep(state);
            action.payload.forEach((checkin: any) => {
                const old = result.checkins[checkin.id] || {};
                result.checkins[checkin.id] = {...old, ...checkin};
            });
            return {...result, error: false, loading: false}
            
        default:
            return state;
    };
}

export const getData = (state: State) => {
    if (state.filter){
        const filterMoment = moment(state.filter);
        return Object.keys(state.checkins)
            .map(id => state.checkins[id])
            .filter((checkin) => {
                return moment(checkin.datetime, moment.ISO_8601).isSame(filterMoment, 'day');
            })
            .map(checkin => {
                return {...checkin,
                    isIn: checkin.inOut === 'IN' ? true : false,
                    dateText: moment(checkin.datetime, moment.ISO_8601).format('DD/MM/YYYY HH:mm'),
                    dateMoment: moment(checkin.datetime, moment.ISO_8601)
                };
            })
            .sort((a, b) => (a.dateMoment.isAfter(b.dateMoment) ? 0 : 1));
    }
    return Object.keys(state.checkins).map(id => state.checkins[id]);
}

export const getError = (state: State) => state.error;
export const getLoading = (state: State) => state.loading;
