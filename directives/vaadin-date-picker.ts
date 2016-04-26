import {
  Injector,
  OnInit,
  Directive,
  ElementRef,
  Output,
  HostListener,
  EventEmitter,
  Provider,
  forwardRef,
  Renderer
} from 'angular2/core';
import { NgControl, NG_VALUE_ACCESSOR, DefaultValueAccessor } from 'angular2/common';
import { CONST_EXPR } from 'angular2/src/facade/lang';
declare var Polymer;

const VAADIN_DATE_PICKER_CONTROL_VALUE_ACCESSOR = CONST_EXPR(new Provider(
    NG_VALUE_ACCESSOR, {
      useExisting: forwardRef(() => VaadinDatePicker),
      multi: true
    }));

@Directive({
  selector: 'vaadin-date-picker',
  providers: [VAADIN_DATE_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class VaadinDatePicker extends DefaultValueAccessor implements OnInit {

  private _element;
  private _control;

  ngOnInit() {
    this._control = this._injector.getOptional(NgControl);
  }

  @Output() valueChange: EventEmitter<any> = new EventEmitter(false);
  @HostListener('value-changed', ['$event.detail.value'])
  valuechanged(value) {
    this.valueChange.emit(value);

    if (value) {
      // Assuming that the registered onChange function is only used
      // for the pristine/dirty status here.
      this.onChange(value);
    }

    // Pass the invalid state to our native vaadin-date-picker element if
    // it is an ngControl.
    if (this._control != null) {
      this._element.invalid = !this._control.pristine && !this._control.valid;
    }
  }

  onImport(e) {
    this._element.$$('paper-input-container').addEventListener('blur', () => {
      if (!this._element.opened && !this._element._opened) {
        this.onTouched();
      }
    });
  }

  constructor(renderer: Renderer, el: ElementRef,  private _injector: Injector) {
    super(renderer, el);
    this._element = el.nativeElement;
    Polymer.Base.importHref('bower_components/vaadin-date-picker/vaadin-date-picker.html', this.onImport.bind(this));
  }

}
