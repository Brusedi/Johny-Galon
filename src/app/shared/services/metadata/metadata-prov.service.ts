import { Injectable } from '@angular/core';
import { DataProvService } from '../data-prov.service';
import { tap, map, mergeAll, toArray, mergeMap } from 'rxjs/operators';
import { FieldDescribe, FieldDescribes } from '@appModels/metadata';
import { Observable, of, from } from 'rxjs';
import { MetadataAdaptService } from './metadata-adapt.service';



const IS_FIELD_TAG_BEGIN = "["; 
const IS_FIELD_TAG_END = "]";
const ADD_META_TYPE_KEY_NAME =  IS_FIELD_TAG_BEGIN + "Type"+IS_FIELD_TAG_END;
const META_FIELDNAME_KEY_NAME =  IS_FIELD_TAG_BEGIN + "id"+IS_FIELD_TAG_END;


const MODULE_NAME    = 'Johny Galon';
const COMPONENT_NAME = 'MetadataEngineService ';
const log = (msg:any) => ( console.log("["+MODULE_NAME+"]"+"["+COMPONENT_NAME+"] " + msg )  );



@Injectable({
  providedIn: 'root'
})
export class MetadataProvService {
  
  constructor(
    private dataService: DataProvService,
    private adapterService: MetadataAdaptService
    ) { }

  public metadata$(loc:string ):Observable<FieldDescribes>{
    const r$ =  
      this.loadMetadata(loc).pipe(
        map( x => x.reduce( (a,e) => ({...a, [e.name]:e }) ,  {}  ) )
      );
    

    r$.subscribe( x=> console.log(x));

    return r$;
  }
  
  /**
  * Prepare metadata
  */
  private loadMetadata = ( loc:string ) => 
    this.dataService.metadata$(loc).pipe(
        map( x => this.toFieldsList(x) ),
        map( x => x.map( fld => this.dataService.metadata$(loc, fld ) ) ),
        mergeMap( x => from(x).pipe(mergeAll(),toArray())),
        map( x =>  x.map( x=> this.adapterService.toFieldDescribe(x, META_FIELDNAME_KEY_NAME, (x,t) => x[t] ) ))
    );

  /**
   *  Convert table metadata to fields list
   */
  private toFieldsList = (data:any) => {
    const isField = (key:string) => key.length > 2 && key[0]== IS_FIELD_TAG_BEGIN && key[key.length-1] ==  IS_FIELD_TAG_END ;    
    const clear   = (key:string) => key.length > 2 ? key.substring(1, key.length - 1) : key  ;
    return Object
          .getOwnPropertyNames(data)
          .filter(isField)
          .map(clear) ;
  }

  //******************************************************************************************************************** */
  private getFD():FieldDescribe {
    return ({ name: "", description: '', id: '', altId: '', foreignKey: '', type: '', visible: true, required: true,  editable: true,   defaultValue: null  })
  } 




}
