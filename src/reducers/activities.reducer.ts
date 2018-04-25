import { ActionReducer, Action } from '@ngrx/store';
import { TimbraActions } from '../actions';
import * as moment from 'moment';

export interface State {
    activities: any[];
    loading: boolean;
    error: string;
};

const initialState: State = {
    activities: [],
    loading: false,
    error: ''
};

export function reducer(state = initialState, action: Action) {
    switch(action.type) {
        case TimbraActions.FETCH_ACTIVITIES:
            return Object.assign({}, state, {error: false, loading: true});
        case TimbraActions.FETCH_ACTIVITIES_FAILED:
            return Object.assign({}, state, {error: action.payload, loading: false});
        case TimbraActions.FETCH_ACTIVITIES_SUCCESS:
            return {
                activities: action.payload, 
                error: false, 
                loading: false
            };
        default:
            return state;
    };
}

export const getData = (state: State) => {
    return state.activities.map(a=>
            ({...a,
                dateStartMoment: moment(a.dateStart, moment.ISO_8601).startOf('day'),
                dateEndMoment: moment(a.dateEnd, moment.ISO_8601).endOf('day')
            }))
        .filter((a) => {
        return moment().isBetween(a.dateStartMoment, a.dateEndMoment);
    });
};
export const getError = (state: State) => state.error;
export const getLoading = (state: State) => state.loading;
