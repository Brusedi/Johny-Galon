import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";

import { of } from "rxjs";

import { map, mergeMap } from "rxjs/operators";
import { Observable } from "rxjs/Observable";

import { DataProvService } from "app/shared/services/data-prov.service";

import { AnyEntityLazySetActionTypes, ExecItemAction,  CompleteItemAction, Exec } from "@appStore/actions/any-entity-lazy-set.actions";
import { AnyEntityLazyActionTypes, anyEntityLazyActions, GetItemSuccess, GetItemNotFound } from "@appStore/actions/any-entity-lazy.actions";
import { anyEntityOptions } from "@appModels/any-entity";
//import { anyEntityOptions } from "@appStore/reducers/any-entity-lazy-set.reduser";




@Injectable()
export class anyEntytyLazySetEffects {
  constructor(
      private actions$: Actions, 
      //private store$: Store<State>,
      private dataService: DataProvService
) {}

    @Effect()   //.insert(action.payload.location, action.payload.data)
    ExecAction$ = this.actions$.pipe(
        ofType(AnyEntityLazySetActionTypes.EXEC),
        //map( (x:Exec) => {console.log(x); return x }  ),
        map( (x:Exec) => new ExecItemAction({ itemOption: x.reduserData, itemAction: x.payload.itemAction } ))   
    )
      
    @Effect()   //.insert(action.payload.location, action.payload.data)
    ExecItemAction$ = this.actions$.pipe(
        ofType(AnyEntityLazySetActionTypes.EXEC_ANY_ENTITY_LAZY_ACTION),
        mergeMap( (x:ExecItemAction) =>  
            this.procNextSubAction$(
                x.payload.itemOption,  
                this.procSubAction$( x.payload.itemAction, x.payload.itemOption )
            )   
        )
    )            

    private procSubAction$ = ( action : anyEntityLazyActions, options: anyEntityOptions<any>  ): Observable<any> => {
        switch(action.type){
            case ( AnyEntityLazyActionTypes.GET_ITEM ) :
                return this.dataService.items$( options.location, options.selBack(action.payload) )
                    .pipe(
                        map( x => x.length > 0 ? 
                          new GetItemSuccess(x[0]) :
                          new GetItemNotFound( action.payload ) 
                        )
                    ); 
                        
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
