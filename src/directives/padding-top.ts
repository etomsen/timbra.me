import { Platform } from 'ionic-angular';
import { Directive, Renderer, OnInit, ElementRef } from '@angular/core';

type TPaddingTopValue = "half-device-height";

@Directive({
    selector: '[padding-top]',
    inputs: ['paddingTop: padding-top']
})
export class PaddingTopDirective implements OnInit {
    private _paddingTop: TPaddingTopValue = "half-device-height";
    private initFlag: boolean = false;
    private height: number = 0;

    constructor(public el: ElementRef, public renderer: Renderer, public platform: Platform) { }

    public set paddingTop(value: TPaddingTopValue){
        this._paddingTop = value;
        if (this.initFlag && this.checkPaddingTop()) {
            this.refresh();
        }
    }

    public get paddingTop(){
        return this._paddingTop;
    }

    private checkPaddingTop(): boolean {
        if (typeof(this._paddingTop)!=='string') {
            return false;
        }
        if (this._paddingTop === "half-device-height") {
            return true;    
        }
        return false;
    }   

    private getPaddingTopPx() {
        if (this._paddingTop === "half-device-height") {
            let height = this.el.nativeElement.offsetHeight;
            console.log("self height: ", height);
            console.log("device height: ", this.platform.height());
            let result = Math.floor((this.platform.height() - height) / 2);
            console.log("calculated padding: ", result);
            return result;
        }
        return 0;
    }

    ngOnInit() {
        this.initFlag = true;
        if (this.checkPaddingTop()){
            this.refresh();
        }
    }

    private refresh() {
        let paddingTop = this.getPaddingTopPx();
        if (this._paddingTop){
            this.renderer.setElementStyle(this.el.nativeElement, 'padding-top', paddingTop+'px');    
        }
  }
}