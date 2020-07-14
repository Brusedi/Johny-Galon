import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
//import { AnyEntityId } from '@appModels/any-entity';

import { anyEntityOptions, AnyEntityId, AnyEntity } from "@appModels/any-entity";
import { tap, filter, take, map, mergeMap, switchMap } from 'rxjs/operators';
import { AddItem, Exec, ExecItemAction } from '@appStore/actions/any-entity-set.actions';
import { GetItemsPart, GetItems, GetItemsMeta, ChangeRowSeed, SetRowSeed, UpdateItem } from '@appStore/actions/any-entity.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { genRowTemplateByFldsDesc, getRowTemplateByFldsDesc } from '../question/adapters/question-adapt.helper';
//import { AddItem } from '@appStore/actions/any-entity.actions';


interface jnForm { questions:any, formGroup:FormGroup} ;

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
        //tap(x=>console.log(x) )
    )  

/*
*  prepare and get controls
*/
// public controls$ = (  opt:anyEntityOptions<AnyEntity> ,flds: string[], rowSeed: {} ) =>
//     this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
//         tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
//         filter( x => x ),
//         tap(  x => 
//               this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)).pipe(
//                 take(1)
//               ).subscribe( x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItemsMeta() })))   
//         ),
//         switchMap( x => 
//             this.store.select( fromSelectors.selFormControlsEx( opt.name, flds, rowSeed )).pipe(
//                 filter(x=>!!x)
//             ) 
//         ),
//         tap(x=>console.log(x) )
//     )  


// private getFormControls$ = (id:string, flds:string[], iVal$:Observable<{}>  ) =>
//     this.store.select( fromSelectors.selFormControlsEx$( id , flds, iVal$) ).pipe(
//         switchMap( x => x ) 
//     );  

/*
*  prepare and get controls for edit
*/
public controlsForEdit$ = (  opt:anyEntityOptions<AnyEntity> ,id:any ,flds: string[] ) =>
    this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
        tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
        filter( x => x ),
        tap(  x => 
              this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)).pipe(
                take(1)
              ).subscribe( x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItemsMeta() })))   
        ),
        tap( x => this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new SetRowSeed(null) }) ) ),
        tap( x => 
              this.itemData$( opt, id ).pipe(
                     filter(x=>!!x)
                 ).subscribe( x => {
                     this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new SetRowSeed(x) }) ) ;
                 }
        ) ),

        switchMap( x => 
            this.store.select( 
                fromSelectors.selFormControlsEx$( 
                    opt.name ,
                    flds,
                    this.store.select(fromSelectors.selRowSeed(opt.name)) 
                )
            )
            .pipe(switchMap( x => x ))
        )  
        //switchMap( x => this.getFormControls$(opt.name, flds,this.store.select(fromSelectors.selRowSeed(opt.name) ) ) ),
    )  



/*
*  prepare and get controls for edit and eject changes to rowseeed
*/    
public controlsForEditEx$ = (  opt:anyEntityOptions<AnyEntity> ,id:any ,flds: string[] ) => 
    this.controlsForEdit$(opt,id,flds).pipe(
        filter( x => x && x.formGroup  ),
        tap( (x:jnForm) => x.formGroup.valueChanges.subscribe( x =>
                this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new ChangeRowSeed(x) }) )
            )
        )
    )  
/**
 *  Run update record (from rowseed) actions 
 */
public updateItemByRowSeed = (  opt:anyEntityOptions<AnyEntity>  ) => 
    this.store.select(fromSelectors.selRowSeed(opt.name)).pipe(take(1))
        .subscribe(  x => {
                //console.log(x);
                this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new UpdateItem(x) }) )
            }
        );



/*
*  prepare and get controls 2020 wo id (insert or edit?)
*  Не реализована поддержка подгрузки темплэйта новой записи TODO !!!
*
*/
public controlsForEntityDefTempl$ = (   opt:anyEntityOptions<AnyEntity> ,excludeFlds: string[] ) =>
    this.metaData$(opt).pipe(
        filter(x => x && Object.keys(x.fieldsDesc).length > 0 ),
        map( x => ({ 
            meta:x, 
            templ: getRowTemplateByFldsDesc( Object.keys(x.fieldsDesc).map( y => x.fieldsDesc[y])) ,
            flds:Object.keys(x.fieldsDesc).filter(y => !excludeFlds.includes(y) )        
        })), 
        tap( x => this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new ChangeRowSeed(x.templ) }))), 
        switchMap( x => 
            this.store.select( 
                fromSelectors.selFormControlsEx$( 
                    opt.name ,
                    x.flds,
                    this.store.select(fromSelectors.selRowSeed(opt.name)) 
                )
            )
            .pipe(switchMap( x => x ))
        ));
        
        //map( x => Object.keys(x.fieldsDesc).map( y => x.fieldsDesc[y] ) )
        //map( x => genRowTemplateByFldsDesc( Object.keys(x.fieldsDesc).map( y => x.fieldsDesc[y] ) ) )
        //map( x => getRowTemplateByFldsDesc( Object.keys(x.fieldsDesc).map( y => x.fieldsDesc[y] ) ) )
        //map( x => Object.keys(x.fieldsDesc).filter(y => !excludeFlds.includes(y) ) ), 
        //switchMap( x =>  this.store.select( fromSelectors.selFormControlsEx$( opt.name , x, this.store.select(fromSelectors.selRowSeed(opt.name) ) ))),
        //fromSelectors.selFormControlsEx$( 

}

