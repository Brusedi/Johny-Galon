import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, from, ReplaySubject, Subscription } from 'rxjs';
import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore from '@appStore/index';
import { map, filter, tap , merge, mergeMap, distinct, delay } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BackICommonError } from '@appModels/any-entity';
import { ExecCurrent, ExecItemAction } from '@appStore/actions/any-entity-set.actions';
import { ErrorAnyEntityReset } from '@appStore/actions/any-entity.actions';
import { ErrorEnvironment, ErrorEnvironmentReset } from '@appStore/actions/environment.actions';
import { buildParsedError, appErrorToDialogData } from 'app/shared/services/error-handler.service';
import { IDialogBoxData } from 'app/shared/app-common';


// export interface DialogData {
//   animal: string;
//   name: string;
// }

@Component({
  selector: 'app-jn-info-box',
  templateUrl: './jn-info-box.component.html',
  styleUrls: ['./jn-info-box.component.css']
})

export class JnInfoBoxComponent implements OnInit {

  //public errorEntity$ : Observable<any>;              /// del candidate
  public errorEnvironment$ : Observable<any>; 
  public errorAllEntity$ : Observable<any>; 
  
  private subscriptions:Subscription[] = [];
  
  constructor(private store: Store<fromStore.State>, public dialog: MatDialog){
  
  }

  ngOnInit() {
  
    //this.errorEntity$ = this.store.select( fromSelectors.selCurError() ).pipe(  filter( x => !!x) ) ; 
    this.errorEnvironment$ = this.store.select( fromSelectors.selEnvError).pipe( 
      filter( x => !!x),
      delay(100),
      // tap(x=>console.log(x))
      ) ;

    // this.errorAllEntity$ =   this.store.select( fromSelectors.selEntitiesErrors() ).pipe(
    //   filter( x => x && x.length > 0 ),
    //   mergeMap(x => from(x) ),
    //   distinct( x => x.error.Id )        
    // ); 


    // this.subscriptions.push( 
    //   this.errorEntity$.subscribe(x=>this.onErrorDialog(x, new ExecCurrent( new ErrorAnyEntityReset() ))) 
    // ); 
    this.subscriptions.push( 
      this.errorEnvironment$.subscribe ( x =>  this.onErrorDialog( x , new ErrorEnvironmentReset()))
    ); 
    
    // this.subscriptions.push(
    //   this.errorAllEntity$.subscribe(x=>
    //     this.onErrorDialog(
    //         x.error, 
    //         new ExecItemAction( { itemOption: x.opt, itemAction: new ErrorAnyEntityReset() } )
    //     )
    //   )
    // );  

  }

  ngOnDestroy(){ 
    while(this.subscriptions.length > 0){
      this.subscriptions.pop().unsubscribe(); 
    } 
  }

  onErrorDialog(error, resetDispatch  ){  //:BackICommonError

    const prepErrM = (e) => (e.hasOwnProperty('Message') && e['Message']) ? e : ({...e , ...{ Message: e.toString() }});    
    const prepErrN = (e) => (e.hasOwnProperty('Name') && e['Name']) ? e : ({...e , ...{ Name: 'Неизвестная Ошибка' }});    
    const prepErr = (e) =>  e.hasOwnProperty('data') 
                                ? e 
                                : typeof e === 'string'
                                    ? ({ Message: e, Name: 'Ошибка'  })   
                                    : prepErrM( prepErrN(e) );

    const dialogDataDeteailsToArray: (x:IDialogBoxData) => IDialogBoxData = (x) => x.Details && Array.isArray(x.Details) ? x : ({ ...x , Details: ( x.Details ? <string[]>[x.Details] : [] )  }) ;
 

    const dialogRef = this.dialog.open(JnInfoBoxDialogComponent, {
      //height: '400px',
      width: '600px',
      //data: prepErr(error)
      //data:  new ErrorParsed(error).toDialogData()
      data: dialogDataDeteailsToArray( appErrorToDialogData( buildParsedError(error))) 
    });
    //console.log(appErrorToDialogData( buildParsedError(error) ) );
    //console.log( prepErr(error) );
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      resetDispatch && !!result  ? this.store.dispatch( resetDispatch ) : null ;
      //this.store.dispatch( new ExecCurrent( new ErrorAnyEntityReset() ) );

    });

  }
}


@Component({
  selector:    'app-jn-info-box-dialog',
  templateUrl: './jn-info-box-dialog.component.html',
  styleUrls: ['./jn-info-box-dialog.component.css']
})
export class JnInfoBoxDialogComponent {

  constructor(
    private store: Store<fromStore.State>,
    public dialogRef: MatDialogRef<JnInfoBoxDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BackICommonError) {}

  onNoClick(): void {
    //console.log('dddddddddddddddd');
    //this.store.dispatch( new ExecCurrent( new ErrorAnyEntityReset() ) );
    this.dialogRef.close( true );
  }

}