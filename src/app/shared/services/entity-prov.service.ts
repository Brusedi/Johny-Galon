import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
//import { AnyEntityId } from '@appModels/any-entity';

import { anyEntityOptions, AnyEntityId, AnyEntity } from "@appModels/any-entity";
import { tap, filter, take, map, mergeMap, switchMap } from 'rxjs/operators';
import { AddItem, Exec, ExecItemAction } from '@appStore/actions/any-entity-set.actions';
import { GetItemsPart, GetItems, GetItemsMeta } from '@appStore/actions/any-entity.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
//import { AddItem } from '@appStore/actions/any-entity.actions';

@Injectable({
  providedIn: 'root'
})
export class EntityProvService {

  constructor(private store: Store<fromStore.State> ,private sanitizer : DomSanitizer) { }

/*
*  get stream with resolve data if need
*/
public itemData$ = (  opt:anyEntityOptions<AnyEntity> ,  id:any ) =>
    this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
        tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
        filter( x => x ),
        tap(  x => 
              this.store.select( fromSelectors.selectById(opt.name,id)).pipe(  take(1) )
                  .subscribe(x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItemsPart(opt.location + opt.selBack(id)) })))   
        ),
        mergeMap( x => this.store.select( fromSelectors.selectById(opt.name,id)) )
    )    

/*
*  get stream with resolve data if need as sanitizer img uri
*/
public itemDataB64AsImg$ = (  opt:anyEntityOptions<AnyEntity> ,  id:AnyEntity,   selF:((a:AnyEntity) => string ) ) =>
    this.sanifeImageBase64$(
        this.itemData$(opt,id).pipe(
            map(selF),
        ) 
    )

/*
*  get sanitizer img from base64 string
*/
public sanifeImageBase64$ = ( imageB64:Observable<string> ) =>
    imageB64.pipe(
        filter( x => !!x ),
        map( x => "data:image/png;base64,"+ x ),
        map( x => this.sanitizer.bypassSecurityTrustUrl(x)),

        //map( x => this.sanitizer.bypassSecurityTrustStyle(x) )
        //map( x => this.sanitizer.bypassSecurityTrustStyle("url('"+ x +"')"  ))
    );    

/*
*  get all collection data 
*/
public collectionData$ = (  opt:anyEntityOptions<AnyEntity>  ) =>
    this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
        tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
        filter( x => x ),
        tap(  x => 
              this.store.select( fromSelectors.selectIsDataLoaded(opt.name)).pipe(
                take(1)
              ).subscribe( x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItems(null) })))   
        ),
        mergeMap( x => this.store.select( fromSelectors.selectDataItems(opt.name)) )
    )  

/*
*  prepare and get metadata 
*/
public metaData$ = (  opt:anyEntityOptions<AnyEntity>  ) =>
    this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
        tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
        filter( x => x ),
        tap(  x => 
              this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)).pipe(
                take(1)
              ).subscribe( x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItemsMeta() })))   
        ),
        switchMap( x => this.store.select( fromSelectors.selectDataMetadata(opt.name)) ),
        tap(x=>console.log(x) )
    )  

/*
*  prepare and get controls
*/
public controls$ = (  opt:anyEntityOptions<AnyEntity> ,flds: string[], rowSeed: {} ) =>
    this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
        tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
        filter( x => x ),
        tap(  x => 
              this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)).pipe(
                take(1)
              ).subscribe( x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItemsMeta() })))   
        ),
        switchMap( x => 
            this.store.select( fromSelectors.selFormControlsEx( opt.name, flds, rowSeed )).pipe(
                filter(x=>!!x)
            ) 
        ),
        tap(x=>console.log(x) )
    )  


    

}


