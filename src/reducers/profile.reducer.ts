import { ActionReducer, Action } from '@ngrx/store';
import { TimbraActions } from '../actions';
import * as moment from 'moment';

export interface State {
    profile: any;
    loading: boolean;
    error: string;
};

const initialState: State = {
    profile: null,
    loading: false,
    error: ''
};

export function reducer(state = initialState, action: Action) {
    switch(action.type) {
        case TimbraActions.FETCH_PROFILE:
            return Object.assign({}, state, {error: false, loading: true});
        case TimbraActions.FETCH_PROFILE_FAILED:
            return Object.assign({}, state, {error: action.payload, loading: false});
        case TimbraActions.FETCH_PROFILE_SUCCESS:
            return {
                profile: action.payload,
                error: false,
                loading: false
            };
        default:
            return state;
    };
}

export const getData = (state: State) => {
    return state.profile;
}
export const getError = (state: State) => state.error;
export const getLoading = (state: State) => state.loading;
