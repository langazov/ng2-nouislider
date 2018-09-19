"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var noUiSlider = require("nouislider");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var DefaultFormatter = (function () {
    function DefaultFormatter() {
    }
    DefaultFormatter.prototype.to = function (value) {
        // formatting with http://stackoverflow.com/a/26463364/478584
        return String(parseFloat(parseFloat(String(value)).toFixed(2)));
    };
    ;
    DefaultFormatter.prototype.from = function (value) {
        return parseFloat(value);
    };
    return DefaultFormatter;
}());
exports.DefaultFormatter = DefaultFormatter;
var noUISliderThis;
var NouisliderComponent = (function () {
    function NouisliderComponent(el, renderer) {
        var _this = this;
        this.el = el;
        this.renderer = renderer;
        this.config = {};
        this.change = new core_1.EventEmitter(true);
        this.update = new core_1.EventEmitter(true);
        this.slide = new core_1.EventEmitter(true);
        this.set = new core_1.EventEmitter(true);
        this.start = new core_1.EventEmitter(true);
        this.end = new core_1.EventEmitter(true);
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
        this.eventHandler = function (emitter, values, handle, unencoded) {
            var v = _this.toValues(values);
            var emitEvents = false;
            if (_this.value === undefined) {
                _this.value = v;
                return;
            }
            if (Array.isArray(v) && _this.value[handle] != v[handle]) {
                emitEvents = true;
            }
            if (!Array.isArray(v) && _this.value != v) {
                emitEvents = true;
            }
            if (emitEvents) {
                emitter.emit(v);
                _this.onChange(v);
            }
            if (Array.isArray(v)) {
                _this.value[handle] = v[handle];
            }
            else {
                _this.value = v;
            }
        };
        this.defaultKeyHandler = function (e) {
            var stepSize = _this.slider.steps();
            var index = parseInt(e.target.getAttribute('data-handle'));
            var sign = 1;
            var multiplier = 1;
            var step = 0;
            var delta = 0;
            switch (e.which) {
                case 34:// PageDown
                    multiplier = _this.config.pageSteps;
                case 40: // ArrowDown
                case 37:// ArrowLeft
                    sign = -1;
                    step = stepSize[index][0];
                    e.preventDefault();
                    break;
                case 33:// PageUp
                    multiplier = _this.config.pageSteps;
                case 38: // ArrowUp
                case 39:// ArrowRight
                    step = stepSize[index][1];
                    e.preventDefault();
                    break;
                default:
                    break;
            }
            delta = sign * multiplier * step;
            var newValue;
            if (Array.isArray(_this.value)) {
                newValue = [].concat(_this.value);
                newValue[index] = newValue[index] + delta;
            }
            else {
                newValue = _this.value + delta;
            }
            _this.slider.set(newValue);
        };
        noUISliderThis = this;
    }
    NouisliderComponent.prototype.ngOnInit = function () {
        var _this = this;
        var inputsConfig = JSON.parse(JSON.stringify({
            behaviour: this.behaviour,
            connect: this.connect,
            limit: this.limit,
            start: this.formControl !== undefined ? this.formControl.value : this.ngModel,
            step: this.step,
            pageSteps: this.pageSteps,
            keyboard: this.keyboard,
            onKeydown: this.onKeydown,
            range: this.range || this.config.range || { min: this.min, max: this.max },
            tooltips: this.tooltips,
            snap: this.snap,
            animate: this.animate
        }));
        inputsConfig.tooltips = this.tooltips || this.config.tooltips;
        inputsConfig.format = this.format || this.config.format || new DefaultFormatter();
        this.slider = noUiSlider.create(this.el.nativeElement.querySelector('div'), Object.assign(this.config, inputsConfig));
        /*
            const tooltip = this.el.nativeElement.querySelector('.noUi-tooltip');
            const width = tooltip.clientWidth;
            var style = window.getComputedStyle ? getComputedStyle(this.el.nativeElement, null) : this.el.nativeElement.currentStyle;
            const padding = parseInt(style.paddingLeft) || 0;
            const margin = parseInt(width) / 2 +  padding  + 2;
            tooltip.style.marginLeft = -margin;
            tooltip.addEventListener('click', function(evt: any) {
              evt.currentTarget.innerHTML = '<input class="input-tooltip" type="number" min="1" max="10" inputmode="numeric" pattern="[0-9]*" title="Non-negative integral number">';
              const input_tooltip = this.children[0];
              input_tooltip.value = noUISliderThis.slider.get();
              input_tooltip.addEventListener('focus', function(e: any){
                console.log(e);
              });
              input_tooltip.addEventListener('focusout', function(e: any){
                console.log(e);
              });
              input_tooltip.addEventListener('keydown', function (e: any){
                const valor = this.val();
                noUISliderThis.slider.set(valor);
                console.log(valor);
              });
        
              console.log(evt);
            });
        */
        this.handles = [].slice.call(this.el.nativeElement.querySelectorAll('.noUi-handle'));
        if (this.config.keyboard) {
            if (this.config.pageSteps === undefined) {
                this.config.pageSteps = 10;
            }
            var _loop_1 = function (handle) {
                handle.setAttribute('tabindex', 0);
                handle.addEventListener('click', function () {
                    handle.focus();
                });
                if (this_1.config.onKeydown === undefined) {
                    handle.addEventListener('keydown', this_1.defaultKeyHandler);
                }
                else {
                    handle.addEventListener('keydown', this_1.config.onKeydown);
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.handles; _i < _a.length; _i++) {
                var handle = _a[_i];
                _loop_1(handle);
            }
        }
        this.slider.on('set', function (values, handle, unencoded) {
            _this.eventHandler(_this.set, values, handle, unencoded);
        });
        this.slider.on('update', function (values, handle, unencoded) {
            _this.update.emit(_this.toValues(values));
        });
        this.slider.on('change', function (values, handle, unencoded) {
            _this.change.emit(_this.toValues(values));
        });
        this.slider.on('slide', function (values, handle, unencoded) {
            _this.eventHandler(_this.slide, values, handle, unencoded);
        });
        this.slider.on('start', function (values, handle, unencoded) {
            _this.start.emit(_this.toValues(values));
        });
        this.slider.on('end', function (values, handle, unencoded) {
            _this.end.emit(_this.toValues(values));
        });
    };
    NouisliderComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (this.slider && (changes.min || changes.max || changes.step || changes.range || changes.pips)) {
            setTimeout(function () {
                _this.slider.updateOptions({
                    range: Object.assign({}, {
                        min: _this.min,
                        max: _this.max
                    }, _this.range || {}),
                    step: _this.step,
                    pips: _this.pips
                });
            });
        }
    };
    NouisliderComponent.prototype.toValues = function (values) {
        var v = values.map(this.config.format.from);
        return (v.length == 1 ? v[0] : v);
    };
    NouisliderComponent.prototype.writeValue = function (value) {
        var _this = this;
        if (this.slider) {
            setTimeout(function () {
                _this.slider.set(value);
            });
        }
    };
    NouisliderComponent.prototype.registerOnChange = function (fn) {
        this.onChange = fn;
    };
    NouisliderComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    NouisliderComponent.prototype.setDisabledState = function (isDisabled) {
        isDisabled
            ? this.renderer.setAttribute(this.el.nativeElement.childNodes[0], 'disabled', 'true')
            : this.renderer.removeAttribute(this.el.nativeElement.childNodes[0], 'disabled');
    };
    NouisliderComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'nouislider',
                    host: {
                        '[class.ng2-nouislider]': 'true'
                    },
                    template: '<div [attr.disabled]="disabled ? true : undefined"></div>',
                    styles: ["\n    :host {\n      display: block;\n      margin-top: 1rem;\n      margin-bottom: 1rem;\n    }\n  "],
                    providers: [
                        {
                            provide: forms_1.NG_VALUE_ACCESSOR,
                            useExisting: core_1.forwardRef(function () { return NouisliderComponent; }),
                            multi: true
                        }
                    ]
                },] },
    ];
    /** @nocollapse */
    NouisliderComponent.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.Renderer2, },
    ]; };
    NouisliderComponent.propDecorators = {
        'disabled': [{ type: core_1.Input },],
        'behaviour': [{ type: core_1.Input },],
        'connect': [{ type: core_1.Input },],
        'limit': [{ type: core_1.Input },],
        'min': [{ type: core_1.Input },],
        'max': [{ type: core_1.Input },],
        'pips': [{ type: core_1.Input },],
        'snap': [{ type: core_1.Input },],
        'animate': [{ type: core_1.Input },],
        'range': [{ type: core_1.Input },],
        'step': [{ type: core_1.Input },],
        'format': [{ type: core_1.Input },],
        'pageSteps': [{ type: core_1.Input },],
        'config': [{ type: core_1.Input },],
        'ngModel': [{ type: core_1.Input },],
        'keyboard': [{ type: core_1.Input },],
        'onKeydown': [{ type: core_1.Input },],
        'formControl': [{ type: core_1.Input },],
        'tooltips': [{ type: core_1.Input },],
        'change': [{ type: core_1.Output },],
        'update': [{ type: core_1.Output },],
        'slide': [{ type: core_1.Output },],
        'set': [{ type: core_1.Output },],
        'start': [{ type: core_1.Output },],
        'end': [{ type: core_1.Output },],
    };
    return NouisliderComponent;
}());
exports.NouisliderComponent = NouisliderComponent;
var NouisliderModule = (function () {
    function NouisliderModule() {
    }
    NouisliderModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [],
                    exports: [NouisliderComponent],
                    declarations: [NouisliderComponent],
                },] },
    ];
    /** @nocollapse */
    NouisliderModule.ctorParameters = function () { return []; };
    return NouisliderModule;
}());
exports.NouisliderModule = NouisliderModule;
//# sourceMappingURL=data:application/json;base64,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QUssRUFBRSxFQUFFO1FBQzdCLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzNCLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQ3pCLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQ3pCLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzFCLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzFCLFNBQVMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzdCLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzNCLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzFCLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzVCLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQy9CLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzVCLFNBQVMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzdCLFVBQVUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzlCLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQy9CLGFBQWEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQ2pDLFVBQVUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFlBQUssRUFBRSxFQUFFO1FBQzlCLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQU0sRUFBRSxFQUFFO1FBQzdCLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQU0sRUFBRSxFQUFFO1FBQzdCLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQU0sRUFBRSxFQUFFO1FBQzVCLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQU0sRUFBRSxFQUFFO1FBQzFCLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQU0sRUFBRSxFQUFFO1FBQzVCLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLGFBQU0sRUFBRSxFQUFFO0tBQ3pCLENBQUM7SUFDRiwwQkFBQztDQXJTRCxBQXFTQyxJQUFBO0FBclNZLGtEQUFtQjtBQXlTaEM7SUFBQTtJQVVBLENBQUM7SUFWc0MsMkJBQVUsR0FBMEI7UUFDM0UsRUFBRSxJQUFJLEVBQUUsZUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO29CQUN2QixPQUFPLEVBQUUsRUFBRTtvQkFDWCxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztvQkFDOUIsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUM7aUJBQ3BDLEVBQUcsRUFBRTtLQUNMLENBQUM7SUFDRixrQkFBa0I7SUFDWCwrQkFBYyxHQUFtRSxjQUFNLE9BQUEsRUFDN0YsRUFENkYsQ0FDN0YsQ0FBQztJQUNGLHVCQUFDO0NBVkQsQUFVQyxJQUFBO0FBVlksNENBQWdCIiwiZmlsZSI6Im5nMi1ub3Vpc2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIG5vVWlTbGlkZXIgZnJvbSAnbm91aXNsaWRlcic7XHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIGZvcndhcmRSZWYsXHJcbiAgSW5wdXQsXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBPdXRwdXQsXHJcbiAgTmdNb2R1bGUsXHJcbiAgUmVuZGVyZXIyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgQ29udHJvbFZhbHVlQWNjZXNzb3IsXHJcbiAgRm9ybUNvbnRyb2wsXHJcbiAgTkdfVkFMVUVfQUNDRVNTT1JcclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIE5vdWlGb3JtYXR0ZXIge1xyXG4gIHRvKHZhbHVlOiBudW1iZXIpOiBzdHJpbmc7XHJcbiAgZnJvbSh2YWx1ZTogc3RyaW5nKTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRGVmYXVsdEZvcm1hdHRlciBpbXBsZW1lbnRzIE5vdWlGb3JtYXR0ZXIge1xyXG4gIHRvKHZhbHVlOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgLy8gZm9ybWF0dGluZyB3aXRoIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NDYzMzY0LzQ3ODU4NFxyXG4gICAgcmV0dXJuIFN0cmluZyhwYXJzZUZsb2F0KHBhcnNlRmxvYXQoU3RyaW5nKHZhbHVlKSkudG9GaXhlZCgyKSkpO1xyXG4gIH07XHJcblxyXG4gIGZyb20odmFsdWU6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgbm9VSVNsaWRlclRoaXM6IE5vdWlzbGlkZXJDb21wb25lbnQ7XHJcblxyXG5leHBvcnQgY2xhc3MgTm91aXNsaWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblxyXG4gIHB1YmxpYyBzbGlkZXI6IGFueTtcclxuICBwdWJsaWMgaGFuZGxlczogYW55W107XHJcbiAgIHB1YmxpYyBkaXNhYmxlZDogYm9vbGVhbjsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxyXG4gICBwdWJsaWMgYmVoYXZpb3VyOiBzdHJpbmc7XHJcbiAgIHB1YmxpYyBjb25uZWN0OiBib29sZWFuW107XHJcbiAgIHB1YmxpYyBsaW1pdDogbnVtYmVyO1xyXG4gICBwdWJsaWMgbWluOiBudW1iZXI7XHJcbiAgIHB1YmxpYyBtYXg6IG51bWJlcjtcclxuICAgcHVibGljIHBpcHM6IGFueTtcclxuICAgcHVibGljIHNuYXA6IGJvb2xlYW47XHJcbiAgIHB1YmxpYyBhbmltYXRlOiBib29sZWFuIHwgYm9vbGVhbltdO1xyXG4gICBwdWJsaWMgcmFuZ2U6IGFueTtcclxuICAgcHVibGljIHN0ZXA6IG51bWJlcjtcclxuICAgcHVibGljIGZvcm1hdDogTm91aUZvcm1hdHRlcjtcclxuICAgcHVibGljIHBhZ2VTdGVwczogbnVtYmVyO1xyXG4gICBwdWJsaWMgY29uZmlnOiBhbnkgPSB7fTtcclxuICAgcHVibGljIG5nTW9kZWw6IG51bWJlciB8IG51bWJlcltdO1xyXG4gICBwdWJsaWMga2V5Ym9hcmQ6IGJvb2xlYW47XHJcbiAgIHB1YmxpYyBvbktleWRvd246IGFueTtcclxuICAgcHVibGljIGZvcm1Db250cm9sOiBGb3JtQ29udHJvbDtcclxuICAgcHVibGljIHRvb2x0aXBzOiBBcnJheTxhbnk+O1xyXG4gICBwdWJsaWMgY2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIodHJ1ZSk7XHJcbiAgIHB1YmxpYyB1cGRhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcih0cnVlKTtcclxuICAgcHVibGljIHNsaWRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIodHJ1ZSk7XHJcbiAgIHB1YmxpYyBzZXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcih0cnVlKTtcclxuICAgcHVibGljIHN0YXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIodHJ1ZSk7XHJcbiAgIHB1YmxpYyBlbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcih0cnVlKTtcclxuICBwcml2YXRlIHZhbHVlOiBhbnk7XHJcbiAgcHJpdmF0ZSBvbkNoYW5nZTogYW55ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xyXG4gIHByaXZhdGUgb25Ub3VjaGVkOiBhbnkgPSBGdW5jdGlvbi5wcm90b3R5cGU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyZXIgOiBSZW5kZXJlcjIpIHtcclxuICAgIG5vVUlTbGlkZXJUaGlzID0gdGhpcztcclxuICAgfVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIGxldCBpbnB1dHNDb25maWcgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgYmVoYXZpb3VyOiB0aGlzLmJlaGF2aW91cixcclxuICAgICAgY29ubmVjdDogdGhpcy5jb25uZWN0LFxyXG4gICAgICBsaW1pdDogdGhpcy5saW1pdCxcclxuICAgICAgc3RhcnQ6IHRoaXMuZm9ybUNvbnRyb2wgIT09IHVuZGVmaW5lZCA/IHRoaXMuZm9ybUNvbnRyb2wudmFsdWUgOiB0aGlzLm5nTW9kZWwsXHJcbiAgICAgIHN0ZXA6IHRoaXMuc3RlcCxcclxuICAgICAgcGFnZVN0ZXBzOiB0aGlzLnBhZ2VTdGVwcyxcclxuICAgICAga2V5Ym9hcmQ6IHRoaXMua2V5Ym9hcmQsXHJcbiAgICAgIG9uS2V5ZG93bjogdGhpcy5vbktleWRvd24sXHJcbiAgICAgIHJhbmdlOiB0aGlzLnJhbmdlIHx8IHRoaXMuY29uZmlnLnJhbmdlIHx8IHttaW46IHRoaXMubWluLCBtYXg6IHRoaXMubWF4fSxcclxuICAgICAgdG9vbHRpcHM6IHRoaXMudG9vbHRpcHMsXHJcbiAgICAgIHNuYXA6IHRoaXMuc25hcCxcclxuICAgICAgYW5pbWF0ZTogdGhpcy5hbmltYXRlXHJcbiAgICB9KSk7XHJcbiAgICBpbnB1dHNDb25maWcudG9vbHRpcHMgPSB0aGlzLnRvb2x0aXBzIHx8IHRoaXMuY29uZmlnLnRvb2x0aXBzO1xyXG4gICAgaW5wdXRzQ29uZmlnLmZvcm1hdCA9IHRoaXMuZm9ybWF0IHx8IHRoaXMuY29uZmlnLmZvcm1hdCB8fCBuZXcgRGVmYXVsdEZvcm1hdHRlcigpO1xyXG5cclxuICAgIHRoaXMuc2xpZGVyID0gbm9VaVNsaWRlci5jcmVhdGUoXHJcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYnKSxcclxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZywgaW5wdXRzQ29uZmlnKVxyXG4gICAgKTtcclxuXHJcbi8qXHJcbiAgICBjb25zdCB0b29sdGlwID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ub1VpLXRvb2x0aXAnKTtcclxuICAgIGNvbnN0IHdpZHRoID0gdG9vbHRpcC5jbGllbnRXaWR0aDtcclxuICAgIHZhciBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIG51bGwpIDogdGhpcy5lbC5uYXRpdmVFbGVtZW50LmN1cnJlbnRTdHlsZTtcclxuICAgIGNvbnN0IHBhZGRpbmcgPSBwYXJzZUludChzdHlsZS5wYWRkaW5nTGVmdCkgfHwgMDtcclxuICAgIGNvbnN0IG1hcmdpbiA9IHBhcnNlSW50KHdpZHRoKSAvIDIgKyAgcGFkZGluZyAgKyAyO1xyXG4gICAgdG9vbHRpcC5zdHlsZS5tYXJnaW5MZWZ0ID0gLW1hcmdpbjtcclxuICAgIHRvb2x0aXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldnQ6IGFueSkge1xyXG4gICAgICBldnQuY3VycmVudFRhcmdldC5pbm5lckhUTUwgPSAnPGlucHV0IGNsYXNzPVwiaW5wdXQtdG9vbHRpcFwiIHR5cGU9XCJudW1iZXJcIiBtaW49XCIxXCIgbWF4PVwiMTBcIiBpbnB1dG1vZGU9XCJudW1lcmljXCIgcGF0dGVybj1cIlswLTldKlwiIHRpdGxlPVwiTm9uLW5lZ2F0aXZlIGludGVncmFsIG51bWJlclwiPic7XHJcbiAgICAgIGNvbnN0IGlucHV0X3Rvb2x0aXAgPSB0aGlzLmNoaWxkcmVuWzBdO1xyXG4gICAgICBpbnB1dF90b29sdGlwLnZhbHVlID0gbm9VSVNsaWRlclRoaXMuc2xpZGVyLmdldCgpO1xyXG4gICAgICBpbnB1dF90b29sdGlwLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgZnVuY3Rpb24oZTogYW55KXtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGlucHV0X3Rvb2x0aXAuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCBmdW5jdGlvbihlOiBhbnkpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICB9KTtcclxuICAgICAgaW5wdXRfdG9vbHRpcC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGU6IGFueSl7XHJcbiAgICAgICAgY29uc3QgdmFsb3IgPSB0aGlzLnZhbCgpO1xyXG4gICAgICAgIG5vVUlTbGlkZXJUaGlzLnNsaWRlci5zZXQodmFsb3IpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHZhbG9yKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZyhldnQpO1xyXG4gICAgfSk7XHJcbiovXHJcbiAgICB0aGlzLmhhbmRsZXMgPSBbXS5zbGljZS5jYWxsKHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm9VaS1oYW5kbGUnKSk7XHJcblxyXG4gICAgaWYodGhpcy5jb25maWcua2V5Ym9hcmQpIHtcclxuICAgICAgaWYodGhpcy5jb25maWcucGFnZVN0ZXBzID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmNvbmZpZy5wYWdlU3RlcHMgPSAxMDtcclxuICAgICAgfVxyXG4gICAgICBmb3IobGV0IGhhbmRsZSBvZiB0aGlzLmhhbmRsZXMpIHtcclxuICAgICAgICBoYW5kbGUuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xyXG4gICAgICAgIGhhbmRsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgIGhhbmRsZS5mb2N1cygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmKHRoaXMuY29uZmlnLm9uS2V5ZG93biA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuZGVmYXVsdEtleUhhbmRsZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBoYW5kbGUuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuY29uZmlnLm9uS2V5ZG93bik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zbGlkZXIub24oJ3NldCcsICh2YWx1ZXM6IHN0cmluZ1tdLCBoYW5kbGU6IG51bWJlciwgdW5lbmNvZGVkOiBudW1iZXJbXSkgPT4ge1xyXG4gICAgICB0aGlzLmV2ZW50SGFuZGxlcih0aGlzLnNldCwgdmFsdWVzLCBoYW5kbGUsIHVuZW5jb2RlZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnNsaWRlci5vbigndXBkYXRlJywgKHZhbHVlczogc3RyaW5nW10sIGhhbmRsZTogbnVtYmVyLCB1bmVuY29kZWQ6IG51bWJlcltdKSA9PiB7XHJcbiAgICAgIHRoaXMudXBkYXRlLmVtaXQodGhpcy50b1ZhbHVlcyh2YWx1ZXMpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc2xpZGVyLm9uKCdjaGFuZ2UnLCAodmFsdWVzOiBzdHJpbmdbXSwgaGFuZGxlOiBudW1iZXIsIHVuZW5jb2RlZDogbnVtYmVyW10pID0+IHtcclxuICAgICAgdGhpcy5jaGFuZ2UuZW1pdCh0aGlzLnRvVmFsdWVzKHZhbHVlcykpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5zbGlkZXIub24oJ3NsaWRlJywgKHZhbHVlczogc3RyaW5nW10sIGhhbmRsZTogbnVtYmVyLCB1bmVuY29kZWQ6IG51bWJlcltdKSA9PiB7XHJcbiAgICAgIHRoaXMuZXZlbnRIYW5kbGVyKHRoaXMuc2xpZGUsIHZhbHVlcywgaGFuZGxlLCB1bmVuY29kZWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5zbGlkZXIub24oJ3N0YXJ0JywgKHZhbHVlczogc3RyaW5nW10sIGhhbmRsZTogbnVtYmVyLCB1bmVuY29kZWQ6IG51bWJlcltdKSA9PiB7XHJcbiAgICAgIHRoaXMuc3RhcnQuZW1pdCh0aGlzLnRvVmFsdWVzKHZhbHVlcykpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5zbGlkZXIub24oJ2VuZCcsICh2YWx1ZXM6IHN0cmluZ1tdLCBoYW5kbGU6IG51bWJlciwgdW5lbmNvZGVkOiBudW1iZXJbXSkgPT4ge1xyXG4gICAgICB0aGlzLmVuZC5lbWl0KHRoaXMudG9WYWx1ZXModmFsdWVzKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IGFueSkge1xyXG4gICAgaWYgKHRoaXMuc2xpZGVyICYmIChjaGFuZ2VzLm1pbiB8fCBjaGFuZ2VzLm1heCB8fCBjaGFuZ2VzLnN0ZXAgfHwgY2hhbmdlcy5yYW5nZSB8fCBjaGFuZ2VzLnBpcHMpKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2xpZGVyLnVwZGF0ZU9wdGlvbnMoe1xyXG4gICAgICAgICAgcmFuZ2U6IE9iamVjdC5hc3NpZ24oe30sIHtcclxuICAgICAgICAgICAgbWluOiB0aGlzLm1pbixcclxuICAgICAgICAgICAgbWF4OiB0aGlzLm1heFxyXG4gICAgICAgICAgfSwgdGhpcy5yYW5nZSB8fCB7fSksXHJcbiAgICAgICAgICBzdGVwOiB0aGlzLnN0ZXAsXHJcbiAgICAgICAgICBwaXBzOiB0aGlzLnBpcHNcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0b1ZhbHVlcyh2YWx1ZXM6IHN0cmluZ1tdKTogYW55IHwgYW55W10ge1xyXG4gICAgbGV0IHYgPSB2YWx1ZXMubWFwKHRoaXMuY29uZmlnLmZvcm1hdC5mcm9tKTtcclxuICAgIHJldHVybiAodi5sZW5ndGggPT0gMSA/IHZbMF0gOiB2KTtcclxuICB9XHJcblxyXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuc2xpZGVyKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2xpZGVyLnNldCh2YWx1ZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSk6IHZvaWQge1xyXG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcclxuICB9XHJcblxyXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgaXNEaXNhYmxlZFxyXG4gICAgICA/IHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzBdLCAnZGlzYWJsZWQnLCAndHJ1ZScpXHJcbiAgICAgIDogdGhpcy5yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMF0sICdkaXNhYmxlZCcpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBldmVudEhhbmRsZXIgPSAoZW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4sIHZhbHVlczogc3RyaW5nW10sIGhhbmRsZTogbnVtYmVyLCB1bmVuY29kZWQ6IG51bWJlcltdKSA9PiB7XHJcbiAgICBsZXQgdiA9IHRoaXMudG9WYWx1ZXModmFsdWVzKTtcclxuICAgIGxldCBlbWl0RXZlbnRzID0gZmFsc2U7XHJcbiAgICBpZih0aGlzLnZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy52YWx1ZSA9IHY7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmKEFycmF5LmlzQXJyYXkodikgJiYgdGhpcy52YWx1ZVtoYW5kbGVdICE9IHZbaGFuZGxlXSkge1xyXG4gICAgICBlbWl0RXZlbnRzID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGlmKCFBcnJheS5pc0FycmF5KHYpICYmIHRoaXMudmFsdWUgIT0gdikge1xyXG4gICAgICBlbWl0RXZlbnRzID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGlmKGVtaXRFdmVudHMpIHtcclxuICAgICAgZW1pdHRlci5lbWl0KHYpO1xyXG4gICAgICB0aGlzLm9uQ2hhbmdlKHYpO1xyXG4gICAgfVxyXG4gICAgaWYoQXJyYXkuaXNBcnJheSh2KSkge1xyXG4gICAgICB0aGlzLnZhbHVlW2hhbmRsZV0gPSB2W2hhbmRsZV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZhbHVlID0gdjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZGVmYXVsdEtleUhhbmRsZXIgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgbGV0IHN0ZXBTaXplOiBhbnlbXSA9IHRoaXMuc2xpZGVyLnN0ZXBzKCk7XHJcbiAgICBsZXQgaW5kZXggPSBwYXJzZUludCgoPEhUTUxFbGVtZW50PmUudGFyZ2V0KS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGFuZGxlJykpO1xyXG4gICAgbGV0IHNpZ24gPSAxO1xyXG4gICAgbGV0IG11bHRpcGxpZXI6IG51bWJlciA9IDE7XHJcbiAgICBsZXQgc3RlcCA9IDA7XHJcbiAgICBsZXQgZGVsdGEgPSAwO1xyXG5cclxuICAgIHN3aXRjaCAoIGUud2hpY2ggKSB7XHJcbiAgICAgIGNhc2UgMzQ6ICAvLyBQYWdlRG93blxyXG4gICAgICAgIG11bHRpcGxpZXIgPSB0aGlzLmNvbmZpZy5wYWdlU3RlcHM7XHJcbiAgICAgIGNhc2UgNDA6ICAvLyBBcnJvd0Rvd25cclxuICAgICAgY2FzZSAzNzogIC8vIEFycm93TGVmdFxyXG4gICAgICAgIHNpZ24gPSAtMTtcclxuICAgICAgICBzdGVwID0gc3RlcFNpemVbaW5kZXhdWzBdO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgMzM6ICAvLyBQYWdlVXBcclxuICAgICAgICBtdWx0aXBsaWVyID0gdGhpcy5jb25maWcucGFnZVN0ZXBzO1xyXG4gICAgICBjYXNlIDM4OiAgLy8gQXJyb3dVcFxyXG4gICAgICBjYXNlIDM5OiAgLy8gQXJyb3dSaWdodFxyXG4gICAgICAgIHN0ZXAgPSBzdGVwU2l6ZVtpbmRleF1bMV07XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBkZWx0YSA9IHNpZ24gKiBtdWx0aXBsaWVyICogc3RlcDtcclxuICAgIGxldCBuZXdWYWx1ZTogbnVtYmVyIHwgbnVtYmVyW107XHJcblxyXG4gICAgaWYoQXJyYXkuaXNBcnJheSh0aGlzLnZhbHVlKSkge1xyXG4gICAgICBuZXdWYWx1ZSA9IFtdLmNvbmNhdCh0aGlzLnZhbHVlKTtcclxuICAgICAgbmV3VmFsdWVbaW5kZXhdID0gbmV3VmFsdWVbaW5kZXhdICsgZGVsdGE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdWYWx1ZSA9IHRoaXMudmFsdWUgKyBkZWx0YTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNsaWRlci5zZXQobmV3VmFsdWUpO1xyXG4gIH1cclxuc3RhdGljIGRlY29yYXRvcnM6IERlY29yYXRvckludm9jYXRpb25bXSA9IFtcbnsgdHlwZTogQ29tcG9uZW50LCBhcmdzOiBbe1xyXG4gIHNlbGVjdG9yOiAnbm91aXNsaWRlcicsXHJcbiAgaG9zdDoge1xyXG4gICAgJ1tjbGFzcy5uZzItbm91aXNsaWRlcl0nOiAndHJ1ZSdcclxuICB9LFxyXG4gIHRlbXBsYXRlOiAnPGRpdiBbYXR0ci5kaXNhYmxlZF09XCJkaXNhYmxlZCA/IHRydWUgOiB1bmRlZmluZWRcIj48L2Rpdj4nLFxyXG4gIHN0eWxlczogW2BcclxuICAgIDpob3N0IHtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIG1hcmdpbi10b3A6IDFyZW07XHJcbiAgICAgIG1hcmdpbi1ib3R0b206IDFyZW07XHJcbiAgICB9XHJcbiAgYF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOb3Vpc2xpZGVyQ29tcG9uZW50KSxcclxuICAgICAgbXVsdGk6IHRydWVcclxuICAgIH1cclxuICBdXHJcbn0sIF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbnN0YXRpYyBjdG9yUGFyYW1ldGVyczogKCkgPT4gKHt0eXBlOiBhbnksIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JJbnZvY2F0aW9uW119fG51bGwpW10gPSAoKSA9PiBbXG57dHlwZTogRWxlbWVudFJlZiwgfSxcbnt0eXBlOiBSZW5kZXJlcjIsIH0sXG5dO1xuc3RhdGljIHByb3BEZWNvcmF0b3JzOiB7W2tleTogc3RyaW5nXTogRGVjb3JhdG9ySW52b2NhdGlvbltdfSA9IHtcbidkaXNhYmxlZCc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidiZWhhdmlvdXInOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nY29ubmVjdCc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidsaW1pdCc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidtaW4nOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nbWF4JzogW3sgdHlwZTogSW5wdXQgfSxdLFxuJ3BpcHMnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nc25hcCc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidhbmltYXRlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuJ3JhbmdlJzogW3sgdHlwZTogSW5wdXQgfSxdLFxuJ3N0ZXAnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nZm9ybWF0JzogW3sgdHlwZTogSW5wdXQgfSxdLFxuJ3BhZ2VTdGVwcyc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidjb25maWcnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nbmdNb2RlbCc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidrZXlib2FyZCc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidvbktleWRvd24nOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nZm9ybUNvbnRyb2wnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4ndG9vbHRpcHMnOiBbeyB0eXBlOiBJbnB1dCB9LF0sXG4nY2hhbmdlJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbid1cGRhdGUnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ3NsaWRlJzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidzZXQnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ3N0YXJ0JzogW3sgdHlwZTogT3V0cHV0IH0sXSxcbidlbmQnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxufTtcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIE5vdWlzbGlkZXJNb2R1bGUgeyBzdGF0aWMgZGVjb3JhdG9yczogRGVjb3JhdG9ySW52b2NhdGlvbltdID0gW1xueyB0eXBlOiBOZ01vZHVsZSwgYXJnczogW3tcclxuICBpbXBvcnRzOiBbXSxcclxuICBleHBvcnRzOiBbTm91aXNsaWRlckNvbXBvbmVudF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbTm91aXNsaWRlckNvbXBvbmVudF0sXHJcbn0sIF0gfSxcbl07XG4vKiogQG5vY29sbGFwc2UgKi9cbnN0YXRpYyBjdG9yUGFyYW1ldGVyczogKCkgPT4gKHt0eXBlOiBhbnksIGRlY29yYXRvcnM/OiBEZWNvcmF0b3JJbnZvY2F0aW9uW119fG51bGwpW10gPSAoKSA9PiBbXG5dO1xufVxyXG5cbmludGVyZmFjZSBEZWNvcmF0b3JJbnZvY2F0aW9uIHtcbiAgdHlwZTogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbn1cbiJdfQ==