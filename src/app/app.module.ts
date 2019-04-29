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
  MatTabsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatDatepickerModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatDialogModule
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
import { JgMockTableOption, SdIncomingOption, NvaPlanPurchaseLine } from '@appModels/entity-options';
import { AppResolverService } from './shared/services/app-resolver.service';
import { SdNewUserMessageComponent } from './serv-desc/sd-new-user-message/sd-new-user-message.component';
import { JnInfoBoxComponent, JnInfoBoxDialogComponent} from './jn-galon/jn-info-box/jn-info-box.component';
import { JnItemLabelComponent } from './jn-galon/jn-entity/jn-item-label/jn-item-label.component';
import { JgHomeComponent } from './jn-galon/jg-home/jg-home.component';

const appRoutes: Routes = [
  { path: '',                 component: JgHomeComponent, pathMatch: 'full'  }, //,data: {  option: JgMockTableOption }, resolve: { isLoad:AppResolverService  } 
  //{ path: 'tutoral/mock',   component: JnRootComponent,                    data: {  option: JgMockTableOption} , resolve: { isLoad:AppResolverService  } },  
  //{ path: 'tutoral/sd',     component: JnRootComponent,                    data: {  option: SdIncomingOption } , resolve: { isLoad:AppResolverService  } },  
  { path: 'forms/sd/incoming',component: SdNewUserMessageComponent,          data: {  option: SdIncomingOption } , resolve: { isLoad:AppResolverService  } },  
  //{ path: 'tutoral/plan',   component: JnRootComponent,                    data: {  option: NvaPlanPurchaseLine } , resolve: { isLoad:AppResolverService  } },   
  { path: '**',               component: JnNotFoundComponent }
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
    JgHomeComponent
  ],

  imports: [
    HttpModule,
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
    MatDialogModule
  ],
  providers: [
    {provide: RouterStateSerializer,   useClass: CustomRouterStateSerializer },
    //{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    AppSettingsService,
    DataProvService,
    AppResolverService

  ],
  bootstrap: [AppComponent],

  entryComponents: [JnInfoBoxDialogComponent]
})
export class AppModule { }
