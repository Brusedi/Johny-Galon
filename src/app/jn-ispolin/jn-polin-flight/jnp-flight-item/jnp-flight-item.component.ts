import { Component, OnInit, Input } from '@angular/core';
import { FlightFidsOption, NvaOmaCustLogo } from '@appModels/entity-options';
import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { Observable, of, BehaviorSubject, timer, Subscription } from 'rxjs';
import { EntityProvService } from 'app/shared/services/entity-prov.service';
import { AnyEntityId } from '@appModels/any-entity';
import { filter, map, merge, tap, delay, mergeMap } from 'rxjs/operators';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

const  LOGO_IMAGE_FIELD = 'IMAGEB64';

@Component({
  selector: 'app-jnp-flight-item',
  templateUrl: './jnp-flight-item.component.html',
  styleUrls: ['./jnp-flight-item.component.css']
})



export class JnpFlightItemComponent implements OnInit {

  @Input() flightId: AnyEntityId;

  private subscriptions: Subscription[] = [];

  private dataSubj = new BehaviorSubject<any>(undefined);
  public  dataSubj$ = this.dataSubj.asObservable();  

  private imgSubj = new BehaviorSubject<SafeUrl>(undefined);
  public  imgSubj$ = this.imgSubj.asObservable();  


  constructor(private entityProv: EntityProvService, private store: Store<fromStore.State>,private sanitizer : DomSanitizer) { }

  ngOnInit() {
    const data$ = this.entityProv.itemData$( FlightFidsOption, this.flightId ).pipe( filter(x => !!x ), delay(1000) ) ;

    this.subscriptions.push(
        data$.subscribe( x => this.dataSubj.next(x) )
    );  

    this.subscriptions.push(
        data$.pipe(
            mergeMap( x =>  this.entityProv.itemDataB64AsImg$(NvaOmaCustLogo , x.Company , (y) => y&&y[LOGO_IMAGE_FIELD]?y[LOGO_IMAGE_FIELD]:"") ),
        )
        .subscribe( (x:SafeUrl) => this.imgSubj.next( x ) )
    ); 

    this.imgSubj$.subscribe(x => console.log(x));
    
  }

  ngOnDestroy(){ 
    while(this.subscriptions.length > 0){
      this.subscriptions.pop().unsubscribe(); 
    } 
  }

  //NvaOmaCustLogo
}
