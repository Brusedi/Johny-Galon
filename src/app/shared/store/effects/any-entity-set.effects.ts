import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";

import { of } from "rxjs";

import { map, mergeMap, catchError, tap } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

import { DataProvService } from "app/shared/services/data-prov.service";
import { AnyEntitySetActionTypes, Exec, ExecItemAction, CompleteItemAction } from "@appStore/actions/any-entity-set.actions";
import { anyEntityActions, AnyEntityActionTypes, GetItemsMetaSuccess, ErrorAnyEntity, GetTemplateSuccess } from "@appStore/actions/any-entity.actions";
import { anyEntityOptions } from "@appModels/any-entity";
import { MetadataProvService } from "app/shared/services/metadata/metadata-prov.service";

//import { AnyEntityLazySetActionTypes, ExecItemAction,  CompleteItemAction, Exec } from "@appStore/actions/any-entity-lazy-set.actions";
//import { AnyEntityLazyActionTypes, anyEntityLazyActions, GetItemSuccess, GetItemNotFound } from "@appStore/actions/any-entity-lazy.actions";
//import { anyEntityOptions } from "@appModels/any-entity";
//import { anyEntityOptions } from "@appStore/reducers/any-entity-lazy-set.reduser";


@Injectable()
export class anyEntytySetEffects {
  constructor(
      private actions$:         Actions, 
      private dataService:      DataProvService,
      private metadataService:  MetadataProvService
) {}

    @Effect()   //.insert(action.payload.location, action.payload.data)
    ExecAction$ = this.actions$.pipe(
        ofType(AnyEntitySetActionTypes.EXEC),
        //map( (x:Exec) => {console.log(x); return x }  ),
        map( (x:Exec) => new ExecItemAction({ itemOption: x.reduserData, itemAction: x.payload.itemAction } ))   
    )
      
    @Effect()   //.insert(action.payload.location, action.payload.data)
    ExecItemAction$ = this.actions$.pipe(
        ofType(AnyEntitySetActionTypes.EXEC_ANY_ENTITY_ACTION),
        mergeMap( (x:ExecItemAction) =>  
            this.procNextSubAction$(
                x.payload.itemOption,  
                this.procSubAction$( x.payload.itemAction, x.payload.itemOption )
            )   
        )
    )            

    // proceccing child items effects            
    private procSubAction$ = ( action : anyEntityActions, options: anyEntityOptions<any>  ): Observable<any> => {
        switch(action.type){
            case ( AnyEntityActionTypes.GET_ITEMS_META ) :
                return this.metadataService.metadata$( options.location ) // options.selBack(action.payload)
                    .pipe(
                        map(x => new GetItemsMetaSuccess(x) ),
                        catchError(error => of(new ErrorAnyEntity(error)))
                    ); 

            case ( AnyEntityActionTypes.GET_TEMPLATE ) :{
                console.log('ssssssssssssss');
                return this.dataService.template$( options.location ) // options.selBack(action.payload)
                    .pipe(
                        tap(x=> console.log(x)),
                        map(x => new GetTemplateSuccess(x) ),
                        catchError(error => of(new ErrorAnyEntity(error)))
                    ); 
            }            
                        
            default:
                return of(null);
        }
    }   
    
    private procNextSubAction$ = ( options: anyEntityOptions<any>,  act$: Observable<any> ): Observable<any> => 
        act$.pipe( 
            map(x  =>  x != null ? 
                    new ExecItemAction( { itemOption:options, itemAction: x } ) : 
                    new CompleteItemAction({ name: options.name } ) 
            )
        );       


}
