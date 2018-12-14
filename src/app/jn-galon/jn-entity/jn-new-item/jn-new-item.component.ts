import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { of, Observable } from 'rxjs';
import { GetTemplate } from '@appStore/actions/any-entity.actions';
import { Exec } from '@appStore/actions/any-entity-set.actions';

/**
 *  План 
 *  1. Список контролов он из списка полей с метаданными..
 *  2. Пробуем загрузить метаданные
 * 
 */


@Component({
  selector: 'app-jn-new-item',
  templateUrl: './jn-new-item.component.html',
  styleUrls: ['./jn-new-item.component.css']
})
export class JnNewItemComponent implements OnInit {

  controls$:    Observable<any>;
  rowTemplate$: Observable<any>;
  rowSeed$:      any;

  constructor(private store: Store<fromStore.State>) { }

  ngOnInit() {
    
    this.store.dispatch( new Exec( {name:"JgMockTable" , itemAction: new GetTemplate() })  );

    this.rowTemplate$ = this.store.select( fromSelectors.selectTemplate("JgMockTable")); 
    this.rowTemplate$.subscribe(x=>console.log(x));

    this.controls$ = this.store.select( fromSelectors.selectFormControls("JgMockTable",of({})));  
    
  }

  //  // this.store.select( fromSelectors.selectDataOptions("JgMockTable")).subscribe(x => console.log(x) );
  //   //this.store.select( fromSelectors.selectData("JgMockTable")).subscribe(x => console.log(x) );
  //   //this.store.select( fromSelectors.selectDataMetadata("JgMockTable")).subscribe(x => console.log(x) );
  //  // this.store.select( fromSelectors.selectDataMetadata("JgMockTable")).subscribe(x => console.log(x) );
  //  //this.store.select(fromSelectors.selectFormGroup("JgMockTable",of({}))).subscribe( x=> console.log(x) )

  //  //this.store.select( fromSelectors.selectQuestions("JgMockTable", of({}))).subscribe( x=> console.log(x) );    
  //  this.store.select( fromSelectors.selectFormGroup("JgMockTable",of({}))).subscribe( x=> console.log(x) );    
   

  //  this.questions$ = this.store.select( fromSelectors.selectQuestions("JgMockTable", of({}))) ; //.subscribe( x=> this.quest = x );    
  //  //this.store.select( fromSelectors.selectFormGroup("JgMockTable",of({}))).subscribe( x=> this.form = x );    
  //   // this.store.select(fromSelectors.selectFormGroup("JgMockTable",of({}))).subscribe( x=> console.log(x) )

  //  //this.questions$.subscribe( x=> this.form = toFormGroup(x,) );

  //  //this.questions$.subscribe(x => console.log(x) );

  //  this.form$ = this.store.select( fromSelectors.selectFormGroup("JgMockTable",of({})));

  //   this.userForm = new FormGroup({
  //     name: new FormControl(),
  //     age: new FormControl('20')
  //   });   

  //   console.log(this.userForm );
  //}

}
