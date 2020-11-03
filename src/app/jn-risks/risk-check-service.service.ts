import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '@appStore/index'
import * as fromSelectors from '@appStore/selectors/index';
import { RiskAssessmentOption, RiskExamItemsOption, RiskFactorsOption } from '@appModels/entity-options';
import { distinctUntilChanged, filter, map, take, } from 'rxjs/operators';
import { combineLatest } from 'rxjs';


const VIRT_FIELD_PREFIX = "RF_";
const FIELD_ID = "RECID";
const FIELD_WEIGHT = "WEIGHT";
const FIELD_WEIGHTFROM = "WEIGHTFROM";
const FIELD_WEIGHTTO   = "WEIGHTTO";

const FIELD_NAME    = "NAME";
const FIELD_SNAME   = "SHORTNAME";
const FIELD_COLOR   = "WEBCOLOR";



@Injectable({
  providedIn: 'root'
})

export class RiskCheckServiceService {
  constructor(private store: Store<fromStore.State>) { 
  }

  private compareRowSeed = ( x1:any, x2:any ) => 
      Object.keys(x1)
        .filter( x => x.startsWith(VIRT_FIELD_PREFIX))
        .reduce( ( a, x ) => a && x1[x] == x2[x]  , true  ) ;

  private getSettedFieldId = (row:{})=>
    Object.keys(row)
      .filter( x => x.startsWith(VIRT_FIELD_PREFIX))
      .filter( x => !!row[x])

  private riskFactorsWeight$ = this.store.pipe( 
      select( fromSelectors.selectDataItems(RiskFactorsOption.name)),
      filter( x => !!x ),
      map( (x:[]) => 
        x.reduce( (a,y) => ({...a, [VIRT_FIELD_PREFIX + y[FIELD_ID]] : y[FIELD_WEIGHT] }) , ({}) )
      ),
      take(1)
    )     

  private riskExam$ = this.store.pipe( 
    select( fromSelectors.selRowSeed(RiskExamItemsOption.name)),
    filter( x => !!x ),
    distinctUntilChanged(this.compareRowSeed),
    map(this.getSettedFieldId)
  )  

  private riskAssessmentS = this.store.pipe( 
    select( fromSelectors.selectDataItems(RiskAssessmentOption.name)),
    filter( x => !!x ),
    take(1)
  )  

  private getAssessment = ( w:number , l:[] ) =>
    l.reduce( (a,x:{}) =>  !a && w >= x[FIELD_WEIGHTFROM] &&  w <= x[FIELD_WEIGHTTO] ? ({ Weight:w, Name: x[FIELD_NAME], Sname: x[FIELD_SNAME], Color:x[FIELD_COLOR]  }) : a ,null        )

  public assessmentStream$ =  //this.riskFactorsWeight$
    combineLatest(this.riskExam$, this.riskFactorsWeight$,this.riskAssessmentS).pipe(
      map( (x:[[],{},[]]) => [ x[0].reduce( (a,v)=> a + x[1][v] ,0 ), x[2] ] ),             //calc weight
      map( ( x:[number,[]]) =>  this.getAssessment( x[0],x[1])  )                           // to Assessment obj
    )
          
}
