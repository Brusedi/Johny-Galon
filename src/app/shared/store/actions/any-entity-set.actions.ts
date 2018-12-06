import { Action } from '@ngrx/store';

import { anyEntityOptions } from '@appModels/any-entity';
import { anyEntityActions } from './any-entity.actions';



export enum AnyEntitySetActionTypes {
    ADD_ANY_ENTITY                      = '[Entity set] Add any entity',
    EXEC                                = '[Entity set] Executing' ,
    EXEC_ANY_ENTITY_ACTION              = '[Entity set] Entyty action executing' ,
    COMPLETE_ANY_ENTITY_ACTION          = '[Entity set] Entyty action chain completed' ,
    EROR_ANY_ENTITY_SET                 = '[Entity set] Error' 
}


export class AddItem implements Action {
    readonly type = AnyEntitySetActionTypes.ADD_ANY_ENTITY
    constructor(public payload: anyEntityOptions<any> )  { }
}

export class Exec implements Action {
    readonly type = AnyEntitySetActionTypes.EXEC
    reduserData: anyEntityOptions<any>;
    constructor(public payload: {name:string, itemAction: anyEntityActions  } ) {}
}

export class ExecItemAction implements Action {
    readonly type = AnyEntitySetActionTypes.EXEC_ANY_ENTITY_ACTION
    constructor(public payload: {itemOption:anyEntityOptions<any> , itemAction: anyEntityActions  } ) {}
}

export class CompleteItemAction implements Action {
    readonly type = AnyEntitySetActionTypes.COMPLETE_ANY_ENTITY_ACTION
    constructor(public payload: {name:string} ) {}
}

export class ErrorAnyEntitySet implements Action {
    readonly type = AnyEntitySetActionTypes.EROR_ANY_ENTITY_SET;
    constructor(public payload: any) {}
}  

export type AnyEntitySetAction =
  | Exec
  | AddItem
  | ExecItemAction
  | CompleteItemAction
  | ErrorAnyEntitySet  
  
  ;