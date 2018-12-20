import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { of, Observable, Subscription } from 'rxjs';
import { GetTemplate } from '@appStore/actions/any-entity.actions';
import { Exec } from '@appStore/actions/any-entity-set.actions';
import { FormGroup } from '@angular/forms';
import { take,combineLatest, filter, map, tap } from 'rxjs/operators';


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
export class JnNewItemComponent implements OnInit, OnChanges {

  private controls$:     Observable<{ questions:any, formGroup:FormGroup} >;
  private subscriptions: Subscription[] = [];

  constructor(private store: Store<fromStore.State>) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    // if( changes["dbc"].firstChange){
    //   //this.initDataStreams();
    // }

  }


  ngOnInit() {

    this.subscriptions.push(this.freshRowTemplate());
    this.controls$ = this.store.select( fromSelectors.selCurFormControls()).pipe(filter( x => x.questions.length > 0 ),take(1));

    const observablesControls$ = 
      this.controls$.pipe(
        combineLatest( this.store.select( fromSelectors.selCurMacroParentFields()).pipe(take(1)), (x1,x2) => ({ fGroup:x1.formGroup, flds: x2 })) ,
        tap(x=> console.log(x)),
        map( x =>  x.flds.map( itm => x.fGroup.get(itm) ))  
      )
        


    // this.controls$.subscribe(
    //   x=> x.formGroup.valueChanges.subscribe( x=> console.log(x))
    // )

    observablesControls$.subscribe(
      x => console.log(x)
    );

    //this.subscriptions.push(
    //  this.controls$.subscribe(x=> console.log(x));//);      

    // const observablesControls$ = 
    //     this.store.select( fromSelectors.selCurMacroParentFields()).pipe(
    //         //take(1),
    //         combineLatest(this.controls$, ( f,c ) => ({ fields:f, fGroup: c.formGroup }) ),
    //         tap(x=> console.log(x.fGroup.get()) ),
    //         map( x =>  x.fields.map( itm => x.fGroup.get(itm) ))
    //     ); 

    //observablesControls$.subscribe(x=> console.log(x));      






    //this.store.select( fromSelectors.selCurFieldDescribes()).subscribe( x => console.log(x) );

    // this.store.select( fromSelectors.selCurMacroParentFields()).pipe(take(1))
    //   .subscribe( x =>
    //     x.forEach( i => this.subscriptions.push( 
    //             frm.get(i).valueChanges
    //     )
    //   );
    

    // const formChangeSubscribeTarget = ( frm:FormGroup, flds:string[] ) => 
    //   flds
    //     .forEach(
    //       i => this.subscriptions.push( 
    //         frm.get(i).valueChanges
    //         //.do( x=> console.log(x) )
    //         .map( x => { var r = this.form.value ; r[i] = x; return r; }  ) //  на этот момент валью группы не обновлено - вручную тыкаем значение
    //         //.do( x=> console.log(x) )
    //         .subscribe(  x => this.rowSeed$.next( x )  )
    //       )      
    //     );



    //this.rowTemplate$ = this.store.select( fromSelectors.selectTemplate("JgMockTable")); 
    //this.rowTemplate$.subscribe(x=>console.log(x));
    //this.controls$.subscribe(x=> console.log(x));
  }
  


  /**
   *  Dispatching request get new row template
   */
  freshRowTemplate(){
    return this.store.select( fromSelectors.selCurName() ).pipe(take(1))
      .subscribe(
        x =>  this.store.dispatch( new Exec( {name: x , itemAction: new GetTemplate() }) )
    )
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

  ngOnDestroy(){ 
    console.log("unsubscribe");
    while(this.subscriptions.length > 0){
      this.subscriptions.pop().unsubscribe(); 
    } 
  }

}
