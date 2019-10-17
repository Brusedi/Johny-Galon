import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { Store } from "@ngrx/store";
import { observable, of } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable({
    providedIn: 'root'
  })

export class AppExUriProvider implements Resolve<any> {
  
    constructor(
      private store: Store<fromStore.State>,
      private  authService  :AuthService  
      ) { }



    resolve(route: ActivatedRouteSnapshot, state:RouterStateSnapshot) {

       this.authService.getFSAuthCode()
        .subscribe( x=>  window.open( x , '_self') );

       
        // window.open('https://ya.ru', '_self');

        return of(true);
    }    
}