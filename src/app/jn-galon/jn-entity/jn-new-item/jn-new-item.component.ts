import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of, from }  from 'rxjs';
import {  skipUntil, skip, combineLatest, map, tap, combineAll, mergeAll, merge, flatMap, mergeMap, filter, switchMap, groupBy, take, distinctUntilChanged } from 'rxjs/operators';

import { GetTemplate, SetRowSeed } from '@appStore/actions/any-entity.actions';
import { ExecCurrent, PartLoadByLoc } from '@appStore/actions/any-entity-set.actions';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';

const FG_VALID_STATE ='VALID';

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

  private controls$:     Observable<{ questions:any, formGroup:FormGroup} >;
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<fromStore.State>//,
    //private fkService: ForeignKeyService
  ) { }

  ngOnInit() {
    console.log('oninit');
    // Мозг не ебем, диспатчим обновить темплэйт строки Работаем с куром ! 
    this.store.dispatch( new ExecCurrent( new GetTemplate() ) );

    this.controls$ = 
      this.store.select( fromSelectors.selCurFormControls()).pipe(
         skipUntil( this.store.select( fromSelectors.selCurRowTemplate() ).pipe( skip(1) ) )   //горбатенько немного...
      );  

    // this.subscriptions.push( 
    //       this.store.select( fromSelectors.selCurRowTemplate()).pipe(
    //         skip(1)
    //         //filter( x => Object.keys(x).length > 0 )
    //       ).subscribe( //x=>  console.log(x)
    //               x=>this.store.dispatch(new ExecCurrent( new SetRowSeed(x)  ))
    //       )
    // );    
      
    // при любых изменениях пашим ровсид в стор  
    this.subscriptions.push(
        this.controls$
          .pipe( mergeMap(x => x.formGroup.valueChanges))
          .subscribe( x=> this.store.dispatch(new ExecCurrent( new SetRowSeed(x)  ) )) 
      );
  
    // this.store.dispatch( new Exec( { name:'NvaSdEventType' , itemAction: new GetItemsPart('./Ax/NvaSdEventType?SERVICEDESCID=1') }  

    const observablesFields$ = this.controls$.pipe(
      map(x => x.formGroup),
      combineLatest( 
          this.store.select(fromSelectors.selCurMacroParentFieldsWithLocs()),
          (fgr,fInfo) => 
              Object.keys(fInfo)
                .map( x => ({ ctrl:fgr.get(x), name:x, locs:fInfo[x] }) ).filter(z=>!!z.ctrl)
    ));
    


    const observablesControls$ =  observablesFields$.pipe(
      mergeMap( 
        x => x.map( y => 
              y.ctrl.valueChanges.pipe( 
                  combineLatest( of(y) , (v1,v2)=>({fld:v2.name, val:v1, locs:v2.locs })  )
      ))),
      mergeMap(x => from(x) )          
    );  

    //this.subscriptions.push( 
    //  observablesControls$.subscribe(x=>console.log(x)) 
    //);


    // Стрим отслеживающий тока нужные изменения формы с возвратом соответствующих локашинов
    // const observablesControls$ =  this.controls$.pipe(
    //   map(x => x.formGroup),
    //   combineLatest( 
    //       this.store.select(fromSelectors.selCurMacroParentFieldsWithLocs()),
    //       (fgr,fInfo) => 
    //           Object.keys(fInfo)
    //             .map( x => ({ ctrl:fgr.get(x), name:x, locs:fInfo[x] }) ).filter(z=>!!z.ctrl)
    //   ),
    //   //tap(x=>console.log(x)),
    //   mergeMap( 
    //     x => x.map( y => 
    //           y.ctrl.valueChanges.pipe( 
    //               combineLatest( of(y) , (v1,v2)=>({fld:v2.name, val:v1, locs:v2.locs })  )
    //           ))
    //   ),
    //   mergeAll(),
    // );
  
    // ресолвим локашин и фильтруем тока новые... почему мультиплекс не понял ?  
    const dispRequestForeignData$ = observablesControls$.pipe(
        map( x => x.locs),
        mergeMap((x:string[]) => from(x) ),
        mergeMap( x => this.store.select( fromSelectors.selectResolvedLoc(x))), 
        mergeMap( x => this.store.select( fromSelectors.selectPartLocationIfNotExist(x))),
        //tap(x=> console.log(x)),
        distinctUntilChanged( ),
        filter(x=>!!x)
    )              
    
    this.subscriptions.push( 
      dispRequestForeignData$.subscribe(
         x=> this.store.dispatch(new PartLoadByLoc( x ) )
      ) 
    );
  


    //this.store.dispatch( new ExecCurrent( new GetTemplate() ) );
    //this.subscriptions.push( 
    //  this.store.select( fromSelectors.selCurMacroParentFieldsWithLocs()).subscribe(x=>console.log(x)) 
    //);

    // Итак надо получить контролы которые должны менять  РАБОЧИЙ СТРИМ !!!!  
    // const observablesControls$ =  this.controls$.pipe(
    //   map(x => x.formGroup),
    //   //filter( x => !!x && x.status == FG_VALID_STATE  ),
    //   combineLatest( this.store.select( fromSelectors.selCurMacroParentFields()),(x1,x2)=> x2.map( x => x1.get(x) ).filter(z=>!!z)),
    //   tap(x=>console.log(x)),
    //   mergeMap( x => x.map( y => y.valueChanges)  ),
    //   mergeAll(),
    // );
  }

  ngOnDestroy(){ 
    console.log("unsubscribe");
    while(this.subscriptions.length > 0){
      this.subscriptions.pop().unsubscribe(); 
    } 
  }
  

  /**
   *  Dispatching request get new row template
   */
  // freshRowTemplate(){
  //   return this.store.select( fromSelectors.selCurName() ).pipe(take(1))
  //     .subscribe(
  //       x => {  
  //         console.log("fresh temptate disp");
  //         this.store.dispatch( new Exec( {name: x , itemAction: new GetTemplate() }) )  
  //     }
  //   )
  // }


}
// const observablesControls$ =  this.controls$.pipe(
    //   map(x => Object.keys(x.formGroup.controls).map(y=> x.formGroup.get(y))   ),
    //   mergeMap(x => x.map(y => y.valueChanges) ),
    //   mergeAll(),
    // )  
    //this.subscriptions.push(observablesControls$.subscribe(x => console.log(x) ) )  ;
    //this.subscriptions.push(observablesControls$.subscribe( x=>x.subscribe( x=> console.log(x)))); 
    
    
    // const observablesControls$ =  this.controls$.pipe(
    //   combineLatest( this.store.select( fromSelectors.selCurMacroParentFields()),(x1,x2)=> x2.map( x => x1.formGroup.get(x) )),
    //   //flatMap( x => x.map( y => y.valueChanges)  ),
    //   //flatMap( x => of(x) ),
      
    //   //combineAll(),
    //   //merge()
    // );

    // const observablesControls$ =  this.controls$.pipe(
    //   tap(x=>x.formGroup.valueChanges.subscribe( x=> console.log(x)))
    // );


    //this.subscriptions.push(observablesControls$.subscribe( x=>x.subscribe( x=> console.log(x))));    


    //this.subscriptions.push(this.store.select( fromSelectors.selCurMacroParentFields()).subscribe( x=>console.log(x)));    

    // // это набор контролов изменения которых требуют перестройки как минимум опшинов дроп-даунов.
    // const observablesControls$ = 
    //    this.controls$.pipe(
    //      combineLatest( this.store.select( fromSelectors.selCurMacroParentFields()), (x1,x2) => ({ fGroup:x1.formGroup, flds: x2 })) ,
    //      map( x =>  x.flds.map( itm => x.fGroup.get(itm) )),
    //    );

    // observablesControls$.subscribe( x=>console.log(x)  );    
     
    // observablesControls$.pipe(
    //     tap(x => console.log(x) ),
    //     map( x => x.map( i =>  i.valueChanges.subscribe( x=> console.log(x))  ) )
    //  )    


        


    //this.controls$.subscribe( x => console.log(x) ) ;
      // .pipe(
      //   filter( x => x.questions.length > 0 ),take(1)
      //   );


    //this.subscriptions.push(this.freshRowTemplate()); //Вот это разовая подписка ее впрынцыпе не надо держать,  но я по другому не умею.
    

    // // это набор контролов изменения которых требуют перестройки как минимум опшинов дроп-даунов.
    // const observablesControls$ = 
    //   this.controls$.pipe(
    //     combineLatest( this.store.select( fromSelectors.selCurMacroParentFields()), (x1,x2) => ({ fGroup:x1.formGroup, flds: x2 })) ,
    //     map( x =>  x.flds.map( itm => x.fGroup.get(itm) )),
    //   )

     
    // observablesControls$.pipe(
    //     map( x => x.map( i =>  i.valueChanges.subscribe( x=> console.log(x))  ) )
    //)    

    // const ctrlChnge = (ctrls:AbstractControl[]) => {
    //   while(this.ctrlChangesSubscr.length > 0){
    //     this.ctrlChangesSubscr.pop().unsubscribe(); 
    //   } 
    //   ctrls.forEach( x => 
    //     this.ctrlChangesSubscr.push( 
    //       x.valueChanges.pipe( 
    //           map(x => x), 
    //       )
    //     )
    //   );
    // }
          


    //this.subscriptions.push( observablesControls$.subscribe(x=> console.log(x)) );    

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

    // this.controls$.subscribe(
    //   x=> x.formGroup.valueChanges.subscribe( x=> console.log(x))
    // )
        // interval(1000).subscribe( 
    //   x => this.store.dispatch( new Jab())
    // );
    // this.store.select( fromSelectors.selCurJab()).subscribe(x=> console.log(x));  

    // this.store.select( fromSelectors.selCurName()).subscribe(
    //   x => interval(1000).subscribe( 
    //     y => this.store.dispatch(  new Exec( {name: x , itemAction: new Jab() }))
    // ));   

