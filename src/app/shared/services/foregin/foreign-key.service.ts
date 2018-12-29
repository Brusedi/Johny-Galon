import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { locationToName,  getBaseLocation, getIdFromMeta, locToEntityOption } from './foreign-key.helper';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { tap, filter, switchMap, take, map } from 'rxjs/operators';
import { AddItem } from '@appStore/actions/any-entity-lazy-set.actions';
import { Observable } from 'rxjs';
import { DataProvService } from '../data-prov.service';


const QUESTION_PROP_FK_NAME = 'optionsRefLoc';

@Injectable({
  providedIn: 'root'
})


export class ForeignKeyService {
  constructor(
      private store: Store<fromStore.State>,
      private dataService: DataProvService
    ) {}

  public isExist$ = (loc:string) => this.store.select(fromSelectors.selectIsExist(locationToName(loc)));
  
  public buildOptions$ = (loc:string) =>  
     this.dataService.metadata$( getBaseLocation(loc) ).pipe(
        map( x => getIdFromMeta(x)  ),
        map( x => locToEntityOption(loc, x) )
    )

  // resolve$(){
  //   // return this.store.select( fromSelectors.selCurFormControls()).pipe(
  //   //   map( x=> x.questions  ),
  //   //   filter( x => x.length > 0 ),
  //   //   take(1),
  //   //   map( x => x.forEach( i => this.prepareDataForQuestion(i)  ) ),
  //   //   switchMap( () => (true) )
  //   // );
  // }

  // prepareDataForQuestion(x:{}) {
  //   x.hasOwnProperty(QUESTION_PROP_FK_NAME)? this.prepareDataForlocation(x[QUESTION_PROP_FK_NAME]) : null;
  // } 


  // prepareDataForlocation( location:string  ){
  //    const opt = locationToEntityOption( location) ;

  //    this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
  //     tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null )
  //   //   filter( x => x ),
  //   //   switchMap(() => this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)) ), 
  //   //   tap( x => !x ?  this.store.dispatch( new Exec( {name:opt.name , itemAction: new GetItemsMeta() }) ) : null ),
  //   //   filter( x => x ),
  //   //   //combineLatest( this.store.select( fromSelectors.selCurName()), (x,y)=> y ), 
  //   //   switchMap( () => this.store.select( fromSelectors.selCurName()) ),
  //   //   tap(x => x != opt.name ? this.store.dispatch( new SetCurrent(opt.name) ) : null ),
  //   //   filter( x => x == opt.name ),
  //   //   map( x => !!x ),
  //   // ).pipe(
  //   //   startWith(false),
  //   //   take(2)
  //   );



  //}


}
