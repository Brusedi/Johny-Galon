// Опции для AnyEntityLazy - итема
export interface anyEntityOptions<T>{
    name:       string          
    location:   string                  // http sublocation  key 
    selectId:   (i:T) => any            // entity to id value func    
    selBack:    (any) => string         // id value to http sublocation suffix
} 