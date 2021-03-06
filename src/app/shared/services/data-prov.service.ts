import { Injectable } from '@angular/core';

import { Http,  RequestOptions , Headers, Response} from '@angular/http';
import { map, mergeMap, tap, combineLatest, last, take, takeLast, retry, catchError } from 'rxjs/operators';

import { AppSettingsService } from './app-setting.service';
import { AppSettings } from '../app-setting';
import { of } from 'rxjs';

import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
import { Store } from '@ngrx/store';
import { HttpClient, HttpResponse } from '@angular/common/http';


/**
 *  Low level data provider (Very oldest)
 *  Build of 051218
 */

const MODULE_NAME    = 'John Galon';
const COMPONENT_NAME = 'DataProvider';

const FK_MACRO_BEGIN = "{";  // backend macros tags
const FK_MACRO_END = "}";

const log = (msg:any) => ( console.log("["+MODULE_NAME+"]"+"["+COMPONENT_NAME+"] " + msg )  );

enum RequestType { Ordinary, Metadata, Template } ;


@Injectable()
export class DataProvService {
  constructor(
    private http: Http,
    private httpCli: HttpClient,
    private settings: AppSettingsService,
    private store: Store<fromStore.State>,    // Add interseption auth header

  ) { 
      settings.getSettings().subscribe( x =>log( "Service activated with location :) "+ x.svcFasadeUri  ));
  }

 
  //FASADE
  /**
   *  Return main data as iterable by http-service sublocation
   */ 
  public list( location:string  ){ 
      return this.data(location)
        .pipe( 
            map(x => {
            var r = <any[]>x;
            return (r === null) ? [] : r; 
            })
        );            
    }        

  /**
   *  Return any data from http-service as JSON (Legasy)
   *  New release method get  
   */ 
  public data( loc:string , subloc:string = undefined , isMetadata = false  ) {
    //this.buildDataUri(loc, subloc, isMetadata)  
    return this.buildDataUri_v2(loc, subloc, isMetadata ? RequestType.Metadata : RequestType.Ordinary )
        .pipe(
            mergeMap( x => this.getDataFromUri( x )),
            map(x  => x.trim()===""? {}: JSON.parse(x) )
        );    
  }
   
  /**
  *  New Fasade.   Above Legasy.
  */ 
  //public metadata$ = (loc:string , subloc:string = undefined ) => this.getCli(loc, subloc, RequestType.Metadata ); 
  public metadata$ = (loc:string , subloc:string = undefined ) => this.get(loc, subloc, RequestType.Metadata );
  public template$ = (loc:string , subloc:string = undefined ) => this.get(loc, subloc, RequestType.Template );
  public item$     = (loc:string , subloc:string = undefined ) => this.get(loc, subloc);
  public items$    = (loc:string , subloc:string = undefined ) => this.get(loc, subloc).pipe(map(x => ( <any[]>x === null) ? [] :<any[]>x ));
    
  public insert   = (loc:string , data:any ) => this.post(loc, undefined, data); //.subscribe(x => console.log(x) );
  public update   = (loc:string , data:any ) => this.put(loc, undefined, data); //.subscribe(x => console.log(x) );


  


  //FASADE END

  // Build Auth Options                                          //ToDO:
  private buildOption = (authKey:string ) =>  new RequestOptions({ headers:new Headers( authKey?{'Authorization':authKey }:{}  ), responseType:0   })

  /// Rebuild 211019 with Auth
  /**
  *  301018    
  *  Get  data from http-service as JSON (new release data method)
  */ 
  private getDataFromUriLegasy = (uri: string) =>  this.http.get(uri).pipe(map(rsp => rsp.text()));        

  private getDataFromUri = (uri: string) =>  this.store.select( fromSelectors.selEnvAuthHeader ).pipe( 
    take(1),
    //tap(console.log),
    map(this.buildOption),
    //tap(console.log) ,
    mergeMap(x => this.http.get(uri,x).pipe(
        //tap( x => console.log(x)),
        map(rsp => rsp.text())
        // ,catchError(error => 
        //     of(error).pipe(
        //         tap( x => console.log(x)),
        //         tap( x => console.log(x.headers.get('content-length'))),
        //     ))
        )));        

  // Rebuild HttpCilent               
  private getDataFromUriCli = (uri: string) =>  this.store.select( fromSelectors.selEnvAuthHeader ).pipe( 
            take(1),
            //tap(console.log),
            map(this.buildOption),
            //tap(console.log) ,
            mergeMap(x => this.httpCli.get<HttpResponse<Object>>(uri, {observe: 'response'}   ).pipe(
                tap( x => console.log( x ) ),
                tap( x => console.log( x.headers.get('prayer') )),
                map(rsp => rsp.body),
                tap( x => console.log(x)),
                catchError(error => 
                    of(error).pipe(
                        tap( x => console.log(x)),
                        tap( x => console.log(x.headers.get('content-length'))),
                    ))
        )));        
                

