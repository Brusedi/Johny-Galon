import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore from '@appStore/index';
import { Observable, timer, Subscription } from 'rxjs';
import { map, distinctUntilChanged, take, filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BusyInfo } from '@appStore/selectors/index';


@Component({
  selector: 'app-jn-busy-box',
  templateUrl: './jn-busy-box.component.html',
  styleUrls: ['./jn-busy-box.component.css']
})
export class JnBusyBoxComponent implements OnInit {

  public spiner$        : Observable<BusyInfo>; 
  private dialogRef     : any = null;

  constructor(private store: Store<fromStore.State>,public dialog: MatDialog) {

    this.spiner$ = this.store.select(  fromSelectors.selBuzyInfo() ).pipe(
         distinctUntilChanged((x:BusyInfo,y:BusyInfo) => x&&y&&x.act==y.act&&x.obj==y.obj )
     );

    this.spiner$.subscribe( 
          (x:BusyInfo) => this.manageDialog(x)   
    );

  }

  buildDialog = () => this.dialog.open( JgBusyDialog, { data: this.spiner$.pipe(filter(x=>!!x))} );

  manageDialog = (idBusy:BusyInfo) =>  this.dialogRef = !!idBusy && !this.dialogRef ? this.buildDialog() : this.dialogRef;
    
  ngOnInit() {
  }

}

@Component({
  selector: 'jg-busy-dialog',
  templateUrl: './jg-busy-dialog.html',
  styleUrls: ['./jg-busy-dialog.css']
})
export class JgBusyDialog {

  private closeSubscribe: Subscription = null; 

  constructor(
    public dialogRef: MatDialogRef<JgBusyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Observable<BusyInfo> ) {
      this.tick();
    }  //BusyInfo

  public tick(){
    this.closeSubscribe ? this.closeSubscribe.unsubscribe() : null; 
    this.closeSubscribe = timer(500).pipe(take(1)).subscribe( x =>   this.dialogRef.close());
  }     
}