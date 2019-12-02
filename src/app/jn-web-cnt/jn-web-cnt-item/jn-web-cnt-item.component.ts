import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EntityProvService } from 'app/shared/services/entity-prov.service';
import { ActionContent } from '@appModels/entity-options';

@Component({
  selector: 'app-jn-web-cnt-item',
  templateUrl: './jn-web-cnt-item.component.html',
  styleUrls: ['./jn-web-cnt-item.component.css']
})

export class JnWebCntItemComponent implements OnInit {

  item$:      Observable<any>;
  //metaData$:  Observable<any>;
  controls$:  Observable<any>;

  constructor(private entityProv: EntityProvService, private route: ActivatedRoute) { }

  ngOnInit() {

   //const data$ = this.entityProv.itemData$( ActionContent, this.flightId ).pipe( filter(x => !!x ), delay(100) ) ;

    this.item$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id') ),
      switchMap( id => this.entityProv.itemData$( ActionContent, id ) ),
      filter(x => !!x )
    );

    this.controls$ = this.entityProv.controls$(
        ActionContent,
        [
          "Name",
          "Description",
          "Owner",
          "IsActive",
          "OrderKey",
          "Content",
          "CntSubHdr",
          "CntFooter",
          "ImageKey",
          "IsExStyle",
          "QRUrl"
        ],
        {} 
    
    );

    //this.metaData$ = this.entityProv.metaData$( ActionContent);

    this.item$.subscribe( x=>console.log(x)); 
    //this.metaData$.subscribe( x=>console.log(x)); 
    //this.controls$.subscribe( x=>console.log(x)); 

  }

}
