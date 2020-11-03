import { Component, OnInit, Inject } from '@angular/core';
import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore from '@appStore/index';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { filter, distinct, tap, distinctUntilChanged } from 'rxjs/operators';
import { authingReqData } from '@appStore/reducers/environment.reduser';
import { AuthStart, AuthLogoutSucess } from '@appStore/actions/environment.actions';
import { TAG_NVA, TAG_GOOGLE } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-jn-auth-selector',
  templateUrl: './jn-auth-selector.component.html',
  styleUrls: ['./jn-auth-selector.component.css']
})

export class JnAuthSelectorComponent implements OnInit {

  //public showDialog$ : Observable<boolean>; 
  //public authRequest$: Observable<any>; 
    
  private subscriptions:Subscription[] = [];
  private request:authingReqData;

  constructor(private store: Store<fromStore.State>, public dialog: MatDialog) { }

  ngOnInit() {
    this.subscriptions.push( 
      this.store.select( fromSelectors.authRequest()).pipe(
           distinctUntilChanged( (x,y) =>  (x && y) &&  x.fromError == y.fromError),      
           filter( x => x &&  (!x.tag || x.tag == "") ),
           //tap(x=>console.log( x )),
        ).subscribe (x => this.onDialog(x))
    )    
  }


  ngOnDestroy(){ 
    while(this.subscriptions.length > 0){
      this.subscriptions.pop().unsubscribe(); 
    } 
  }

  onDialog( authReq:authingReqData ){
    this.request = authReq;
    //console.log(authReq)
    ;
    const dialogRef = this.dialog.open(JnAuthSelectorDialogComponent, {
      width: '600px',
      data: authReq 
    });

  
    dialogRef.afterClosed().subscribe(result => {
       //console.log(result);
       result ? this.store.dispatch( new AuthStart( {...this.request, tag:result , fromSource:"eeee"} )  ) : this.store.dispatch( new AuthLogoutSucess()  )  ;
      //  this.store.dispatch( new ExecCurrent( new ErrorAnyEntityReset() ) );
    });
  }
}  

@Component({
  selector:    'jn-auth-selector-dialog',
  templateUrl: './jn-auth-selector-dialog.component.html',
  styleUrls:   ['./jn-auth-selector-dialog.component.css'] 
})
export class JnAuthSelectorDialogComponent {

  constructor(
    private store: Store<fromStore.State>,
    public dialogRef: MatDialogRef<JnAuthSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void { this.dialogRef.close(); }
  onClickNVA(): void { this.dialogRef.close( TAG_NVA); }
  onClickGOO(): void { this.dialogRef.close( TAG_GOOGLE); }

}
