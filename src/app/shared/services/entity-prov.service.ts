import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from '@appStore/index';
import * as fromSelectors from '@appStore/selectors/index';
//import { AnyEntityId } from '@appModels/any-entity';

import { anyEntityOptions, AnyEntityId, AnyEntity, IBackContextDescriptor, BackContextMode, IBackRecord, BackContextModeToStr } from "@appModels/any-entity";
import { combineLatest as combineLatestO, tap, filter, take, map, mergeMap, switchMap, takeLast, mergeAll, reduce, distinct, distinctUntilChanged, skipUntil, takeUntil, takeWhile, skipWhile, debounce, debounceTime  } from 'rxjs/operators';
import { AddItem, Exec, ExecItemAction } from '@appStore/actions/any-entity-set.actions';
import { GetItemsPart, GetItems, GetItemsMeta, ChangeRowSeed, SetRowSeed, UpdateItem, anyEntityActions, GetTemplate } from '@appStore/actions/any-entity.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of, combineLatest, merge, timer, from  } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { genRowTemplateByFldsDesc, getRowTemplateByFldsDesc } from '../question/adapters/question-adapt.helper';
import { Either, tMonad } from '@appModels/monad';
import { dataStore, selFieldDescribe } from '@appStore/selectors/index';
import { and } from '@angular/router/src/utils/collection';
import { AddItem as AddItemEntity } from '@appStore/actions/any-entity.actions';
import { FieldDescribe, FieldDescribes } from '@appModels/metadata';

interface jnForm { questions:any, formGroup:FormGroup} ;



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
*  Взаимодействие мода IBackContextDescriptor-а со стором
*/
interface IBackContextModeDescriptor {
    mode:BackContextMode,
    loadAct: (x:IBackContextDescriptor<any>) => anyEntityActions,
    isLoaded$: (x:IBackContextDescriptor<any>,store:Store<fromStore.State>) => Observable<boolean>
    isLoading$: (x:IBackContextDescriptor<any>,store:Store<fromStore.State>) => Observable<boolean>
    isError$:(x:IBackContextDescriptor<any>,store:Store<fromStore.State>) => Observable<boolean>
    //isFixError$:(x:IBackContextDescriptor<any>,store:Store<fromStore.State>) => Observable<boolean>
};


/*
*   Джентельменский набор флагов ожиданий для контекста загрузки
*/
interface IBackContexState{
    data:IBackContextDescriptor<any>
    loading:boolean, 
    loaded:boolean, 
    authing:boolean,
    authed:boolean,
    error:boolean,
 }


const toBackContexState = (d:IBackContextDescriptor<any>,ling:boolean,led:boolean,aing:boolean,aed:boolean ,err:boolean ) =>
     <IBackContexState> ({data:d, loading:ling, loaded:led,authing:aing,authed:aed, error:err  })

const toDsc = ( 
        m:BackContextMode, 
        fa1: (x:IBackContextDescriptor<any>) => anyEntityActions, 
        fa2: (x:IBackContextDescriptor<any>,store:Store<fromStore.State>) => Observable<boolean> ,
        fa3: (x:IBackContextDescriptor<any>,store:Store<fromStore.State>) => Observable<boolean> ,
        fa4: (x:IBackContextDescriptor<any>,store:Store<fromStore.State>) => Observable<boolean> ,

) =>  <IBackContextModeDescriptor>({mode: m, loadAct: fa1, isLoaded$: fa2, isLoading$:fa3,  isError$ :fa4  }) ;

/*
*   IBackContextModeDescriptor конфигурация 
*/
const modeDescriptorSet:IBackContextModeDescriptor[] = [
    toDsc(  BackContextMode.Data, 
            (x) => new GetItems(null) ,  
            (d,s) => s.select( fromSelectors.selectIsDataLoaded(d.context.options.name)), 
            (d,s) => s.select( fromSelectors.selectIsDataLoading(d.context.options.name)), 
            (d,s) => s.select( fromSelectors.selectEntityIsError(d.context.options.name)), 
    ),
    toDsc(  BackContextMode.Metadata, 
            (x) => new GetItemsMeta()  , 
            (d,s) => s.select( fromSelectors.selectIsMetadataLoaded(d.context.options.name)),
            (d,s) => s.select( fromSelectors.selectIsMetaLoading(d.context.options.name)), 
            (d,s) => s.select( fromSelectors.selectEntityIsError(d.context.options.name)),
    ),
    toDsc(  BackContextMode.MetadataField, 
            (x) => new GetItemsMeta()  ,  
            (d,s) => s.select( fromSelectors.selectIsMetadataLoaded(d.context.options.name)), 
            (d,s) => s.select( fromSelectors.selectIsMetaLoading(d.context.options.name)), 
            (d,s) => s.select( fromSelectors.selectEntityIsError(d.context.options.name)),
    ),
    toDsc(  BackContextMode.Record, 
            (x) => new GetItemsPart( x.context.options.location  + x.context.options.selBack((<IBackRecord<any>>x.context).id )),
            (d,s) => s.select( fromSelectors.selectIsRowLoaded(d.context.options.name , (<IBackRecord<any>>d.context).id )),
            (d,s) => s.select( fromSelectors.selectIsDataLoading(d.context.options.name)), 
            (d,s) => s.select( fromSelectors.selectEntityIsError(d.context.options.name)),
    ) 
] ;



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

@Injectable({
  providedIn: 'root'
})
export class EntityProvService {

  constructor(private store: Store<fromStore.State> ,private sanitizer : DomSanitizer) { }

