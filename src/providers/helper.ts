
import * as moment from 'moment';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

export class Helper {
    private events: {[key: string]: any} = {};
    
    public pushEvent(key: string, data?: any){
        if (data) {
            this.events[key] = data;
        } else {
            this.events[key] = true;
        }
    }

    public popEvent(key: string): any{
        let result = this.events[key];
        delete this.events[key];
        return result;
    }

    public static httpAuthFactory(http: any){
        return new AuthHttp(new AuthConfig({noJwtError: true}), http);
    }

}