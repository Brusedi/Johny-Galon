import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { 
  MatCardModule,
  MatTableModule,
  MatButtonModule,
  MatNativeDateModule,
  MatRippleModule,
  MatCheckboxModule,
  MatMenuModule,
  MatDividerModule,
  MatToolbarModule,
  MatTabsModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JnRootPageComponent } from './jn-galon/jn-root-page/jn-root-page.component';
import { JnRootComponent } from './jn-galon/jn-root/jn-root.component';
import { JnNotFoundComponent } from './jn-galon/jn-not-found/jn-not-found.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as fromStore from '@appStore/index';
import { AppSettingsService } from './shared/services/app-setting.service';
import { DataProvService } from './shared/services/data-prov.service';
import { HttpModule } from '@angular/http';
import { StoreRouterConnectingModule, RouterStateSerializer  } from '@ngrx/router-store';
import { CustomRouterStateSerializer } from '@appStore/router';
import { JnNewItemComponent } from './jn-galon/jn-entity/jn-new-item/jn-new-item.component';


const appRoutes: Routes = [
  { path: '',               component: JnRootComponent, pathMatch: 'full' ,data: {  data: { ServiceLocation:'/NvaSd2/JgMockTable'    } } },
  { path: 'tutoral/mock',   component: JnRootComponent,                    data: {  data: { ServiceLocation:'/NvaSd2/JgMockTable'    } } },  
  { path: 'tutoral/sd',     component: JnRootComponent,                    data: {  data: { ServiceLocation:'/NvaSd2/NvaSdIncoming'  } } },  
  { path: 'tutoral/flight', component: JnRootComponent,                    data: {  data: { ServiceLocation:'/NvaAx/FlightFids'  } } },  
  { path: '**',             component: JnNotFoundComponent }
];
// const appRoutes: Routes = [
//   { path: '',               component: JnRootComponent, pathMatch: 'full'   },
//   { path: '**',             component: JnNotFoundComponent }
// ];


@NgModule({
  declarations: [
    AppComponent,
    JnRootPageComponent,
    JnRootComponent,
    JnNotFoundComponent,
    JnNewItemComponent


  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot( fromStore.reducers ),
    EffectsModule.forRoot( fromStore.effects), 
    StoreRouterConnectingModule.forRoot({
        stateKey: 'router' // name of reducer key
    }),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    AppRoutingModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatNativeDateModule,
    MatRippleModule,
    MatCheckboxModule,
    MatMenuModule,
    MatDividerModule,
    MatToolbarModule,
    MatTableModule,
    MatTabsModule,
    
  ],
  providers: [
    {provide: RouterStateSerializer,   useClass: CustomRouterStateSerializer },
    AppSettingsService,
    DataProvService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
