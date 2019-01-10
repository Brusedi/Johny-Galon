import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { locationToName,  getBaseLocation, getIdFromMeta, locToEntityOption } from './foreign-key.helper';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { tap, filter, switchMap, take, map, mergeMap, combineLatest } from 'rxjs/operators';
import { DataProvService } from '../data-prov.service';
import { Exec, AddItem } from '@appStore/actions/any-entity-set.actions';
import { GetItemsMeta } from '@appStore/actions/any-entity.actions';


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
  );
  
  public prepareForeignData$ = (loc:string) => {  
    const getLocOption$ = ( loc:string, isFromStore:boolean ) =>     // либо билдит с эффектами либо из стора если он там есть         
      (false ?  this.store.select( fromSelectors.selectDataOptions(loc) ) : this.buildOptions$( loc )).pipe(
        tap(x=>console.log(x) ),
        map( x => ({ opt:x, isExst:isFromStore }) )
      )

    return this.isExist$(loc)
      .pipe(
        map( x => ({lc:loc, isExst:x})),
        tap(x=>console.log(x) ),
        mergeMap( x => getLocOption$( x.lc, x.isExst )),
        tap( x => !x.isExst ? this.store.dispatch( new AddItem(x.opt)) : null ),
        filter( x => x.isExst),
        tap(x=>console.log(x) )
      )
      .pipe(          
        map( x => x.opt),
        mergeMap( o =>  this.store.select(fromSelectors.selectIsMetadataLoaded(o.name)).pipe(map(x=>({isMdLoaded:x, opt:o })))),
        tap( x => x.isMdLoaded ? null:  this.store.dispatch( new Exec( {name:x.opt.name , itemAction: new GetItemsMeta()}))),
        filter( x => x.isMdLoaded ),
        map( x => !!x.isMdLoaded )//,
        //take(1)
    )
  }      



      // isExist$().pipe(
      //   mergeMap( x => x ? this.store.select( fromSelectors.selectDataOptions()   )

         

      //   tap( x => !x ? this.store.dispatch( new AddItem(opt)) : null ),



      // )

    // return this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
    //   tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
    //   filter( x => x ),
    //   //combineLatest( this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)), (x,y)=> y ), 
    //   switchMap(() => this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)) ), 
    //   tap( x => !x ?  this.store.dispatch( new Exec( {name:opt.name , itemAction: new GetItemsMeta() }) ) : null ),
    //   filter( x => x ),
    //   //combineLatest( this.store.select( fromSelectors.selCurName()), (x,y)=> y ), 
    //   switchMap( () => this.store.select( fromSelectors.selCurName()) ),
    //   tap(x => x != opt.name ? this.store.dispatch( new SetCurrent(opt.name) ) : null ),
    //   filter( x => x == opt.name ),
    //   map( x => !!x ),
    // ).pipe(
    //   startWith(false),
    //   take(2)
    // );    


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
