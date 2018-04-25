import { Directive, Renderer, OnInit, ElementRef } from '@angular/core';

@Directive({
    selector: '[has-footer]',
    inputs: ['hasFooter: has-footer']
})
export class HasFooterDirective implements OnInit {
    private _hasFooter = false;
    private initFlag: boolean = false;

    constructor(public el: ElementRef, public renderer: Renderer) { }

    public set hasFooter(value: boolean){
        this._hasFooter = value;
        if (this.initFlag && (typeof(this._hasFooter)==='boolean')) {
            this.refresh();
        }
    }

    public get hasFooter(){
        return this._hasFooter;
    }

    ngOnInit() {
        this.initFlag = true;
    }

    private refresh() {
        let height = this.el.nativeElement.parentElement.offsetHeight;
        if (this._hasFooter){
            height -= 44;
        }
        this.renderer.setElementStyle(this.el.nativeElement, 'height', height+'px');
  }
}