  /**
  *  041219    
  *  Send PUT any data to http-service as JSON 
  */ 
 private put = ( loc:string , subloc:string = undefined , data:any ) =>
    this.store.select( fromSelectors.selEnvAuthHeader ).pipe( 
        take(1),
        //tap(x=>console.log('w :'+x)) ,
        map(this.buildOption),
        combineLatest( this.buildDataUri_v2(loc, subloc, RequestType.Ordinary ), (o,u) => ({opt:o, uri:u}) ),
        //tap(x=>console.log('w')) ,
        //tap(console.log) ,
        mergeMap( x => this.http.put( x.uri, data, x.opt ))
    )        


  
   /**
  *  301018    
  *  Send any data to http-service as JSON (new release data method)
  */ 
  private post = ( loc:string , subloc:string = undefined , data:any ) =>
    this.store.select( fromSelectors.selEnvAuthHeader ).pipe( 
        take(1),
        //tap(x=>console.log('w :'+x)) ,
        map(this.buildOption),
        combineLatest( this.buildDataUri_v2(loc, subloc, RequestType.Ordinary ), (o,u) => ({opt:o, uri:u}) ),
        //tap(x=>console.log('w')) ,
        //tap(console.log) ,
        mergeMap( x => this.http.post( x.uri, data, x.opt ) ) 
    )        

    // this.buildDataUri_v2(loc, subloc, RequestType.Ordinary )
    //  .pipe(  mergeMap( x => this.http.post( x, data ) ) );  

  private postLegasy = ( loc:string , subloc:string = undefined , data:any ) =>
    this.buildDataUri_v2(loc, subloc, RequestType.Ordinary )
        .pipe(  mergeMap( x => this.http.post( x, data ) ) );  
        

        //ToDO:

  /**
  *  Return any data from http-service as JSON (new release data method)
  */ 
  private get = ( loc:string , subloc:string = undefined , type:RequestType = RequestType.Ordinary  ) =>
    this.buildDataUri_v2(loc, subloc,type )
        .pipe(
            mergeMap( x => this.getDataFromUri( x )), 
            //tap(x=>console.log(x) ),        
            map(x  => x.trim()===""? {}: JSON.parse(x) ),
            //tap(x=>console.log(x) ) 
        ) ;           

  //140720
  private getCli = ( loc:string , subloc:string = undefined , type:RequestType = RequestType.Ordinary  ) =>
        this.buildDataUri_v2(loc, subloc, type )
            .pipe(
                //mergeMap( x => this.getDataFromUri( x )), 
                mergeMap( x => this.getDataFromUriCli(x)),
                tap(x=>console.log(x) ),
                map(x  => !x ? {}: x ),
                tap(x=>console.log(x) )
            ) ;           
      


  // Uri prepare tools -----------------------------------------------
  // Build service Uri for data ... or metadate   
  private buildDataUri(loc:string , subloc:string, isMetadata = false) {
    const bldUriTail = ( fld?:string )=> (typeof fld === "string" && fld != "") ? ("/" + fld) : (""); 
    const stt$ = of("e");
    const a$ = stt$.pipe( map( (x,y) => x ) )

      return this.settings.getSettings()
        .pipe(
          map(prs => this.prepareLocation( prs.svcFasadeUri, loc, isMetadata)   // MergeMap
                + (isMetadata?prs.svcRestMetadataSuffix:"")
                + bldUriTail( subloc ) 
       ));
  }

  private buildDataUri_v2(loc:string , subloc:string,  reqType:RequestType  ) {
    const bldUriTail = ( fld?:string )=> (typeof fld === "string" && fld != "") ? ("/" + fld) : (""); 
    const reqTypeToSuffix = (rt:RequestType, setting:AppSettings) => 
        rt == RequestType.Metadata 
            ? setting.svcRestMetadataSuffix
            : ( rt == RequestType.Template ?  setting.svcRestRecTemplateSuffix : '' ) ;

    return this.settings.getSettings()
        .pipe(
            map(prs => 
                this.prepareLocation( prs.svcFasadeUri, loc, (reqType == RequestType.Metadata ) )   // MergeMap
                + reqTypeToSuffix(reqType, prs)
                + bldUriTail( subloc ) 
            )
        );
  }

  // В связи с использованием референсов на внешние сервисы необходимо парсить локатион
  private prepareLocation(baseSvcUrl:string, location: string, isCutTail: boolean = false) {
      function cutTail(l: string) {
          return l.indexOf("?") >= 0 ? l.substring(0, l.indexOf("?")) : l;
      }

      location = (isCutTail) ? cutTail(location) : location;
      var ret = "";
      if (location.startsWith("http://"))     { throw new Error("Not implement"); }
      else if (location.startsWith("../"))    { throw new Error("Not implement"); }
      else if (location.startsWith("./"))     { ret = baseSvcUrl + location.substr(1);}
      else                                    { ret = baseSvcUrl + location; }
      return ret;
  }

  // Substract macros from location
  private getLocationMacros(location: string) {
      var recFun = (s: string, r: string[]) => {
          var bp = s.indexOf(FK_MACRO_BEGIN)
          if (bp > 0 && s.length > (bp+1) ) {
              var ss = s.substring(bp+1);
              var ep = ss.indexOf(FK_MACRO_END);
              if (ep > 0) {
                  r.push(ss.substring(0, ep));
                  r = recFun(ss.substring(ep), r);
              }
          }
          return r;
      }
      return recFun(location, []);
  }
  
  // Заполняет макросы Лукашина валуями
  private buildLocationWithMacrosValues(location: string, values: any[]) {
      var mcs = this.getLocationMacros(location);
      if (mcs.length > values.length) {
          throw Error("Can't aplay values '" + values.toString() + "' on Uri '" + location+"'" )
      }
      var i = 0;
      for (let v of mcs) {
          location = location.replace(FK_MACRO_BEGIN + v + FK_MACRO_END, values[i]);
          i++;
      }
      return location;
  }

}
