import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core'

export class TimbraMissingTranslationHandler implements MissingTranslationHandler {
    
    private static getAppKey(key: string) {
        let errorCode = "unknown-error";
        if (typeof key !== "string") {
            return "app." + errorCode;
        }
        let s = key.split(".");
        if (s.length < 2) {
            return "app." + errorCode;
        }
        if (s[0] === "app") {
            return key;
        }
        s.shift();
        return "app." + s.join(".");
    }

    handle(params: MissingTranslationHandlerParams) {
        console.log(`Unable to translate ${params.key}`);
        let appKey = TimbraMissingTranslationHandler.getAppKey(params.key);
        if (appKey === params.key){
            return appKey;
        }        
        return params.translateService.instant(appKey);
    }
}
