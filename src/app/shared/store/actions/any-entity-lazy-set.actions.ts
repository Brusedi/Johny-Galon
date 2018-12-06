import { Action } from '@ngrx/store';

import { anyEntityLazyActions } from './any-entity-lazy.actions';
import { anyEntityOptions }     from '@appModels/any-entity';



export enum AnyEntityLazySetActionTypes {
    ADD_ANY_ENTITY_LAZY                 = '[Any entity lazy set] Add any entity',
    EXEC                                = '[Any entity lazy set] Executing' ,
    EXEC_ANY_ENTITY_LAZY_ACTION         = '[Any entity lazy set] Entyty action executing' ,
    COMPLETE_ANY_ENTITY_LAZY_ACTION     = '[Any entity lazy set] Entyty action chain completed' ,
    EROR_ANY_ENTITY_SET                 = '[Any entity lazy set] Error' 
}


export class AddItem implements Action {
    readonly type = AnyEntityLazySetActionTypes.ADD_ANY_ENTITY_LAZY
    constructor(public payload: anyEntityOptions<any> )  { }
}

export class Exec implements Action {
    readonly type = AnyEntityLazySetActionTypes.EXEC
    reduserData: anyEntityOptions<any>;
    constructor(public payload: {name:string, itemAction: anyEntityLazyActions  } ) {}
}

export class ExecItemAction implements Action {
    readonly type = AnyEntityLazySetActionTypes.EXEC_ANY_ENTITY_LAZY_ACTION
    constructor(public payload: {itemOption:anyEntityOptions<any> , itemAction: anyEntityLazyActions  } ) {}
}

export class CompleteItemAction implements Action {
    readonly type = AnyEntityLazySetActionTypes.COMPLETE_ANY_ENTITY_LAZY_ACTION
    constructor(public payload: {name:string} ) {}
}

export class ErrorAnyEntitySet implements Action {
    readonly type = AnyEntityLazySetActionTypes.EROR_ANY_ENTITY_SET;
    constructor(public payload: any) {}
}  

export type AnyEntityLazySetAction =
  | Exec
  | AddItem
  | ExecItemAction
  | CompleteItemAction
  | ErrorAnyEntitySet  
  
  ;