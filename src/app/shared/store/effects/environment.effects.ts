import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { EnvironmentActionTypes, ErrorEnvironment } from "@appStore/actions/environment.actions";
import { map, tap } from "rxjs/operators";
import { AuthService } from "app/shared/services/auth.service";


@Injectable()
export class EnvironmentEffects {
    constructor(
        private actions$:           Actions ,
        private authService:        AuthService
  ) {}
  
    //const PrepareByLocBranch$ = ( loc:string  )   
    //151019 error handler
    @Effect()  
    AuthHandler$ = this.actions$.pipe( 
        ofType(EnvironmentActionTypes.AUTH_START),
        tap( x => console.log(x) ),
        map( x => this.authService.getFSAuthCode().subscribe(x=>console.log(x))),
        map( x => new ErrorEnvironment('q') )    
    );
}  