    /*
    *  get stream with resolve data if need
    */
    public itemData$ = (  opt:anyEntityOptions<AnyEntity> ,  id:any ) =>
        this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
            tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
            filter( x => x ),
            tap(  x => 
                this.store.select( fromSelectors.selectById(opt.name,id)).pipe(  take(1) )
                    .subscribe(x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItemsPart(opt.location + opt.selBack(id)) })))   
            ),
            mergeMap( x => this.store.select( fromSelectors.selectById(opt.name,id)) )
        )    

    /*
    *  get stream with resolve data if need as sanitizer img uri
    */
    public itemDataB64AsImg$ = (  opt:anyEntityOptions<AnyEntity> ,  id:AnyEntity,   selF:((a:AnyEntity) => string ) ) =>
        this.sanifeImageBase64$(
            this.itemData$(opt,id).pipe(
                map(selF),
            ) 
        )

    /*
    *  get sanitizer img from base64 string
    */
    public sanifeImageBase64$ = ( imageB64:Observable<string> ) =>
        imageB64.pipe(
            filter( x => !!x ),
            map( x => "data:image/png;base64,"+ x ),
            map( x => this.sanitizer.bypassSecurityTrustUrl(x)),

            //map( x => this.sanitizer.bypassSecurityTrustStyle(x) )
            //map( x => this.sanitizer.bypassSecurityTrustStyle("url('"+ x +"')"  ))
        );    

    /*
    *  get all collection data 
    */
    public collectionData$ = (  opt:anyEntityOptions<AnyEntity>  ) =>
        this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
            tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
            filter( x => x ),
            tap(  x => 
                this.store.select( fromSelectors.selectIsDataLoaded(opt.name)).pipe(
                    take(1)
                ).subscribe( x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItems(null) })))   
            ),
            mergeMap( x => this.store.select( fromSelectors.selectDataItems(opt.name)) )
        )  

    /*
    *  prepare and get metadata 
    */
    public metaData$ = (  opt:anyEntityOptions<AnyEntity>  ) =>
        this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
            tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
            filter( x => x ),
            tap(  x => 
                this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)).pipe(
                    //tap(x=>console.log(x)),
                    take(1)
                ).subscribe( x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItemsMeta() })))   
            ),
            switchMap( x => this.store.select( fromSelectors.selectDataMetadata(opt.name)) ),
            //tap(x=>console.log(x) )
        )  

    /*
    *  prepare and get controls
    */
    // public controls$ = (  opt:anyEntityOptions<AnyEntity> ,flds: string[], rowSeed: {} ) =>
    //     this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
    //         tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
    //         filter( x => x ),
    //         tap(  x => 
    //               this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)).pipe(
    //                 take(1)
    //               ).subscribe( x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItemsMeta() })))   
    //         ),
    //         switchMap( x => 
    //             this.store.select( fromSelectors.selFormControlsEx( opt.name, flds, rowSeed )).pipe(
    //                 filter(x=>!!x)
    //             ) 
    //         ),
    //         tap(x=>console.log(x) )
    //     )  


    // private getFormControls$ = (id:string, flds:string[], iVal$:Observable<{}>  ) =>
    //     this.store.select( fromSelectors.selFormControlsEx$( id , flds, iVal$) ).pipe(
    //         switchMap( x => x ) 
    //     );  

    /*
    *  prepare and get controls for edit
    */
    public controlsForEdit$ = (  opt:anyEntityOptions<AnyEntity> ,id:any ,flds: string[] ) =>
        this.store.select( fromSelectors.selectIsExist(opt.name)).pipe(
            tap( x => !x ?  this.store.dispatch( new AddItem(opt)) : null ),
            filter( x => x ),
            tap(  x => 
                this.store.select( fromSelectors.selectIsMetadataLoaded(opt.name)).pipe(
                    take(1)
                ).subscribe( x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItemsMeta() })))   
            ),
            tap( x => this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new SetRowSeed(null) }) ) ),
            tap( x => 
                this.itemData$( opt, id ).pipe(
                        filter(x=>!!x)
                    ).subscribe( x => {
                        this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new SetRowSeed(x) }) ) ;
                    }
            ) ),

            switchMap( x => 
                this.store.select( 
                    fromSelectors.selFormControlsEx$( 
                        opt.name ,
                        flds,
                        this.store.select(fromSelectors.selRowSeed(opt.name)) 
                    )
                )
                .pipe(switchMap( x => x ))
            )  
            //switchMap( x => this.getFormControls$(opt.name, flds,this.store.select(fromSelectors.selRowSeed(opt.name) ) ) ),
        )  



    /*
    *  prepare and get controls for edit and eject changes to rowseeed
    */    
    public controlsForEditEx$ = (  opt:anyEntityOptions<AnyEntity> ,id:any ,flds: string[] ) => 
        this.controlsForEdit$(opt,id,flds).pipe(
            filter( x => x && x.formGroup != null  ),
            tap( (x:jnForm) => x.formGroup.valueChanges.subscribe( x =>
                    this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new ChangeRowSeed(x) }) )
                )
            )
        )  
    /**
     *  Run update record (from rowseed) actions 
     */
    public updateItemByRowSeed = (  opt:anyEntityOptions<AnyEntity>  ) => 
        this.store.select(fromSelectors.selRowSeed(opt.name)).pipe(take(1))
            .subscribe(  x => {
                    //console.log(x);
                    this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new UpdateItem(x) }) )
                }
            );
    /*
    *  prepare and get controls 2020 wo id (insert or edit?)
    *  Не реализована поддержка подгрузки темплэйта новой записи TODO !!!
    *  Подписка на изм контролов
    *
    */
    //public controlsForEntityDefTempl$ = (   opt:anyEntityOptions<AnyEntity> , excludeFlds: string[] ) =>
    public controlsForEntityDefTempl$ = (   opt:anyEntityOptions<AnyEntity> , fltr:(fldName:string) => Observable<boolean>  ) => this.controlsForEntity$( opt, fltr )

    /*
    *  Контролы с подгрузкой темплэйта
    *  // todo внутре у нее подписька, по хорошему ее надо возвращать что бы можно было отписать  
    */
    public controlsForEntityLoadTempl$ = (   opt:anyEntityOptions<AnyEntity> , fltr:(fldName:string) => Observable<boolean>  ) => 
        this.controlsForEntity$( 
                opt, 
                fltr,  
                of(true).pipe(
                    //tap( x=> console.log(x)),
                    tap( x =>   this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new GetTemplate() }) )),
                    switchMap( x =>  this.store.select(fromSelectors.selectTemplate(opt.name) )) ,
                    filter( x => !!x  ),
                )
        );                        

    /*
    *  Подписка на изм контролов 200820 template add
    */
    private controlsForEntity$ = (   opt:anyEntityOptions<AnyEntity> , fltr:(fldName:string) => Observable<boolean> , templ:Observable<any> = null   ) =>
        this.metaData$(opt).pipe(
            //tap( x=> console.log(x)),
            filter(x => x && Object.keys(x.fieldsDesc).length > 0 ),
            //tap( x=> console.log(x)),
            mergeMap( x => combineLatest(
                        of(x),
                        templ ? templ : of(getRowTemplateByFldsDesc( Object.keys(x.fieldsDesc).map( y => x.fieldsDesc[y]))),
                        this.fldsList( x.fieldsDesc,fltr ),
                        (a,b,c) => ({meta:a, templ: b, flds:c })
                     ) 
           ), 
           //tap( x=> console.log(x)),
            tap( x => this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new ChangeRowSeed(x.templ) }))), 
            switchMap( x => 
                this.store.select( 
                    fromSelectors.selFormControlsEx$( 
                        opt.name ,
                        x.flds,
                        of(x.templ )    
                    )
                )
                .pipe(
                    switchMap( x => x ),
                    take(1),
                    //tap( x=> console.log(x)),
                    // tap( (x) => x.formGroup.valueChanges.subscribe( x =>
                    //      this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new ChangeRowSeed(x) }) )
                    //     )

                    map( (x) => ({
                                    ...x ,  
                                    subscribtions:[ 
                                                    x.formGroup.valueChanges.subscribe( x =>
                                                        this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new ChangeRowSeed(x) }) )
                                                    )]                        
                                })    
   
                    ), 
                                
                ),
            ),
            take(1),
            //tap( x=> console.log(x)),
            //tap( (x) => x.formGroup.statusChanges.subscribe( x =>   console.log(x)     ) )       
        );

    private fldsList  = ( ls:FieldDescribes , fltr:(fldName:string) => Observable<boolean> ) =>  
        from(
            Object.keys(ls).map(  x => combineLatest( of(x),  fltr(x),  (a,b) => ({fld:a,fl:b }) ) )
        ).pipe(     
            mergeMap(x => x),
            filter( x => x.fl ) ,
            map( x => x.fld ),
            reduce( (a:string[],x:string) => a.concat([x]), []  ) ,
            //tap( x => console.log(x) )
        ) 

    public controlsForEntityDefTemplByGroup$ = (   opt:anyEntityOptions<AnyEntity> , groupName:string ) =>        
        this.controlsForEntityDefTempl$(
            opt,
            (x:string) => this.store.select( fromSelectors.selFieldDescribe(opt.name,x) ).pipe( 
                 //tap(x => console.log(x) ),
                 map( (x:FieldDescribe) => x && x.hasOwnProperty("group")  && x.group == groupName ? true: false ),
                 take(1)
            ) 
    )                    


    /**
     *  Run insert record (from rowseed) actions 
     */
    public insertItemByRowSeed = (  opt:anyEntityOptions<AnyEntity>  ) => 
        this.store.select(fromSelectors.selRowSeed(opt.name)).pipe(take(1))
            .subscribe(  x => {
                    //console.log(x);
                    this.store.dispatch( new ExecItemAction( {itemOption:opt , itemAction: new AddItemEntity(x) }) )
                }
            );


    //map( x => Object.keys(x.fieldsDesc).map( y => x.fieldsDesc[y] ) )
    //map( x => genRowTemplateByFldsDesc( Object.keys(x.fieldsDesc).map( y => x.fieldsDesc[y] ) ) )
    //map( x => getRowTemplateByFldsDesc( Object.keys(x.fieldsDesc).map( y => x.fieldsDesc[y] ) ) )
    //map( x => Object.keys(x.fieldsDesc).filter(y => !excludeFlds.includes(y) ) ), 
    //switchMap( x =>  this.store.select( fromSelectors.selFormControlsEx$( opt.name , x, this.store.select(fromSelectors.selRowSeed(opt.name) ) ))),
    //fromSelectors.selFormControlsEx$( 
    
    ///////////////////////////////////////////////////////////////////////////////////////
    //
    // 310720  IBackContextDescriptor  methods
    //

    //  завершение 
    // //  loading& ---T----F------------------------                        


    // private BackContextDescLoadProc2$ = ( loadingEntity: IBackContextDescriptor<any> ) => 
    //     tMonad.of(loadingEntity)
    //       .map( x => this.BackContextDescWaitFlagsStreams$(x) )
          
    //       .map( x => this.BackContextDesc_TryLoad2$(x) )  // основной поток загрузки данных
    //       .run()    

    // private BackContextDesc_Complete$ = ( incom:IBackContexState$ ) => 
    //      combineLatest(
    //         incom.loaded$,
    //         incom.fixeble$,
    //         (a,b) => ({  complete: !!a ||  (( (typeof b) != "undefined")  && !b ) , ret: a  }) 
    //      ).pipe(
    //         filter( x => x.complete ),
    //         take(1),
    //         map( x => x.ret )
    //      )   

    // private BackContextDesc_Wait$ = ( incom:IBackContexState$ ) => 
    //      combineLatest(
    //         incom.loading$,
    //         incom.authing$,
    //         (a,b) => ( a || b ) 
    //      ).pipe( 
    //         tap( x =>  this.store.dispatch( new AddItem( incom.data.context.options)) )
    //      )   
                        


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////                    
    /*
    *  310720 Загрузка с новыми интерфейсами групповвая 
    */                    
    public loadFromBack$ = ( loadingSet: IBackContextDescriptor<any>[]) =>
         of( loadingSet ).pipe(
            map( xs => xs.map( x => this.BackContextDescLoadProc$(x) )) , 
            mergeMap( xs => of(xs).pipe( mergeAll() )  ),  
            mergeMap( xs => xs  ), 
            //tap(x=>console.log(x)),
        )   

    /*       
    * Загрузка по BackContextDescriptor proцess (пока) бе-е-е-е-з таймаутов
    * Задача без выебонов сделать load proc c аутентифиацией 
    */                          
    private BackContextDescLoadProc$ = ( loadingEntity: IBackContextDescriptor<any> ) => 
    tMonad.of(loadingEntity)
        .map( x => ({   data:x , 
                        stream: this.BackContextDescLoadProc_Prep$( loadingEntity ).pipe(  switchMap( x => this.BackContextDescWaitFlags$(x) ) )
                    })                                
        )
        //.map (x=>this.BackContextDesc_TryLoad$(x.stream) )  // основной поток загрузки данных
        .map(x=>this.BackContextDesc_TryLoad_Main$(x.stream) )  // основной поток загрузки данных
        .run()
        
    // Готовит место если надо и инициализирует обервэбл
    private BackContextDescLoadProc_Prep$ = ( loadingEntity: IBackContextDescriptor<any> ) => 
        this.store.select( fromSelectors.selectIsExist(loadingEntity.context.options.name)).pipe(
            tap( x => !x ?  this.store.dispatch( new AddItem( loadingEntity.context.options)) : null ),
            filter( x => x ),
            take(1),          
            map( x => loadingEntity )
         )  

    // Тригер первичной загрузки    
    private BackContextDesc_TryLoad_CheckStart$ = ( incom$:Observable<IBackContexState> ) => 
        incom$.pipe(  
            filter( x => (! x.loading && ! x.authing) || x.loaded ), 
            take(1), 
            tap( x =>  ! x.loaded  ? this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null ) ,
        ) ; 

    // Основной поток      
    private BackContextDesc_TryLoad_Main$ = ( incom$:Observable<IBackContexState> ) => 
        incom$.pipe(  
            skipUntil(this.BackContextDesc_TryLoad_CheckStart$(incom$) ),
            debounceTime(1),
            //tap(x=>console.log(this.iBackCtxtoStr(x) )) ,
            filter( x => x.loaded || !x.loading || x.authing ),
            take(1),
            //tap(x=>console.log(this.iBackCtxtoStr(x) )) ,
            switchMap( x => x.authing ? this.BackContextDesc_TryLoad_RetryLoad$(incom$) : incom$ ),
            take(1)
        ) ; 

    // Паралельный поток вторичной загрузки (после аутентификации)
    private BackContextDesc_TryLoad_RetryLoad$ = ( incom$:Observable<IBackContexState> ) => 
        incom$.pipe(  
            debounceTime(1),
            //tap(x=>console.log(this.iBackCtxtoStr(x) )) ,
            filter( x => (! x.loading && !x.authing) || x.loaded ), 
            tap( x =>  (x.authed && !x.loaded) ? this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null ), 
            take(1),
            switchMap( x => x.authed ? this.BackContextDesc_TryLoad_RetryLoad_Wait$(incom$) : incom$ ),
            //tap(x=>console.log(this.iBackCtxtoStr(x) )) 
        ) ;   

    // Поток ожидания вторичной загрузки    
    private BackContextDesc_TryLoad_RetryLoad_Wait$ = ( incom$:Observable<IBackContexState> ) => 
        incom$.pipe( 
            debounceTime(1),
            //tap(x=>console.log(this.iBackCtxtoStr(x) )),
            filter( x => x.loaded || !x.loading || x.authing ),
            take(1)
        ) ;           

    // конвертор для отладки и прочие тулзы   
    private b2s = ( x:boolean) => (typeof x)=="undefined" ? "X-" : ( x ? "T-" : "F-") ;        
    private iBackCtxtoStr = ( x:IBackContexState) => this.b2s(x.loading )+ this.b2s(x.loaded )+ this.b2s(x.authing)+ this.b2s(x.authed )+ this.b2s(x.error); //+ this.b2s(x.fixeble) ;

    // Функция общий экстрактор из modeDescriptorSet
    private fromDescriptorSet = <U>( loadingEntity: IBackContextDescriptor<any>, f:( (x:IBackContextModeDescriptor) =>  (x:IBackContextDescriptor<any>, store:Store<fromStore.State>) => U  ) ) => 
        modeDescriptorSet.reduce( (a,x) =>  
            !a && loadingEntity.contextMode == x.mode 
                ?  f(x)( loadingEntity ,this.store )
                : a , (<U> undefined) 
    );        

    //Конвертирует BackContextDescriptor в поток определяющий загруженны ли соответствующие данные        
    public BackContextDescIsLoaded$ = ( loadingEntity: IBackContextDescriptor<any> ) => this.fromDescriptorSet( loadingEntity,  (x)=>x.isLoaded$ )
    //Конвертирует BackContextDescriptor в поток определяющий загружаются ли соответствующие данные        
    public BackContextDescIsLoading$ = ( loadingEntity: IBackContextDescriptor<any> ) => this.fromDescriptorSet( loadingEntity, (x)=>x.isLoading$ )
    //Конвертирует BackContextDescriptor в поток определяющий ошибку  
    public BackContextDescIsError$ =  ( loadingEntity: IBackContextDescriptor<any> ) => this.fromDescriptorSet( loadingEntity,  (x)=>x.isError$ )
    //Конвертирует BackContextDescriptor в базовый экшн загрузки
    public BackContextDescToLoadAction = ( loadingEntity: IBackContextDescriptor<any> ) => 
        this.fromDescriptorSet( loadingEntity, (d) => (x , state ) =>  new ExecItemAction( { itemOption: loadingEntity.context.options, itemAction: d.loadAct(loadingEntity) } )); 

    //  Исходный объект +  Джентельменский набор флагов ожиданий для контекста загрузки
    private  BackContextDescWaitFlags$ = ( loadingEntity: IBackContextDescriptor<any> ) =>
    combineLatest( 
           of(loadingEntity),  
           this.BackContextDescIsLoading$(loadingEntity), 
           this.BackContextDescIsLoaded$(loadingEntity), 
           this.store.select( fromSelectors.selEnvIsAuthenticatingFull ), //.pipe(tap(x=>console.log(x))),
           this.store.select( fromSelectors.selEnvIsAuthedFull ),
           this.BackContextDescIsError$(loadingEntity),
           toBackContexState
        ).pipe(
            distinctUntilChanged( (x,y) => x.authed == y.authed && x.authing == y.authing && x.loaded == y.loaded && x.loading == y.loading && x.error == y.error ),
        ) ;
        

    
    // //Конвертирует BackContextDescriptor в базовый экшн загрузки
    // public BackContextDescToLoadAction_old = ( loadingEntity: IBackContextDescriptor<any> ) =>
    //     modeDescriptorSet.reduce( (a,x) =>  
    //         !a && loadingEntity.contextMode == x.mode 
    //             ? new ExecItemAction( { itemOption: loadingEntity.context.options, itemAction: x.loadAct(loadingEntity) } )
    //             : a , <ExecItemAction> undefined 
    //     );           

    // /*
    // * Конвертирует BackContextDescriptor в поток определяющий загруженны ли соответствующие данные
    // */                                
    // public BackContextDescIsLoaded_old$ = ( loadingEntity: IBackContextDescriptor<any> ) =>
    //     modeDescriptorSet.reduce( (a,x) =>  
    //         !a && loadingEntity.contextMode == x.mode 
    //             ? x.isLoaded$( loadingEntity ,this.store )
    //             : a , (<Observable<boolean>> undefined) 
    //     );    

    // /*
    // * Конвертирует BackContextDescriptor в поток определяющий загружаются ли соответствующие данные
    // */                                
    // public BackContextDescIsLoading_old$ = ( loadingEntity: IBackContextDescriptor<any> ) =>
    // modeDescriptorSet.reduce( (a,x) =>  
    // !a && loadingEntity.contextMode == x.mode 
    //     ? x.isLoading$( loadingEntity ,this.store )
    //     : a , (<Observable<boolean>> undefined) 
    // );           
    // /*
    // * Конвертирует BackContextDescriptor в поток определяющий ошибку 
    // */
    // public BackContextDescIsError_old$ = ( loadingEntity: IBackContextDescriptor<any> ) =>
    // modeDescriptorSet.reduce( (a,x) =>  
    // !a && loadingEntity.contextMode == x.mode 
    //     ? x.isError$( loadingEntity ,this.store )
    //     : a , (<Observable<boolean>> undefined) 
    // );           

    // /*
    // * Конвертирует BackContextDescriptor в поток определяющий загруженны ли соответствующие данные
    // */                                
    // public BackContextDescIsFixError$ = ( loadingEntity: IBackContextDescriptor<any> ) =>
    // modeDescriptorSet.reduce( (a,x) =>  
    // !a && loadingEntity.contextMode == x.mode 
    //     ? x.isFixError$( loadingEntity ,this.store )
    //     : a , (<Observable<boolean>> undefined) 
    // );           





    // Основной поток на подготовленную поляну        
    // private BackContextDesc_TryLoad$ = ( incom$:Observable<IBackContexState> ) => 
    // {
    //     const s1 = this.BackContextDesc_TryLoad_CheckStart$(incom$);

    //     const s2 =  incom$.pipe( 
    //         skipUntil(s1),
    //         debounceTime(1),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )) ,
    //         //filter( x => x.loaded || typeof(x.fixeble) != "undefined" || x.authing ),
    //         filter( x => x.loaded || !x.loading || x.authing ),
    //         take(1),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )) ,
    //         switchMap( x => x.authing ? s3 : incom$ ),
    //         take(1),
    //     );

    //     const s3 =  incom$.pipe( 
    //         debounceTime(1),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )) ,
    //         filter( x => (! x.loading && !x.authing) || x.loaded ), 
    //         tap( x =>  (x.authed && !x.loaded) ? this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null ), 
    //         take(1),
    //         switchMap( x => x.authed ? s4 : incom$ ),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )) 
    //     ) ;

    //     const s4 =  incom$.pipe( 
    //         debounceTime(1),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )),
    //         filter( x => x.loaded || !x.loading || x.authing ),
    //         take(1)
    //     ) ;
        


    //    // const s4 =  incom$.pipe( skipUntil(s3),tap(x=>console.log(this.iBackCtxtoStr(x) ))) ;
    //    // const s5 =  incom$.pipe( skipUntil(s4),tap(x=>console.log(this.iBackCtxtoStr(x) )) ) ;
    //    // const s6 =  incom$.pipe( skipUntil(s5),tap(x=>console.log(this.iBackCtxtoStr(x) ))) ;


    //     return s2.pipe(
    //         tap(x=>console.log(this.iBackCtxtoStr(x) ))
    //     )

    // }
        //  incom$.pipe(  
        //      skipUntil( this.BackContextDesc_TryLoad_CheckStart$(incom$)),
        //      //tap(x=>console.log(this.iBackCtxtoStr(x) )),
        //      filter( x => x.authed || x.authing || x.error || x.loaded || x.loading || typeof(x.fixeble) != "undefined" ),
        //      //tap(x=>console.log(this.iBackCtxtoStr(x) )),
        //      filter( x => (!x.loading && typeof(x.fixeble) != "undefined" ) || x.loaded ), 
        //      tap(x=>console.log(this.iBackCtxtoStr(x) )),
        //      switchMap( x => x.fixeble ? this.BackContextDesc_TryLoad_AfterAuth2$(incom$) : of(x)  ),
        //      tap(x=>console.log(this.iBackCtxtoStr(x) )), 
        //      filter( x => (! x.loading  ) || x.loaded ), 
        //      tap(x=>console.log(this.iBackCtxtoStr(x) )),      
        //      //take(1)

        //     // tap(x=>console.log(this.iBackCtxtoStr(x) )),
        //     // take(4), 
        //     //tap(x=>console.log(this.iBackCtxtoStr(x) )),
        //     // filter( x => (!x.loading  &&  x.error)   || x.loaded ), 
        //      //tap(x=>console.log(this.iBackCtxtoStr(x) )),
        //      //take(2), 
        //      //takeLast(1), 

        //      //tap(x=>console.log(this.iBackCtxtoStr(x) )),
        //      //switchMap( x => x.authing ? this.BackContextDesc_TryLoad_AfterAuth$(incom$) : of(x)  ),
        //      //filter( x => (! x.loading  ) || x.loaded ), 
        //      //tap(x=>console.log(this.iBackCtxtoStr(x) )),      
        //      //take(1)
        //  ) ; 
 

    // Тригер вторичной загрузки        
    // private BackContextDesc_TryLoad_CheckAfterAuth$ = ( incom$:Observable<IBackContexState> ) => 
    //     incom$.pipe(  
    //         filter( x => (! x.loading && ! x.authing) || x.loaded ), 
    //         take(1), 
    //         tap( x =>  x.authed  ? this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null ) 
    //     ) ; 
    

    // Альтернативный поток (посал) если аутентификация         
    // private BackContextDesc_TryLoad_AfterAuth2$ = ( incom$:Observable<IBackContexState> ) => 
    //     incom$.pipe(  
    //         skipUntil( incom$.pipe( filter( x =>  x.authing || x.loaded ),take(1) ) ),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )),  
    //         //filter( x => x.authed || x.authing || x.error || x.loaded || x.loading || typeof(x.fixeble) != "undefined" ),
    //         filter( x => (! x.loading && !x.authing ) || x.loaded ), 
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )),  
    //         //takeUntil( timer(1000) ),
    //         //takeLast(1), 
    //         take(2),
    //         tap( x => ((!x.loaded) && x.authed) ? this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null ) ,
    //         tap(x=>console.log( ((!x.loaded) && x.authed))),      
    //         tap(x=>console.log(this.iBackCtxtoStr(x) ))      
    //     ) ;          



    // Альтернативный поток (посал) если аутентификация         
    // private BackContextDesc_TryLoad_AfterAuth$ = ( incom$:Observable<IBackContexState> ) => 
    //     incom$.pipe(  
    //         filter( x => (! x.loading && !x.authing ) || x.loaded ), 
    //         take(1), 
    //         tap( x => ((!x.loaded) && x.authed) ? this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null ) ,
    //         tap(x=>console.log( ((!x.loaded) && x.authed))),      
    //         tap(x=>console.log(this.iBackCtxtoStr(x) ))      
    //     ) ;          

    
    //////TOOLS//////////////////////////////////////////////////////////////////////////////////////    
       
   
