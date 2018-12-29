import { Component, OnInit, Input } from '@angular/core';
import { QuestionBase } from 'app/shared/question/question-base';
import { FormGroup, AbstractControl } from '@angular/forms';

import { Store } from '@ngrx/store';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { Observable } from 'rxjs';


const DEF_VALID_ERROR = "Неверное значение";

@Component({
  selector: 'app-jn-item-question',
  templateUrl: './jn-item-question.component.html',
  styleUrls: ['./jn-item-question.component.css']
})
export class JnItemQuestionComponent implements OnInit{ 

  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;
  
  private control: AbstractControl;
  private options$: Observable<string>;

  constructor(
    private store: Store<fromStore.State>//,
    //private fkService: ForeignKeyService
  ) { 


  }

  ngOnInit(){
    this.control = this.form.controls[this.question.key];

    //options$ = this.question.controlType != 'dropdown' ? null : this.buildOptions$

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
