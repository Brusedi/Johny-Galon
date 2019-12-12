import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
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
  MatTabsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatDatepickerModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatDialogModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatGridListModule,
  MatTreeModule
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

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { JnItemQuestionComponent } from './jn-galon/jn-entity/jn-item-question/jn-item-question.component';
import { ReactiveFormsModule ,FormsModule } from '@angular/forms';
import { JgMockTableOption, SdIncomingOption, NvaPlanPurchaseLine, AuthTestDataOption } from '@appModels/entity-options';
import { AppResolverService } from './shared/services/app-resolver.service';
import { SdNewUserMessageComponent } from './serv-desc/sd-new-user-message/sd-new-user-message.component';
import { JnInfoBoxComponent, JnInfoBoxDialogComponent} from './jn-galon/jn-info-box/jn-info-box.component';
import { JnItemLabelComponent } from './jn-galon/jn-entity/jn-item-label/jn-item-label.component';
import { JgHomeComponent } from './jn-galon/jg-home/jg-home.component';
import { DrochIconComponent } from './shared/graphics/droch-icon/droch-icon.component';
import { DrochIconSvgComponent } from './shared/graphics/droch-icon-svg/droch-icon-svg.component';
import { HttpClientModule } from '@angular/common/http';
import { DrochIconSvgRegComponent } from './shared/graphics/droch-icon-svg-reg/droch-icon-svg-reg.component';
import { JnBusyBoxComponent, JgBusyDialog } from './jn-galon/jn-busy-box/jn-busy-box.component';
import { JnBusyBarComponent } from './jn-galon/jn-busy-bar/jn-busy-bar.component';
import { JnpFlightItemComponent } from './jn-ispolin/jn-polin-flight/jnp-flight-item/jnp-flight-item.component';
import { EntityProvService } from './shared/services/entity-prov.service';
import { JnpCmpBarComponent } from './jn-ispolin/jnp-cmp-bar/jnp-cmp-bar.component';
import { JnWebCntMainComponent } from './jn-web-cnt/jn-web-cnt-main/jn-web-cnt-main.component';
import { JnWebCntMainNstComponent } from './jn-web-cnt/jn-web-cnt-main-nst/jn-web-cnt-main-nst.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { JnWebCntItemComponent } from './jn-web-cnt/jn-web-cnt-item/jn-web-cnt-item.component';
import { JnNewItemContentComponent } from './jn-galon/jn-entity/jn-new-item-content/jn-new-item-content.component';
import { JnNameplateCardComponent } from './jn-galon/jn-nameplate-card/jn-nameplate-card.component';


//const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const appRoutes: Routes = [
  { path: '',                  component: JgHomeComponent, pathMatch: 'full'  }, //,data: {  option: JgMockTableOption }, resolve: { isLoad:AppResolverService  } 
  //{ path: 'tutoral/mock',    component: JnRootComponent,                    data: {  option: JgMockTableOption} , resolve: { isLoad:AppResolverService  } },  
  //{ path: 'tutoral/sd',      component: JnRootComponent,                    data: {  option: SdIncomingOption } , resolve: { isLoad:AppResolverService  } },  

  { path: 'tutoral/values',    component: JnRootComponent,                    data: {  option: AuthTestDataOption } , resolve: { isLoad:AppResolverService  } },  
  { path: 'forms/sd/incoming', component: SdNewUserMessageComponent,          data: {  option: SdIncomingOption }   , resolve: { isLoad:AppResolverService  } },  

  { path: 'forms/wc',          component: JnWebCntMainNstComponent          },  
  { path: 'forms/wc/:id',      component: JnWebCntItemComponent             },  

  { path: '**',                component: JnNotFoundComponent }
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
    JnNewItemComponent,
    JnItemQuestionComponent,
    SdNewUserMessageComponent,
    JnInfoBoxComponent,
    JnInfoBoxDialogComponent,
    JnItemLabelComponent,
    JgHomeComponent,
    DrochIconComponent,
    DrochIconSvgComponent,
    DrochIconSvgRegComponent,
    JnBusyBoxComponent,
    JgBusyDialog,
    JnBusyBarComponent,
    JnpFlightItemComponent,
    JnpCmpBarComponent,

    JnWebCntMainComponent,

    JnWebCntMainNstComponent,

    JnWebCntItemComponent,

    JnNewItemContentComponent,

    JnNameplateCardComponent,
    
  ],

  imports: [
    HttpModule,
    //HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    StoreModule.forRoot( fromStore.reducers ),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
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
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatGridListModule,
    MatTreeModule,
    CdkTreeModule 

    
  ],
  providers: [
    {provide: RouterStateSerializer,   useClass: CustomRouterStateSerializer },
    //{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    AppSettingsService,
    DataProvService,
    AppResolverService,
    EntityProvService,
    { provide: "windowObject", useValue: window}   // window Object injection
    // {
    //   provide: externalUrlProvider,
    //   useValue: (route: ActivatedRouteSnapshot ) => {
    //       const externalUrl = route.paramMap.get('externalUrl');
    //       window.open('https://ya.ru', '_self');
    //   },
    //},

  ],
  bootstrap: [AppComponent],

  entryComponents: [JnInfoBoxDialogComponent,JgBusyDialog]
})

export class AppModule { }
