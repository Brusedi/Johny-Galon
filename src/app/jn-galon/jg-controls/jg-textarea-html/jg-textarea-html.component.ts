import { Component, OnInit,  forwardRef, Input  } from '@angular/core';
import {  ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const replaceTable = [
  [ "&lt;%@", "<%@" ],
  [ "%&gt", "%>" ]
]

@Component({
  selector: 'app-jg-textarea-html',
  templateUrl: './jg-textarea-html.component.html',
  styleUrls: ['./jg-textarea-html.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => JgTextareaHtmlComponent),
    }
  ]

})
 

export class JgTextareaHtmlComponent implements ControlValueAccessor, OnInit {

  @Input() placeholder: string;
  private _onChange:any;
  private value:string; 
  private editorInstance:any;  

  private config =  { allowedContent: true , enterMode : 2 }

  writeValue(obj: any): void {
    
    this.value = this.preProc(obj) ;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn
  }

  registerOnTouched(fn: any): void {
    console.log(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    console.log('fff');
  }

  
  public onChange( event: any ) {

    event && event.sender ?   this._onChange( this.postProc( event.sender.getData()) ) : null 

    // const z = this.postProc( event.sender.getData())
    
    // this._onChange(
    //   this.postProc( event.sender.getData())
    //   )
  }

  public onKey( event: any ) {
    console.log(event);
  }    


  public onReady( event: any ) {
    //console.log(this.editorInstance)
    //this.editorInstance = event.sender;
    //this.editorInstance.config.allowedContent = true;
    //console.log(this.editorInstance)
  }

  constructor() { }

  ngOnInit() {
  }

  // Исправляем то что накозлил CKEditor
  private postProc = (dta:string) => replaceTable.reduce( (a,x)=> a.replace(x[0],x[1]) , dta ) ;
  // И назад в формат CKEditor
  private preProc  = (dta:string) => replaceTable.reduce( (a,x)=> a.replace(x[1],x[0]) , dta ) ;
  
}




// @Component({
//   selector: 'app-jg-textarea-html',
//   templateUrl: './jg-textarea-html.component.html',
//   styleUrls: ['./jg-textarea-html.component.css'],
//   providers: [{provide: MatFormFieldControl, useExisting: JgTextareaHtml}],
// })
// export class JgTextareaHtml implements ControlValueAccessor, MatFormFieldControl<JgTextareaHtmlComponent> , OnDestroy {

//     @Input()
//     get formControlName(): string { return this.id; }
//     set formControlName(value: string) {
//       this.id = value;
//       this.stateChanges.next();
//     }

//     static nextId = 0;

//     parts: FormGroup;
//     stateChanges = new Subject<void>();
//     focused = false;
//     errorState = false;
//     controlType = 'example-tel-input';
//     //id = `example-tel-input-${JgTextareaHtml.nextId++}`;
//     id ="Content";
//     describedBy = '';
//     onChange = (_: any) => {};
//     onTouched = () => {};
  
//     get empty() {
//       const {value: {area, exchange, subscriber}} = this.parts;
  
//       return !area && !exchange && !subscriber;
//     }
  
//     get shouldLabelFloat() { return this.focused || !this.empty; }
  
//     @Input()
//     get placeholder(): string { return this._placeholder; }
//     set placeholder(value: string) {
//       this._placeholder = value;
//       this.stateChanges.next();
//     }
//     private _placeholder: string;
  
//     @Input()
//     get required(): boolean { return this._required; }
//     set required(value: boolean) {
//       this._required =  true; //  coerceBooleanProperty(value);
//       this.stateChanges.next();
//     }
//     private _required = false;
  
//     @Input()
//     get disabled(): boolean { return this._disabled; }
//     set disabled(value: boolean) {
//       this._disabled = false ; //  coerceBooleanProperty(value);
//       this._disabled ? this.parts.disable() : this.parts.enable();
//       this.stateChanges.next();
//     }
//     private _disabled = false;
  
//     @Input()
//     get value(): JgTextareaHtmlComponent | null {
//       const {value: {area, exchange, subscriber}} = this.parts;
//       if (area.length === 3 && exchange.length === 3 && subscriber.length === 4) {
//         return new JgTextareaHtmlComponent(); //area, exchange, subscriber
//       }
//       return null;
//     }
//     set value(tel: JgTextareaHtmlComponent | null) {
//       //const {area, exchange, subscriber} = tel || new JgTextareaHtmlComponent(); //'', '', ''
//       //this.parts.setValue({area, exchange, subscriber});
//       this.stateChanges.next();
//     }
  
//     constructor(
//       formBuilder: FormBuilder,
//       private _focusMonitor: FocusMonitor,
//       private _elementRef: ElementRef<HTMLElement>,
//       @Optional() @Self() public ngControl: NgControl) {
  
//       this.parts = formBuilder.group({
//         area: '',
//         exchange: '',
//         subscriber: '',
//       });
  
//       _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
//         if (this.focused && !origin) {
//           this.onTouched();
//         }
//         this.focused = !!origin;
//         this.stateChanges.next();
//       });
  
//       if (this.ngControl != null) {
//         this.ngControl.valueAccessor = this;
//       }
//     }
  
//     ngOnDestroy() {
//       this.stateChanges.complete();
//       this._focusMonitor.stopMonitoring(this._elementRef);
//     }
  
//     setDescribedByIds(ids: string[]) {
//       this.describedBy = ids.join(' ');
//     }
  
//     onContainerClick(event: MouseEvent) {
//       if ((event.target as Element).tagName.toLowerCase() != 'input') {
//         this._elementRef.nativeElement.querySelector('input')!.focus();
//       }
//     }
  
//     writeValue(tel: JgTextareaHtmlComponent | null): void {
//       this.value = tel;
//     }
  
//     registerOnChange(fn: any): void {
//       this.onChange = fn;
//     }
  
//     registerOnTouched(fn: any): void {
//       this.onTouched = fn;
//     }
  
//     setDisabledState(isDisabled: boolean): void {
//       this.disabled = isDisabled;
//     }
  
//     _handleInput(): void {
//       this.onChange(this.parts.value);
//     }
//   }

  // set value(ctrl: JgTextareaHtmlComponent | null) {
  //   this.stateChanges.next();
  // }  

  // id = "Content";

  // @Input()
  // get placeholder() {
  //   return this._placeholder;
  // }
  // set placeholder(plh) {
  //   this._placeholder = plh;
  //   this.stateChanges.next();
  // }

  // private _placeholder: string;
  
  // ngControl: NgControl = null;
  
  // focused: boolean = false; 
  // empty: boolean;
  // shouldLabelFloat: boolean;
  // required: boolean;
  // disabled: boolean;
  // errorState: boolean;
  // controlType?: string;
  // autofilled?: boolean;

  


  // setDescribedByIds(ids: string[]): void {
  //   throw new Error("Method not implemented.");
  // }
  // onContainerClick(event: MouseEvent): void {
  //   throw new Error("Method not implemented.");
  // }

  // ngOnDestroy() {
  //   this.stateChanges.complete();
  // }
  
//}