//     /*
//     *  Исходный объект +  Джентельменский набор флагов ожиданий для контекста загрузки разделеный на потоки
//     */                                
//    public BackContextDescWaitFlagsStreams$ = ( loadingEntity: IBackContextDescriptor<any> ) =>
//         toBackContexState$(
//            loadingEntity,  
//            this.BackContextDescIsLoading$(loadingEntity), 
//            this.BackContextDescIsLoaded$(loadingEntity), 
//            this.store.select( fromSelectors.selEnvIsAuthenticatingFull ), 
//            this.store.select( fromSelectors.selEnvIsAuthedFull ),
//            this.BackContextDescIsError$(loadingEntity),
//            //this.BackContextDescIsFixError$(loadingEntity),
//         )

    /////////////////////////////////////////////////////////////        


        //     
        // F-F-F-F-F-        F-F-F-F-F-
        // F-F-F-F-T-        F-F-F-F-T-   
        // F-F-F-F-F-        F-F-F-F-F-   
        // F-F-T-F-F-        F-F-T-F-F-
        // F-F-T-F-T-

        // Успех при ауз  
        // F-F-F-F-F-
        // F-F-F-F-T-
        // F-F-F-F-F-
        // F-F-T-F-F-
        // F-F-F-F-F-
        // F-F-F-T-F-

        //ошибка ау 

    //private BackContextDesc_TryLoad$ = ( incom$:Observable<IBackContexState> ) => this.BackContextDesc_TryLoad_CheckFirstError$ (incom$)
        //   incom$.pipe(
        //     switchMap( x => this.BackContextDesc_TryLoad_CheckFirstError$ (incom$) ),
        //     take(1),
        //     tap(x=>console.log(this.iBackCtxtoStr(x) )),      
        //     tap(x=>console.log('сквозьттт-1' + x.data.contextMode ) ) ,   

        //   )  

    // private BackContextDesc_TryLoad$ = ( incom$:Observable<IBackContexState> ) =>
    //     incom$.pipe(
    //         filter( x => (! x.loading && ! x.authing) || x.loaded  ),
    //         take(1),
    //         tap(x=>console.log("BackContextDesc_TryFirstLoad$333")),
    //         map( x => ({ ...x, isTry: !x.loaded &&  !x.authed }) ),  
    //         tap( x =>  x.isTry ? this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null ) ,
    //         switchMap( x => incom$ ),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )),      
    //         tap(x=>console.log('база' + x.data.contextMode ) ) 
    //         //switchMap( x => this.BackContextDesc_TryLoad_Horhs$(incom$) )

    //     )
   
    // Сценарий подгрузки после аутентификации    
    // Loading$     -f--t--f-f-f-f -f -f
    // Loaded$      -f--f--f-f-f-f -f -f  
    // Authing$     -f--f--f-f-f-t -t -t
    // Authed$      -f--f--f-f-f-f -f -f
    // Error$       -f--f--f-t-f-f -t -f

    // Сценарий подгрузки после не связаный с ау
    // Loading$     -f--t--f-f-f-f -f -f
    // Loaded$      -f--f--f-f-f-f -f -f  
    // Authing$     -f--f--f-f-f-f -t -t
    // Authed$      -f--f--f-f-f-f -f -f
    // Error$       -f--f--f-t-f-t -t -f

    // CheckErr     ---------0----------       

 
    // private BackContextDesc_TryLoad_CheckErr$ = ( incom$:Observable<IBackContexState> ) => incom$.pipe(  filter( x => x.error || x.loaded ) ,take(1) ) ; 
    // private BackContextDesc_TryLoad_CheckErrOrAuthing$ = ( incom$:Observable<IBackContexState> ) => 
    //     incom$.pipe(  
    //         filter( x =>  x.error || x.authing || x.loaded  ) ,
    //         take(1),
    //         tap( ) 
    //     ) ; 
    // //private BackContextDesc_TryLoad_CheckAuthed$ = ( incom$:Observable<IBackContexState> ) => incom$.pipe(  filter( x =>  x.error || x.authing || x.loaded  ) ,take(1) ) ; 


    // private BackContextDesc_TryLoad_Horhs$ = ( incom$:Observable<IBackContexState> ) =>   
    //     incom$.pipe(     
    //         skipUntil(
    //             incom$.pipe(
    //                 skipUntil(this.BackContextDesc_TryLoad_CheckErr$(incom$) ),
    //                 //take(1),
    //                 tap(x=>console.log(this.iBackCtxtoStr(x) )),      
    //                 tap(x=>console.log('сквозь1' + x.data.contextMode ) ) , 
    //             )
    //         ),
    //         filter( x =>  x.error || x.authing || x.loaded  ) ,
    //         take(1),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )),      
    //         tap(x=>console.log('сквозь2' + x.data.contextMode ) ) 

    //     )
        
        
        // .pipe(
        //     map( x => x.authing  ), 
        //     skipUntil(this.BackContextDesc_TryLoad_CheckErrOrAuthing$(incom$) ),
        //     take(1),
        //     tap(x=>console.log(x)),      
        //     tap(x=>console.log('сквозь2 '  ) ) , 
        // )

    // private BackContextDesc_TryLoad_HorhsAuth$ = ( incom$:Observable<IBackContexState> ) =>        
    //     incom$.pipe(  
    //         filter( x =>  ( !x.authing )  || x.loaded  ),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )),    
    //         tap(x=>console.log('ау1')), 
    //         tap( x => x.authing && !x.loaded  ?  this.store.dispatch( this.BackContextDescToLoadAction(x.data))  : null ),
    //     )  


    // private BackContextDesc_TryLoad_Horhs$ = ( incom$:Observable<IBackContexState> ) =>        
    // merge(
    //     incom$.pipe(
    //         filter( x =>  x.error || x.loaded   ),    
    //         take(1),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )),      
    //         tap(x=>console.log('сквозь1' + x.data.contextMode ) ) , 
    //         switchMap( x=> incom$ ),         
    //         filter( x =>  x.error || x.authing || x.loaded   ),    
    //         take(1),
    //         tap(x=>console.log(this.iBackCtxtoStr(x) )),    
    //         tap(x=>console.log('сквозь2' + x.data.contextMode ) ) , 
    //     ),
    //     incom$.pipe(
    //         filter( x => ( !x.loading  && !x.loaded && x.authing ) ),
    //         take(1 ),
    //         tap(x=>console.log(x)),  
    //         tap(x=>console.log('ау1')), 
    //         switchMap( x=> incom$.pipe(filter( x => ( !x.loading  && !x.loaded && x.authed ) ,take(1) ) )  ),     
    //         tap(x=>console.log('ау2')) 
    //       ),    
    // ).pipe(
    //     tap(x=>console.log(x))        
    // )

    
    // private BackContextDesc_TryFirstLoad$ = ( incom$:Observable<IBackContexState> ) =>
    //     incom$.pipe(
    //         filter( x => (! x.loading && ! x.authing) || x.loaded  ),
    //         take(1),
    //         tap(x=>console.log("BackContextDesc_TryFirstLoad$")),
    //         map( x => ({ isTry: !x.loaded &&  !x.authed , data:x.data }) ),
    //         tap( x =>  x.isTry ? this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null ) ,
    //         map( x => x.isTry)
    //     )
            
    // private BackContextDesc_TryAuthedLoad$ = ( incom$:Observable<IBackContexState> ) =>
    //     incom$.pipe(
    //         filter( x => ( ! x.loading && ! x.authing ) &&  (x.loaded  || x.authed)  ),
    //         take(1),
    //         tap(x=>console.log("BackContextDesc_TryAuthedLoad$")),
    //         map( x => ({ isTry: ! x.loaded && x.authed , data:x.data }) ),
    //         tap( x =>  x.isTry ? this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null ) ,
    //         map( x => x.isTry)
    //     )

 
     
        // public BackContextDescLoadProc$ = ( loadingEntity: IBackContextDescriptor<any> ) => 
        // this.BackContextDescLoadProc_Prep$( loadingEntity ).pipe(
        //     tap(x=>console.log(x)),
        //     switchMap(  x => combineLatest( of(x),  this.BackContextDescIsLoaded$(x), (a, check) => ({ isLoaded:check, data:x })   )),
        //     tap(x=>console.log(x)),
        //     tap(  x =>    !x.isLoaded  ?   this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null  ),                                                      // попытка грузанутся
        //     switchMap(  
        //         x => x.isLoaded 
        //             ? of(x)
        //             : combineLatest( of(x.data),  this.BackContextDescIsLoaded$(x.data), (a, check) => ({ ...x, isLoaded:check  }) )
        //     ),
        //     /// теперь если не загружено и идет аутентификачия ждем
        //     switchMap( x =>  combineLatest(  of(x.data) ,  this.BackContextDescWaitAuth$(x.data), (a, check) => ({ ...x, isLoaded:check })  )),
        //     filter( x => x.isLoaded.ld || !x.isLoaded.athing || x.isLoaded.authed ),
        //     tap(  x => !x.isLoaded.ld && x.isLoaded.authed  ?  this.store.dispatch( this.BackContextDescToLoadAction(x.data)) : null  ),                    // попытка грузанутся    
        //     map(x => x.isLoaded.ld ) 
        // )       

    /*
    * Ожидание завершения аутентивикации (без таймаута) 
    * ждем либо загрузилось либо закончилась аутентификация  
    */                                
    // public BackContextDescWaitAuth$ = ( loadingEntity: IBackContextDescriptor<any> ) =>
    //             combineLatest( 
    //                     this.BackContextDescIsLoaded$(loadingEntity), 
    //                     this.store.select( fromSelectors.selEnvIsAuthenticating ),
    //                     this.store.select( fromSelectors.selEnvIsAuthed ),
    //                     ( x,y,z ) => ({ ld:x,athing:y, authed:z })) ;



    // Проверяет загружены ли данные (Стрелка кейсли в потоке)        
    // private BackContextDescLoadProc_Check$ = ( loadingEntity: IBackContextDescriptor<any> ) => 
    //     this.BackContextDescIsLoaded$(loadingEntity).pipe( 
    //         takeLast(1),
    //         map( x => x ? Either.Left<boolean,IBackContextDescriptor<any>>(true) :  Either.Right<boolean,IBackContextDescriptor<any>>(loadingEntity) )

    //     )        

    // // Проверяет загружены ли данные (Стрелка кейсли в потоке)        
    // private BackContextDescLoadProc_Check2$ = ( loadingEntity: Either<boolean,IBackContextDescriptor<any>> ) => 
    //     loadingEntity.map(  )    
            
    //     this.BackContextDescIsLoaded$(loadingEntity).pipe( 
    //         takeLast(1),
    //         map( x => x ? Either.Left<boolean,IBackContextDescriptor<any>>(true) :  Either.Right<boolean,IBackContextDescriptor<any>>(loadingEntity) )

    //     )        

    /*
    * Загрузка по BackContextDescriptor proцess (пока) бе-е-е-е-з таймаутов
    * Задача без выебонов сделать load proc c аутентифиацией 
    */                          
    // public BackContextDescLoadProc$ = ( loadingEntity: IBackContextDescriptor<any> ) => 
    //     this.BackContextDescLoadProc_Prep$( loadingEntity ).pipe(
    //         combineLatest(  this.BackContextDescIsLoaded$(loadingEntity) , (a, check) => a.bind( x => check ?  : x      )   )
            

    //     )       

             

        // of(Either.Right<boolean,IBackContextDescriptor<any>>(loadingEntity)).pipe(
        //     combineLatest(  
        //         this.store.select( fromSelectors.selectIsExist(loadingEntity.context.options.name)).pipe( takeLast(1)) 
        //         , (x,y) => { desc:x,    }  


        //     )

        // )            
                        

        //    public BackContextDescLoadProc = ( loadingEntity: IBackContextDescriptor<any> ) =>
        //         this.store.select( fromSelectors.selectIsExist(loadingEntity.context.options.name)).pipe(
        //             tap( x => !x ?  this.store.dispatch( new AddItem( loadingEntity.context.options)) : null ),
        //             filter( x => x ),                                                                                           // прошeл препар
        //             switchMap( x => this.BackContextDescIsLoaded$(loadingEntity) ),
        //             takeLast(1),
        //             tap(  x => !x ?  this.store.dispatch( this.BackContextDescToLoadAction(loadingEntity)  ) : null  ),         // попытка грузанутся
        //             switchMap( x => this.BackContextDescIsLoaded$(loadingEntity) ),
        //             combineLatest( fromSelectors.selEnvIsAuthenticating() , (x,y) =>   )
        //         ) ;   

            
        //     private  BackContextDescLoadProc_Prepare$ = ( loadingEntity: IBackContextDescriptor<any> ) => 
        //         of(Either.Right<boolean,IBackContextDescriptor<any>>(loadingEntity)).pipe(
        //             mergeMap( )

        //             tap( x => !x ?  this.store.dispatch( new AddItem( loadingEntity.context.options)) : null ),
        //             filter( x => x ),  
        //         )
                    
        //     /*
        //     * Загрузка по BackContextDescriptor proцess v2 на монаде
        //     */                                 
        //    public BackContextDescLoadProcEither = ( loadingEntity: IBackContextDescriptor<any> ) =>
        //         Either.Right<boolean,IBackContextDescriptor<any>>(loadingEntity)    

        //    this.store.select( fromSelectors.selectIsExist(loadingEntity.context.options.name)).pipe(
        //        tap( x => !x ?  this.store.dispatch( new AddItem( loadingEntity.context.options)) : null ),
        //        filter( x => x ),                                                                                           // прошeл препар
        //        switchMap( x => this.BackContextDescIsLoaded$(loadingEntity) ),
        //        takeLast(1),
        //        tap(  x => !x ?  this.store.dispatch( this.BackContextDescToLoadAction(loadingEntity)  ) : null  ),         // попытка грузанутся
            
        //    ) ;   


    // (<[BackContextMode, (x:IBackContextDescriptor<any>) => anyEntityActions][]>[
    //         [BackContextMode.Data, (x) => new GetItems(null)  ],
    //         [BackContextMode.Metadata, (x) => new GetItemsMeta()  ],
    //         [BackContextMode.MetadataField, (x) => new GetItemsMeta()  ],
    //         [BackContextMode.Record, (x) =>  new GetItemsPart( x.context.options.location  + x.context.options.selBack((<IBackRecord<any>>x.context).id )) ],
    //     ])
    //     .reduce( (a,x) =>  
    //         !a && loadingEntity.contextMode == x[0] 
    //             ? new ExecItemAction( { itemOption: loadingEntity.context.options, itemAction: x[1](loadingEntity) } )
    //             : a , undefined 
    //     );           


    /*
    *  Загрузка из BackContextDescriptor без учета длительных эффектов типа аутентификации 
    *  (подготовка места и подгрузка)
    */                 
    //    public LoadFromBackContextDesc$ = ( loadingEntity: IBackContextDescriptor<any> ) =>
    //         this.store.select( fromSelectors.selectIsExist(loadingEntity.context.options.name)).pipe(         
    //             tap( x => !x ?  this.store.dispatch( new AddItem(loadingEntity.context.options)) : null ),
    //             filter( x => x ),
    //             tap(  x => 
    //                 this.store.select( fromSelectors.selectById(opt.name,id)).pipe(  take(1) )
    //                 .subscribe(x => !!x ? null : this.store.dispatch(  new ExecItemAction( {itemOption:opt , itemAction: new GetItemsPart(opt.location + opt.selBack(id)) })))   
    //             ),
    //     mergeMap( x => this.store.select( fromSelectors.selectById(opt.name,id)) )
    //)            
    
    //         // public loadEntity = ( loadingEntity: IBackContextDescriptor<any>) =>
    //         //     BackContextMode.    
    //         //     loadingEntity.contextMode.    
    //         //     loadingEntity.context.options    
    //         //     this.store.dispatch( new ExecItemAction( {loadingEntity. itemOption:opt , itemAction: new ChangeRowSeed(x) }) )            
    //     )

    // public loadEntity = ( loadingEntity: IBackContextDescriptor<any>) =>
    //     BackContextMode.    
    //     loadingEntity.contextMode.    
    //     loadingEntity.context.options    

    //     this.store.dispatch( new ExecItemAction( {loadingEntity. itemOption:opt , itemAction: new ChangeRowSeed(x) }) )            

}

