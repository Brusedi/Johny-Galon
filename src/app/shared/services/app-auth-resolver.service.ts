import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, Observable } from 'rxjs';
import { map, tap, delay, mergeMap, switchMap, mergeAll, toArray } from 'rxjs/operators';
import { Either } from '@appModels/monad';

import * as fromStore from '@appStore/index';
//import * as fromSelectors from '@appStore/selectors/index';
import { Store } from '@ngrx/store';
import { EntityProvService } from './entity-prov.service';
import { IBackContextDescriptor } from '@appModels/any-entity';
import { error } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class AppAuthResolverService {

  constructor(
    private store: Store<fromStore.State>,
    private entityProv:EntityProvService
    ) { }

  resolve = (route: ActivatedRouteSnapshot, state:RouterStateSnapshot) => 
      Either.Right<Observable<boolean>, ActivatedRouteSnapshot>(route)
          //.tap(x=>console.log(x))
          .bind( y =>   y && y.data && y.data.hasOwnProperty("load") 
                        ? Either.Right< Observable<boolean> , IBackContextDescriptor<any>[]>( y.data["load"] )  
                        : Either.Left< Observable<boolean> , IBackContextDescriptor<any>[]>(of(true) ) )
          .map( x => 
                        this.entityProv.loadFromBack$(x).pipe(
                            toArray(),
                            map( v => v.reduce( (a,i) => a && i.loaded  ,true  ) )
                        )
          )    
          //.tap( x => console.log(x))
          .run() 
          .pipe(
            //tap(  x => console.log(x) ) ,
          ) ;

  
    //  of( Either.Right<Observable<boolean>, ActivatedRouteSnapshot>(route)).pipe(
    //   tap(x => console.log(x.run()) ),
    //   map(x => x
    //             .tap(x=>console.log(x))
    //             .bind( y =>   y && y.data && y.data.hasOwnProperty("load") 
    //                           ? Either.Right< Observable<boolean> , IBackContextDescriptor<any>[]>( y.data["load"] )  
    //                           : Either.Left< Observable<boolean> , IBackContextDescriptor<any>[]>(of(true) ) )
    //             .map( x => this.entityProv.loadFromBack$(x)   )    
    //             .tap( x => console.log(x))
    //             //.map( x => of(false) )                              
    //           .run() 
    //   ),
    //   mergeMap(x => x),
    //   tap(x => console.log(x) ),
    //) 

  
}
