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


@Injectable({
    providedIn: 'root'
})
export class AuthService {
  constructor(
      private store: Store<fromStore.State>
      ) { }
  
  }
  