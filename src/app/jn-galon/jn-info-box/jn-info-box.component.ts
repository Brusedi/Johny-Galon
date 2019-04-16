import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore from '@appStore/index';
import { map, filter, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BackICommonError } from '@appModels/any-entity';
import { ExecCurrent } from '@appStore/actions/any-entity-set.actions';
import { ErrorAnyEntityReset } from '@appStore/actions/any-entity.actions';

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

  public error$ : Observable<any>; 

  constructor(private store: Store<fromStore.State>, public dialog: MatDialog){
  
  }

  ngOnInit() {
    console.log('eeee');
    this.error$ = this.store.select(  fromSelectors.selCurError()).pipe( 
      //filter( x => !!x)
      tap(x=>x)
    );

    this.error$.subscribe(x=>console.log(x)); 
    this.error$.pipe(filter( x => !!x)).subscribe(x=>this.onErrorDialog(x)); 
  }

  onErrorDialog(error:BackICommonError){
    const dialogRef = this.dialog.open(JnInfoBoxDialogComponent, {
      //height: '400px',
       width: '600px',
      data: error
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.store.dispatch( new ExecCurrent( new ErrorAnyEntityReset() ) );

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