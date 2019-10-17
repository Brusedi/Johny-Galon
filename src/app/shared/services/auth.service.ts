// ===_==_==_=_==_=__==========================
//   / \/ |( / |/ /_ \
//  /     / /   _/ __/
//  \/\/\_\/\/\_\___/
// Author:		Schogolev Mike
// Create date: 16.10.2019
// Description:	Auth & Autorization service
//
// 161019 Пока нужна чисто затычка    
// =============================================

// Helper 
//export const isNeedAuth = (error:any) => true?true:false 
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as fromStore from '@appStore/index';
import { Http,  RequestOptions , Headers} from '@angular/http';
import { AppSettingsService } from './app-setting.service';
import { map, mergeMap, tap } from 'rxjs/operators';
import { CodeNode } from 'source-list-map';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';




@Injectable({
    providedIn: 'root'
})
export class AuthService {
  constructor(
        private store: Store<fromStore.State>,
        private http: Http,
        private settings: AppSettingsService,
        private router:Router
      ) { }


    //private postDataFromUri = (uri: string) =>  this.http.post(uri).pipe(map(rsp => rsp.text()));

    private buildAuthEndPointUri( authUrl:string , clientId:string ) { 

    }   

    private buildAuthReguest ( authUrl:string , clientId:string ) { 

        const authParams = {
            "response_type":"code",      
            "client_id":clientId,
            "resource":"https://sqlback-win12.nvavia.ru/FsCsweb",
            "redirect_uri":"http://localhost:4200/Auth"
        }

        const myParams = new URLSearchParams(authParams);

        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

        const myHeaders = new Headers();
            myHeaders.append('Access-Control-Allow-Origin', '*');
            myHeaders.append('Access-Control-Allow-Credentials', 'true');
            myHeaders.append('Content-Type', 'application/json') ;
        // const myHeaders1 = new HttpHeaders();
        //     myHeaders.append( "Access-Control-Allow-Origin","http://localhost:4200e");

        // let httpOptions = {
        //     headers: new HttpHeaders({
        //         'Access-Control-Allow-Origin':'http://localhost:4200e'
        //     }),
        //     params: myParams //new HttpParams().set('program_id', this.program_id)
        //   };
        
        //var w = new Headers();

        const myOption = new RequestOptions( {headers:myHeaders  ,params: myParams});
        // const myOption = new RequestOptions({ params: myParams});
        // myOption.headers = w;
        // myOption.headers.append( "Access-Control-Allow-Origin","http://localhost:4200e");

        // console.log('qqqqqq');

        //return this.http.get(authUrl,   { options: { headers?: new HttpHeaders() } });
        //this.router.navigateByUrl(authUrl);

        //window.open(authUrl, '_blank'); 

        //return this.http.get(authUrl, myOption );

        
        
        //console.log(myOption);
        //return myOption.url;

        Object.keys(authParams).reduce( ( (a,x) => a + x + '=' +  authParams[x]+ '&' ),'?' ) ;
            

        return of(authUrl)
            .pipe( 
                map (x => x +  Object.keys(authParams).reduce( ( (a,n) => a + n + '=' +  authParams[n] + '&' ),'?' ) ),
                tap(console.log)
            )
    }    
    
    public getFSAuthCode() {
        return this.settings.getSettings().pipe(
            tap(console.log),
            mergeMap( x => this.buildAuthReguest(x.auth2AuthEndPoint,x.auth2ClientId ) ),
            tap(console.log)
        );
    } 


  }
  