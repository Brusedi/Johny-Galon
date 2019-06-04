import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BusyInfo } from '@appStore/selectors';
import { Store } from '@ngrx/store';
import * as fromSelectors from '@appStore/selectors/index';
import * as fromStore from '@appStore/index';
import { distinctUntilChanged, map, filter, combineLatest, tap } from 'rxjs/operators';

@Component({
  selector: 'app-jn-busy-bar',
  templateUrl: './jn-busy-bar.component.html',
  styleUrls: ['./jn-busy-bar.component.css']
})

export class JnBusyBarComponent implements OnInit {

  @ViewChild('jgbar') bar;

  public spiner$ :  Observable<BusyInfo>; 
  public descr$  :  Observable<string>; 
    
  
  constructor(private store: Store<fromStore.State>) {

    this.spiner$ = this.store.select(  fromSelectors.selBuzyInfo() ).pipe(
         distinctUntilChanged((x:BusyInfo,y:BusyInfo) => x&&y&&x.act==y.act&&x.obj==y.obj )
     );

    this.descr$ = this.spiner$.pipe(
      combineLatest( this.store.select( fromSelectors.selCurItemMetaNote()).pipe(distinctUntilChanged() )  , (x,y) => ({...x, curent:y })   ) ,
      tap( (x)=>console.log(x) ),
      map( (x) => 
        (x && x.act) ? x.act + '['+x.obj+']... ' 
          : x.curent ? x.curent : ''
      )
    )  

  }

  ngOnInit() {
    this.spiner$.pipe(
      map( (x) => x?20: 0 ),
      distinctUntilChanged()
    ).subscribe( 
      (x) => this.updateHeight(x)
    );
  }

  updateHeight(hgt:number) {
    const el = this.bar.nativeElement;
    
    el.style.height = ''+hgt+'px'
    // setTimeout(() => {
    //     el.style.height = ''+hgt+'px';
    // }, hgt?300:300);

  }
}
