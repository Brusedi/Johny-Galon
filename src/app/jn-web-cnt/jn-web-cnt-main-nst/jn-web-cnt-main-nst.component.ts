import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import { Subscription, BehaviorSubject, of } from 'rxjs';
import { EntityProvService } from 'app/shared/services/entity-prov.service';
import { ActionContentRoot } from '@appModels/entity-options';
import { filter, tap, map, take } from 'rxjs/operators';


interface WebContItem{
  Name: string;
  Owner: number;
  id: number;
  OrderKey:number 
}

@Component({
  selector: 'app-jn-web-cnt-main-nst',
  templateUrl: './jn-web-cnt-main-nst.component.html',
  styleUrls: ['./jn-web-cnt-main-nst.component.css']
})
export class JnWebCntMainNstComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  private dataSubj = new BehaviorSubject<any>(undefined);
  public  dataSubj$ = this.dataSubj.asObservable();  

  lSort = (j:WebContItem,k:WebContItem) => k.OrderKey?k.OrderKey:0 -j.OrderKey?j.OrderKey:0
  
  treeControl = new NestedTreeControl<WebContItem> (
    node => this.dataSubj$.pipe(
      map( (x:WebContItem[]) => x.filter( y => (y.Owner == node.id && y.id != node.id ) ).sort( this.lSort )  ),
      take(1)
    )  
  ); 

  dataSource = new ArrayDataSource( 
    this.dataSubj$.pipe(
      map( (x:WebContItem[]) => x.filter(  y => (y.id == y.Owner) || !y.Owner  ).sort( this.lSort ) ),
      filter( x => x&&x.length > 0  ) , 
      take(1)
    )
  );

  hasChild  = (_: number, node: WebContItem) =>  {
    var ret:boolean;
    this.dataSubj$.pipe(
      filter( x => x&&x.length > 0  ), 
      map( (x:WebContItem[]) => !!( x.find( i  => i.Owner == node.id   && i.id != node.id   ) )  ), 
      take(1)
    ).subscribe(x => ret = x)  ;
    return ret;
  }

  constructor(private entityProv: EntityProvService) { }

  ngOnInit() {
    const data$ = this.entityProv.collectionData$( ActionContentRoot ).pipe( filter(x => !!x ) ,
    // tap( x => console.log(x))
    ) ;
    this.subscriptions.push(
       data$.subscribe( x => this.dataSubj.next(x) )
    ); 
  }

  ngOnDestroy(){ 
    while(this.subscriptions.length > 0){
      this.subscriptions.pop().unsubscribe(); 
    } 
  }

}
