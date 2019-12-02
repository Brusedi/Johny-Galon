import { Component, OnInit } from '@angular/core';
import { ActionContentRoot } from '@appModels/entity-options';
import { filter, delay, map, tap, take } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EntityProvService } from 'app/shared/services/entity-prov.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';


/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

interface WebContItem{
  Name: string;
  Owner: number;
  id: number;
}


@Component({
  selector: 'app-jn-web-cnt-main',
  templateUrl: './jn-web-cnt-main.component.html',
  styleUrls: ['./jn-web-cnt-main.component.css']
})
export class JnWebCntMainComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  private dataSubj = new BehaviorSubject<any>(undefined);
  public  dataSubj$ = this.dataSubj.asObservable();  


  private _transformer = (node: WebContItem, level: number) => {
    var r:ExampleFlatNode;
    this.dataSubj$.pipe(
      map( (x:WebContItem[]) => !!( x.find( i  => i.Owner == node.id  ) )  ) ,
      take(1)
    ). subscribe( 
        x => r = (
          {
             expandable: x,
             name: node.Name,
             level: level,
          }));
    //console.log(r);          
    return r;
  }
 
  private _childProv = ( node: WebContItem ) => {
    var r:WebContItem[];
      this.dataSubj$.pipe( 
          map( (x:WebContItem[]) => x.filter( y => y.Owner == node.id ) )
      ).subscribe(  
         x => r
      )  
      console.log(r);          
      return r;  
  }    

  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => false, this._childProv);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  

  constructor(private entityProv: EntityProvService) {
    
  }

  ngOnInit() {
    const data$ = this.entityProv.collectionData$( ActionContentRoot).pipe( filter(x => !!x ) ,  tap( x => console.log(x)) ) ;

    this.subscriptions.push(
        data$.subscribe( x => this.dataSubj.next(x) )
    ); 

    this.subscriptions.push(
      this.dataSubj$.pipe(
        tap( x => console.log('e!')),
        map( (x:WebContItem[]) => x.filter( y => (y.id == y.Owner) || !y.Owner ) ),
        filter( x => x.length > 0 ),
        tap( x => console.log(x)),
      ).subscribe( x => this.dataSource.data = x )
    ); 
    
  }

  ngOnDestroy(){ 
    while(this.subscriptions.length > 0){
      this.subscriptions.pop().unsubscribe(); 
    } 
  }
}