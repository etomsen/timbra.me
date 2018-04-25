//angular
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
//ionic
import { Storage } from '@ionic/Storage';
//3d party 
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import * as _map from 'lodash';
import * as _pick from 'lodash.pick';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';
import * as schema from '../common/gql';
import { TimbraError } from "../common/errors";
import { PendingCheckin } from '../common';
import * as test from '../gql';

@Injectable()
export class ApiProvider {
    private static TOKEN_KEY: string = 'f514030c-b64c-4d84-a4ae-2291aaddd607';
    private token: string;
    private user: any;
    private jwtHelper = new JwtHelper();
    private client: ApolloClient;
    
    constructor(public http: Http, public sto: Storage) {
        const networkInterface = createNetworkInterface({uri: 'http://localhost:3000/graphql'});
        const jwtTokenMiddleWare = (req: any, next: any) => {
            if (!req.options.headers) {
                req.options.headers = {};
            }
            req.options.headers.authorization = this.token ? `Bearer ${this.token}` : null;
            next();
        };
        networkInterface.use([{applyMiddleware: jwtTokenMiddleWare}]);

        this.client = new ApolloClient({
            networkInterface: networkInterface
        });

        this.sto.get(ApiProvider.TOKEN_KEY).then((value) => {
            this.token = value;
            if (value) {
                this.user = this.userFromToken(value);
            }
        });
    }
    
    getUser() {
        return this.user;
    }
    
    private userFromToken(token: string) {
        let decoded = this.jwtHelper.decodeToken(token);
        return  {
            id: decoded.uuid,
            username: decoded.username,
            role: decoded.profile,
        };
    }
    
    public isTokenExpired(): Promise<{isTokenExpired: boolean}> {
        return new Promise((resolve, reject) => {
            this.sto.get(ApiProvider.TOKEN_KEY)
            .then((token) => {
                this.token = token;
                resolve({isTokenExpired: token ? this.jwtHelper.isTokenExpired(token) : true});
            })
            .catch(() => {
                resolve({isTokenExpired: true});
            });
        });
    }
    
    private getAuthHeader(): Headers{
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        });
    };

    public async getUserCheckins(date: Date){
        const d = moment(date).format('YYYY-MM-DD');
        try {
            const result = await this.client.query<schema.UserCheckinsQuery>({query: gql`
                query UserCheckins {
                    userCheckins(date: "${d}") {
                        id
                        pendingId
                        datetime
                        inOut
                        location{
                            id
                            description
                            area{
                                description
                            }
                        }
                        activity{
                            id
                            description
                        }
                    }
                }
            `});
            return result.data.userCheckins ? result.data.userCheckins : [];
        } catch (error) {
            if (error.graphQLErrors && error.graphQLErrors.length === 1) {
                throw new TimbraError(error.graphQLErrors[0].message);
            } else {
                throw new TimbraError('unknown_error');
            }
        }
    }
    
    public async getUserActivities(){
        const d = moment().format('YYYY-MM-DD');
        try {
            const result = await this.client.query<schema.UserActivitiesQuery>({query: gql`
                query UserActivities {
                    userActivities(date: "${d}"){
                        dateStart
                        dateEnd
                        activityId
                        activity{
                            description
                        }
                    }
                }
            `});
            return result.data.userActivities ? result.data.userActivities : [];
        } catch (error) {
            if (error.graphQLErrors && error.graphQLErrors.length === 1) {
                throw new TimbraError(error.graphQLErrors[0].message);
            } else {
                throw new TimbraError('unknown_error');
            }
        }
    }

    public async getUserLocations(){
        const d = moment().format('YYYY-MM-DD');
        try {
            const result = await this.client.query<schema.UserLocationsQuery>({query: gql`
                query UserLocations {
                    userLocations(date: "${d}"){
                        dateStart
                        dateEnd
                        locationId
                        location{
                            description
                            code
                            area{
                                id
                                description
                            }
                        }
                    }
                }
            `});
            return result.data.userLocations ? result.data.userLocations : [];
        } catch (error) {
            if (error.graphQLErrors && error.graphQLErrors.length === 1) {
                throw new TimbraError(error.graphQLErrors[0].message);
            } else {
                throw new TimbraError('unknown_error');
            }
        }
    }
        
    public async getUserProfile(){
        try {
            const result = await this.client.query<schema.UserProfileQuery>({query: gql`
                query UserProfile{
                    user{
                        role
                        email
                        fullName
                        birthdate
                        age
                    }
                }
            `});
            return result.data.user;
        } catch (error) {
            if (error.graphQLErrors && error.graphQLErrors.length === 1) {
                throw new TimbraError(error.graphQLErrors[0].message);
            } else {
                throw new TimbraError('unknown_error');
            }
        }
    }

    async savePendingCheckins(checkins: PendingCheckin[]) {
        const data = checkins.map(ch => ({
            pendingId: `"${ch.id}"`,
            datetime: `"${moment(ch.date).toISOString()}"`,
            inOut: ch.in ? 'IN' : 'OUT',
            locationId: ch.location.id,
            activityId: ch.activity.id,
            position: ch.position ? `"(${ch.position.lat}, ${ch.position.lon})"`: null
        }));
        try {
            const result = await this.client.mutate({
                mutation: gql` mutation Login{
                    AddCheckins(input: {
                        checkins: data
                    }) {
                        id
                        pendingId
                    }
                }`});
            alert(JSON.stringify(result.data));
            if (!result.data){
                throw new TimbraError('unknown_error');
            }
        } catch (error) {
            if (error.graphQLErrors && error.graphQLErrors.length === 1) {
                throw new TimbraError(error.graphQLErrors[0].message);
            } else {
                throw new TimbraError('unknown_error');
            }
        }
    }
    
    async login(data: {username: string, password: string, device_id?: string, device_model?: string, os_version?: string, token?: string, force_device?: string}) {
        try {
            const result = await this.client.mutate<schema.LoginMutation>({
                mutation: gql` mutation Login{
                    Login (input: {
                        username: "${data.username}",
                        password: "${data.password}"
                    }) {
                        role
                        jwtAuthToken
                    }
                }`});
            alert(JSON.stringify(result.data));
            if (result.data){
                this.sto.set(ApiProvider.TOKEN_KEY, result.data.Login.jwtAuthToken);
                this.token = result.data.Login.jwtAuthToken;
                this.user = this.userFromToken(result.data.Login.jwtAuthToken);
            } else {
                throw new TimbraError('unknown_error');
            }
        } catch (error) {
            if (error.graphQLErrors && error.graphQLErrors.length === 1) {
                throw new TimbraError(error.graphQLErrors[0].message);
            } else {
                throw new TimbraError('unknown_error');
            }
        }
    }
    
    logout() {
        this.sto.remove(ApiProvider.TOKEN_KEY);
        delete this.token;
        delete this.user;
    }
}