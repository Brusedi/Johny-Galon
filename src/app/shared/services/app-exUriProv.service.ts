import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { Store } from "@ngrx/store";
import { observable, of, from, timer } from "rxjs";
import { AuthService } from "./auth.service";
import { map, mergeMap, tap, combineLatest, filter } from "rxjs/operators";


// Упразнить в Auth serv

@Injectable({
    providedIn: 'root'
  })

export class AppExUriProvider implements Resolve<any> {
  
    constructor(
      private store: Store<fromStore.State>,
      private  authService  :AuthService  
      ) { }

    resolve(route: ActivatedRouteSnapshot, state:RouterStateSnapshot) {

        this.store.select( fromSelectors.selEnvIsAuthed ).pipe(
               //mergeMap( x =>  x ? this.authService.getFSLogoutUri() : this.authService.getFSAuthCodeUri() ) , //{ isAuth:x , url:  ( x ? this.authService.getFSLogoutUri() : this.authService.getFSAuthCodeUri()) }),
            mergeMap( isAx =>  ( isAx ? this.authService.getFSLogoutUri() : this.authService.getFSAuthCodeUri() )
                                    .pipe(
                                        map( x => ({ isAuth:isAx , uri:x }) ),
                                     )),
        
            //.subscribe( x => ! x.isAuth ? window.open( x.uri , '_self') : window.open( x.uri , '_self') );//   window.open( x.uri ).focus() );     
            tap( console.log ),                                       
            map(x => window.open( x.uri, 'hello' ,"width=200,height=200") ),
            combineLatest( timer(1000, 1000) , (x,y) => x ), 
            filter(x=>!x||x.closed)
        )
        .subscribe( console.log );//   window.open( x.uri ).focus() );            
        return of(true);
     }    
 

    resolveOld(route: ActivatedRouteSnapshot, state:RouterStateSnapshot) {
       this.authService.getFSAuthCodeUri()
        //.subscribe( x=>  window.open( x , '_self') );
        //.subscribe( x=>  window.open( "http://ya.ru" , '_self', "width=200,height=200") );
        
        return of(true);
    }    
}