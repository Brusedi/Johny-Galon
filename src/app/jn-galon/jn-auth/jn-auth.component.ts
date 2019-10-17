import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore     from '@appStore/index';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AuthSuccess } from '@appStore/actions/environment.actions';

const FS_ERROR_KEY  ="error";
const FS_ERROR_DESC ="error_description";

const FS_AUTH_KEY   ="code";

@Component({
  selector: 'app-jn-auth',
  templateUrl: './jn-auth.component.html',
  styleUrls: ['./jn-auth.component.css']
})

export class JnAuthComponent implements OnInit {

  public error$     : Observable<string>; 
  public errorDesc$ : Observable<string>; 
  public code$      : Observable<string>; 

  constructor(
    private store: Store<fromStore.State>//
  ) { }

  ngOnInit() {

    const readQueryPar$ = ( key:string) =>  this.store.select( fromSelectors.getQueryParams ).pipe(  map(x => x && x[key] ? x[key] : undefined ) )   ;

    this.error$ = readQueryPar$( FS_ERROR_KEY );
    this.errorDesc$ = readQueryPar$( FS_ERROR_DESC );
    this.code$ = readQueryPar$( FS_AUTH_KEY );

    this.code$.pipe(
      filter( x => !!x )
    ).subscribe( x =>  this.store.dispatch( new  AuthSuccess( x )) );

  }

  

}
