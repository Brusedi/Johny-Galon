import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore     from '@appStore/index';
import { Observable, of } from 'rxjs';
import { map, startWith, tap, takeLast, take } from 'rxjs/operators';
import { last } from '@angular/router/src/utils/collection';
import { AuthStart, AuthLogout, ErrorEnvironment } from '@appStore/actions/environment.actions';
import { TAG_NVA, TAG_GOOGLE } from 'app/shared/services/auth.service';


const SUB_SOURCE_PARAM_DATA_KEY = 'ServiceLocation';

const MY_TAG_GOOGLE = TAG_GOOGLE;

@Component({
  selector: 'app-jn-root-page',
  templateUrl: './jn-root-page.component.html',
  styleUrls: ['./jn-root-page.component.css']
})
export class JnRootPageComponent implements OnInit {

  public subCaption$ : Observable<string>; 
  public spiner$ : Observable<boolean>; 
  public isAuthButCaption$ : Observable<string>; 
  public isAuth$ : Observable<boolean>; 

  public loginName$   : Observable<string>; 
  public loginPicUri$ : Observable<string>; 

  constructor(private store: Store<fromStore.State>
    ) {
      
  }

  ngOnInit() {
      this.subCaption$ = this.store.select( fromSelectors.selCurItemMetaNote() ); 
      this.spiner$ = this.store.select(  fromSelectors.selIsBuzy() ).pipe( map(x => !x)  );
      this.isAuthButCaption$ = this.store.select(  fromSelectors.selEnvIsAuthed ).pipe( startWith(false),  map( x => !x?'Войти':'Выйти') );
      this.isAuth$ = this.store.select(  fromSelectors.selEnvIsAuthed ).pipe( startWith(false) );

      this.loginName$ = this.store.select(fromSelectors.selEnvAuthHeaderName );
      this.loginPicUri$ = this.store.select(fromSelectors.selEnvAuthHeaderPicUri );
      
      //  this.store.select(  
      //   fromSelectors.selEnvAuthHeaderName 
      //    ).subscribe(x=>console.log(x));
      
      // this.store.select(  
      //     fromSelectors.selEnvAuthHeaderBody 
      //   ).subscribe(x=>console.log(x));

      // this.store.select(  
      //     fromSelectors.selEnvAuthHeaderPicUri 
      //   ).subscribe(x=>console.log(x));

        
      //this.store.select(  fromSelectors.selectErrors()).subscribe(x=>console.log(x));
  }

  public Login(serviceId:string = TAG_NVA ) {
    //of(serviceId).pipe(tap(console.log)).subscribe(x=>undefined);
    this.store.select(  fromSelectors.selEnvIsAuthed ).pipe(
      take(1),
      //tap(x => console.log(serviceId))
    ).subscribe( 
        x=>!x  
          ? this.store.dispatch( new AuthStart( { fromError:null, fromSource:"login button", tag:serviceId })) 
          : this.store.dispatch( new AuthLogout( )  )
     );
    
  }

}
