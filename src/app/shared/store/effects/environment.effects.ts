import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { EnvironmentActionTypes, ErrorEnvironment, AuthTokenReceived } from "@appStore/actions/environment.actions";
import { map, tap, catchError, mergeMap } from "rxjs/operators";
import { AuthService } from "app/shared/services/auth.service";
import { of } from "rxjs";


@Injectable()
export class EnvironmentEffects {
    constructor(
        private actions$:           Actions ,
        private authService:        AuthService
    ){}
  
    //const PrepareByLocBranch$ = ( loc:string  )   
    //151019 error handler
     @Effect()  
    AuthHandler$ = this.actions$.pipe( 
         ofType(EnvironmentActionTypes.AUTH_START),
         mergeMap( x => this.authService.LoginFS3$(300)),
         catchError(error => of(new ErrorEnvironment(error)))
         
     );

    // @Effect()  
    // AuthLogOut$ = this.actions$.pipe( 
    //     ofType(EnvironmentActionTypes.AUTH_LOGOUT),
    //     tap( x => console.log(x) ),
    //     map( x => this.authService.getFSLogoutUri().subscribe(x=>console.log(x))),
    //     map( x => new ErrorEnvironment('q') )    
    // );

    // Request JWT Token from special Backend Auth Service
    @Effect()  
    AuthLogIn$ = this.actions$.pipe( 
        ofType(EnvironmentActionTypes.AUTH_SUCCESS),
        mergeMap( x => this.authService.authTokenRequest$()),
        catchError(error => of(new ErrorEnvironment(error)))
        //tap( x => console.log(x) ),
        //mergeMap( x => this.authService.authTokenRequest() ),
        // tap( x => console.log(x)),
        //map( x =>  new AuthTokenReceived(x)),
        
    );

}  