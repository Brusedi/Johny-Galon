import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Either } from '@appModels/monad';
import { dataStore } from '@appStore/selectors';
import { IBackContextDescriptor, AnyEntityId } from '@appModels/any-entity';

@Injectable({
  providedIn: 'root'
})
export class AppAuthResolverService {

  constructor() { }

  resolve = (route: ActivatedRouteSnapshot, state:RouterStateSnapshot) => 
    of( Either.Right<boolean, ActivatedRouteSnapshot>(route)).pipe(
      tap(x => console.log(x.run()) ),
      map(x => x
              .bind(y => y && y.data && y.data.hasOwnProperty("load")  
                          ? Either.Right( y.data["load"] )
                          : Either.Left(true )
              )
              //.map( y => (<IBackContextDescriptor<AnyEntityId>[]>y).map()
              
              //)
              
              .run() 
      ),
      tap(x => console.log(x) ),
    ) 

  
}
