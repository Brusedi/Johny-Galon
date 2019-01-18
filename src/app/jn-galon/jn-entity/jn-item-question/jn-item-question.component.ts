import { Component, OnInit, Input } from '@angular/core';
import { QuestionBase } from 'app/shared/question/question-base';
import { FormGroup, AbstractControl } from '@angular/forms';

import { Store } from '@ngrx/store';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { Observable } from 'rxjs';
import { PrepareByLoc, Exec } from '@appStore/actions/any-entity-set.actions';
import { filter } from 'rxjs/operators';
import { GetItemsPart } from '@appStore/actions/any-entity.actions';


const DEF_VALID_ERROR = "Неверное значение";
const REF_LOC_PROP    = "optionsRefLoc";

@Component({
  selector: 'app-jn-item-question',
  templateUrl: './jn-item-question.component.html',
  styleUrls: ['./jn-item-question.component.css']
})
export class JnItemQuestionComponent implements OnInit{ 

  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  
  private control: AbstractControl;
  private options$: Observable<{}[]>;

  constructor(
    private store: Store<fromStore.State>//,
    //private fkService: ForeignKeyService
  ) { 

  }

  ngOnInit(){
    this.control = this.form.controls[this.question.key];
    this.prepareSecondaryData();
    //options$ = this.question.controlType != 'dropdown' ? null : this.buildOptions$

    //this.question.controlType == 'dropdown'?this.prepareSecondaryData():null;
    if(this.question.controlType == 'dropdown'){
       this.options$ = this.store.select( fromSelectors.selectOptionsByLoc( this.question[REF_LOC_PROP] )); 
       //this.options$.subscribe(x=>console.log(x) ) ;
    }
    
  }

  private prepareSecondaryData (){
    !this.question.hasOwnProperty(REF_LOC_PROP) ? null:
        this.store.dispatch( new PrepareByLoc( this.question[REF_LOC_PROP] ));
    
    // еуыештп 
    !this.question.hasOwnProperty(REF_LOC_PROP) ? null:
        // this.store.dispatch( new Exec( { name:'NvaSdEventType' , itemAction: new GetItemsPart('./Ax/NvaSdEventType?SERVICEDESCID=1') })  ) ;
        this.store.select( fromSelectors.selectIsExistByLoc( this.question[REF_LOC_PROP] )).pipe(
             filter( x => !!x && this.question[REF_LOC_PROP] == './Ax/NvaSdEventType?servicedescid={ServiceDescID}' )
           ).subscribe( x => //console.log('eeeeeeeeeeeeeeeeeeeeeeeeee') 
               this.store.dispatch( new Exec( { name:'NvaSdEventType' , itemAction: new GetItemsPart('./Ax/NvaSdEventType?SERVICEDESCID=1') })  )  
           ) 

  }  



  buildOptions$(){
    return 

  }

  get isValid() { 
    //return this.form.controls[this.question.key].valid; 
    return  this.control.valid;
  }

  hasError(errorCode: string, path?: string[]) { 
    //return this.form.controls[this.question.key].hasError(errorCode, path); 
    return this.control.hasError(errorCode, path); 
  }

  errorMessage() { 
    const r = Object.keys(this.question.validationMessages).find( (x) => this.hasError(x) ) ;
    return r == undefined ? DEF_VALID_ERROR : this.question.validationMessages[r] ; 
  }

}
