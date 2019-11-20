import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore from '@appStore/index';
import { map, filter, tap , merge } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BackICommonError } from '@appModels/any-entity';
import { ExecCurrent } from '@appStore/actions/any-entity-set.actions';
import { ErrorAnyEntityReset } from '@appStore/actions/any-entity.actions';
import { ErrorEnvironment, ErrorEnvironmentReset } from '@appStore/actions/environment.actions';

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

  public errorEntity$ : Observable<any>; 
  public errorEnvironment$ : Observable<any>; 

  constructor(private store: Store<fromStore.State>, public dialog: MatDialog){
  
  }

  ngOnInit() {

     
    this.errorEntity$ = this.store.select( fromSelectors.selCurError() ) ; 
    this.errorEntity$.pipe(
        filter( x => !!x)
      ).subscribe(x=>this.onErrorDialog(x, new ExecCurrent( new ErrorAnyEntityReset() ))); 


    this.errorEnvironment$ = this.store.select( fromSelectors.selEnvError)    ; 
    this.errorEnvironment$.pipe( 
        filter( x => !!x)
      ).subscribe(x=>this.onErrorDialog(x, new ErrorEnvironmentReset())); 

  }

  onErrorDialog(error, resetDispatch  ){  //:BackICommonError

    const prepErrM = (e) => (e.hasOwnProperty('Message') && e['Message']) ? e : ({...e , ...{ Message: e.toString() }});    
    const prepErrN = (e) => (e.hasOwnProperty('Name') && e['Name']) ? e : ({...e , ...{ Name: 'Неизвестная Ошибка' }});    
    const prepErr = (e) =>  e.hasOwnProperty('data') 
                                ? e 
                                : typeof e === 'string'
                                    ? ({ Message: e, Name: 'Ошибка'  })   
                                    : prepErrM( prepErrN(e) );

    const dialogRef = this.dialog.open(JnInfoBoxDialogComponent, {
      //height: '400px',
      width: '600px',
      data: prepErr(error)
    });
    console.log(error );
    console.log( prepErr(error) );
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      resetDispatch ? this.store.dispatch( resetDispatch ) : null ;
      //this.store.dispatch( new ExecCurrent( new ErrorAnyEntityReset() ) );

    });

  }
}


@Component({
  selector:    'app-jn-info-box-dialog',
  templateUrl: './jn-info-box-dialog.component.html',
})
export class JnInfoBoxDialogComponent {

  constructor(
    private store: Store<fromStore.State>,
    public dialogRef: MatDialogRef<JnInfoBoxDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BackICommonError) {}

  onNoClick(): void {
    //console.log('dddddddddddddddd');
    //this.store.dispatch( new ExecCurrent( new ErrorAnyEntityReset() ) );
    this.dialogRef.close();
  }

}