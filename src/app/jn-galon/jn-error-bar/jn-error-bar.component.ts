import { Component, OnInit, ViewChild} from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { map, tap, mergeMap, delay } from 'rxjs/operators';
import { buildParsedError, appErrorToShortSys } from 'app/shared/services/error-handler.service';


@Component({
  selector: 'app-jn-error-bar',
  templateUrl: './jn-error-bar.component.html',
  styleUrls: ['./jn-error-bar.component.css']
})
export class JnErrorBarComponent implements OnInit {

  @ViewChild('erbar') bar;

  public errorAllEntity$   : Observable<{}[]>; 
  public errorMessage$     : Observable<any>; 
  public errorWithDelay$   : Observable<any>; 
  
  constructor(private store: Store<fromStore.State>, ) { }

  ngOnInit() {

    this.errorAllEntity$ =   this.store.select( fromSelectors.selEntitiesErrors() ).pipe( ) ;

    this.errorWithDelay$ = this.errorAllEntity$.pipe( 
      mergeMap( x =>  x&&x.length ? of(x) : of(x).pipe(delay(5000)) )
    )

    this.errorMessage$ =   this.errorWithDelay$.pipe(
      //tap( x => console.log(x) ),
      map( x => x.map( j =>   buildParsedError(j)  )),      //new ErrorParsed(j))),
      //tap( x => console.log(x) ),
      map( x =>  x.length > 0 ?  "[" + x.length.toString() +"] "+ appErrorToShortSys( x[x.length-1])     :"" )///  + x[x.length-1].parsedError.caption +"   "+x[x.length-1].parsedError.description : "" ) 
   )

   this.errorWithDelay$.pipe( 
      map( x => x&&x.length ?  20 : 0 )
    )
    .subscribe( x=> this.updateHeight(x) ) ;
  }

  updateHeight(hgt:number) {
    const el = this.bar.nativeElement;
    el.style.height = ''+hgt+'px'
  }

}
