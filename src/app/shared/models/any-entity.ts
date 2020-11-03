// Опции для AnyEntityLazy - итема
export interface anyEntityOptions<T>{
    name:       string          
    location:   string                  // http sublocation  key 
    selectId:   (i:T) => any            // entity to id value func    
    selBack:    (x:any) => string         // id value to http sublocation suffix
} 

export class AnyEntity
{
     [key: string]: any 
}  

export class AnyEntityId
{
     id:any   
     [key: string]: any 
}  

// Backend error message
export interface BackICommonError{
     Name:string 
     Message:string
     Code:number
     StatusCode:number
     Data:any 
} 

// 
export interface BackICommonErrorEx extends BackICommonError {
     Id:string
     Retriable:boolean
} 


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
*  210720  Попытка идентифицировать загрузку с бэка
*/
export enum BackCommonContextMode { Data, Metadata }

export enum BackContextMode { Data, Metadata, MetadataField, Record }


export const BackContextModeToStr = ( mode:BackContextMode ) =>  (  <[BackContextMode,string][]> [
          [BackContextMode.Data, "Data"],
          [BackContextMode.Metadata, "Metadata"],
          [BackContextMode.MetadataField, "MetadataField"],
          [BackContextMode.Record, "Record"]
     ]).reduce( (a,x) =>  !a && mode == x[0] ? x[1] :a , undefined)



export interface IBackFieldMeta<T> {
     options : anyEntityOptions<T>
     field: string
}

export interface IBackCommonContext<T> {
     options : anyEntityOptions<T>
     optionsMode : BackCommonContextMode
}

export interface IBackRecord<T> {
     options : anyEntityOptions<T>
     id : T
}

export type IBackContext<T> =  IBackCommonContext<T> |  IBackFieldMeta<T> | IBackRecord<T> ;

export interface IBackContextDescriptor<T>{
     context : IBackContext<T>
     contextMode: BackContextMode
}

/*
*  Loadeble Back-end context descriptor
*/
export class BackContextDescriptor<T> {

     public static Data<U>( opt: anyEntityOptions<U> ) { return  new BackContextDescriptor<U>(  { options: opt, optionsMode:BackCommonContextMode.Data }  ) ;}
     public static Meta<U>( opt: anyEntityOptions<U> ) { return  new BackContextDescriptor<U>(  { options: opt, optionsMode:BackCommonContextMode.Metadata}  ) ;}
     public static MetaField<U>( opt: anyEntityOptions<U>, fld: string ) { return  new BackContextDescriptor<U>(  { options: opt, field:fld}  ) ;}
     public static Record<U>( opt: anyEntityOptions<U>, recId: U ) { return  new BackContextDescriptor<U>( {options: opt, id:recId }  ) ;}

     constructor( public context : IBackContext<T> ){}

     contextMode = 
          this.context.hasOwnProperty("field") 
          ? BackContextMode.MetadataField
          : this.context.hasOwnProperty("id")
               ? BackContextMode.Record
               : this.context.hasOwnProperty("optionsMode") && this.context["optionsMode"] == BackCommonContextMode.Data 
                    ? BackContextMode.Data
                    : BackContextMode.Metadata

}          
/////////////////////////////////////////////////////////////////////////////////////////////////////////



