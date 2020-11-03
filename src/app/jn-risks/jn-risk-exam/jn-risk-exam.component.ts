import { Component, OnInit } from '@angular/core';
import { EntityProvService } from 'app/shared/services/entity-prov.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Store,select } from '@ngrx/store';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { Observable, of, from, Subscription, Subject, BehaviorSubject } from 'rxjs';
import { RiskExamItemsOption, RiskFactorsGroupOption } from '@appModels/entity-options';
import { ErrorEnvironment } from '@appStore/actions/environment.actions';
import { Location } from '@angular/common';
import { take, tap, map, filter, mergeMap, combineLatest, toArray, skip, switchMap, skipUntil, distinctUntilChanged } from 'rxjs/operators';
import { ExecItemAction } from '@appStore/actions/any-entity-set.actions';
import { AddItem } from '@appStore/actions/any-entity.actions';
import { XSRF_HEADER_NAME } from '@angular/common/http/src/xsrf';
import { RiskCheckServiceService } from '../risk-check-service.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

const SB_STYLE_PREFIX = "jg-snack-bar-"
const STATUS_VALID = "VALID";


@Component({
  selector: 'app-jn-risk-exam',
  templateUrl: './jn-risk-exam.component.html',
  styleUrls: ['./jn-risk-exam.component.css']
})

export class JnRiskExamComponent implements OnInit {

  freeControls$:          Observable<any>;
  groupControls$:         Observable< {data:object , model:boolean,  ctrl:Observable<any>}[] > ;
  assessmentStyle$:       Observable<string>;
  assessmentText$:        Observable<string>;
  valid$:                 BehaviorSubject<any>;
  isComplete$:            BehaviorSubject<{}>;
  //insertedData$:        Observable<{}>;

  //isComplete$:            Observable<{}>;


  withoutGroupFunc:       (x:string) => Observable<boolean>  ;

  private subscriptions:  Subscription[] = [];
  
  constructor(
      private entityProv: EntityProvService, 
      private route: ActivatedRoute ,
      private store: Store<fromStore.State> ,
      private router: Router, 
      private location: Location,
      private riskService: RiskCheckServiceService,
      private _snackBar: MatSnackBar
    ) { 
  } 

  ngOnInit() {
    if(!this.route.snapshot.data["isLoad"] ){
      //console.log("форма!");
      this.location.back();
    }
    else{
      this. initStreams();
    }
  } 

  private initStreams(){

      //console.log("streams!");
      this.valid$ = new BehaviorSubject(false);
      this.isComplete$ = new BehaviorSubject(null);  

      // complete steram
      this.subscriptions.push( 
          this.store.pipe( 
            select( fromSelectors.selInsertedId(RiskExamItemsOption.name)), 
            skip(1),
            distinctUntilChanged(),
            mergeMap( x => !x ? of(x): this.store.pipe(  select( fromSelectors.selectDataRowIfExist(RiskExamItemsOption.name,x) )  )),
            //filter(x => !!x ),
            //tap((x) => console.log(x) )
          )
          .subscribe( (x) => this.isComplete$.next(x))
      )  

      //this.isComplete$.subscribe((x) => console.log(x)    )
      // 
      // this.insertedData$ = this.isComplete$.pipe(
      //   filter(x => !!x ),
      //   tap((x) => console.log(x) ), 
      //   //switchMap( x => this.store.pipe(  select( fromSelectors.selectDataRowIfExist(RiskExamItemsOption.name,x) )  ))
      // )
      // this.insertedData$.subscribe( x => console.log(x));
      
      
      //Выбрать контролы не входящие в группы
      this.withoutGroupFunc = (fldName) => this.store.select(fromSelectors.selFieldDescribe(RiskExamItemsOption.name, fldName )).pipe(
          take(1),
          map( x => x && x.hasOwnProperty("group") && !!x.group ? false: true )   
      ) ;
      //this.freeControls$ = this.entityProv.controlsForEntityDefTempl$(RiskExamItemsOption , this.withoutGroupFunc ).pipe(tap(x=>console.log(x))); 
      
      this.freeControls$ = this.entityProv.controlsForEntityLoadTempl$(RiskExamItemsOption , this.withoutGroupFunc ).pipe(
          //tap((x) => console.log(x) ),        
          tap((x) => x.subscribtions.forEach( i =>  this.subscriptions.push(i))),        
          tap((x) => this.subscriptions.push(
                        x.formGroup.statusChanges.subscribe( 
                            s => this.valid$.next( s == STATUS_VALID ) ,  // == STATUS_VALID ? true : false 
                            e => this.valid$.error(e) ,  
                            () => this.valid$.complete
                      )))  
      );

      this.groupControls$ =  this.store.select(fromSelectors.selectDataItems(RiskFactorsGroupOption.name)).pipe( 
          take(1),
          map( xs => xs.map( y => ({
                data:y,  
                ctrl:this.entityProv.controlsForEntityDefTemplByGroup$(RiskExamItemsOption, y["RECID"].toString() ) 
            }))
          ),
          mergeMap( xs => from(xs).pipe(
                mergeMap( x =>  x.ctrl.pipe(  combineLatest( of(x.data) , (a,b) => ({ data: b, ctrl:a  }) ))),

                filter( x => x.ctrl.questions &&  x.ctrl.questions.length > 0  ) ,
                map( x =>  ({ data:x.data, model:! x.data["ISDISCONNECTABLE"] , ctrl:of(x.ctrl)  })  ),
                toArray()
             ))         
      );    

      this.assessmentText$  = this.riskService.assessmentStream$.pipe(  map( x => x['Sname'] ) );         // {{assessmentStyle$ | async}}"
      this.assessmentStyle$ = this.riskService.assessmentStream$.pipe(  map( x => x['Color'] ) );
      //this.valid$ = this.freeControls$.pipe( mergeMap( x => x["formGroup"]["statusChanges"] ));
      //this.valid$ = this.freeControls$.pipe( tap( x => x.formGroup.get('family').valueChanges.subscribe( x => console.log(x));.valueChanges.subscribe( y => console.log(y)  )));

      //this.valid$ = this.freeControls$.pipe( tap( x => x.formGroup.get('FlightRoute').valueChanges.subscribe( x => console.log(x))));

      this.subscriptions.push(
         this.riskService.assessmentStream$.pipe(
            skip(1)
          ).subscribe( x => this._snackBar.open(x['Name'], x['Sname'] +' ('+ x['Weight'] + ')' , {  duration: 2000 ,panelClass :[ SB_STYLE_PREFIX + x['Color'] ] } ) )
      ); 
  }    

  ngAfterViewInit(){

  
  }

  ngOnDestroy(){ 
    while(this.subscriptions.length > 0){
      this.subscriptions.pop().unsubscribe(); 
    } 
  }

  Save() {
    this.entityProv.insertItemByRowSeed(RiskExamItemsOption).unsubscribe();
  }  

  onAddNextMessageClick(){
    this.isComplete$.next(null)
  }  

}
