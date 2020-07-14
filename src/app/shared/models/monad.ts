/**
 * monad  
 */
export class monad {
    static of = (x:any) => new monad(x)

    private constructor(public val:any) { }
    public bind:(( f:((v:any) => monad )) => monad ) = (f) => f(this.val) ;
    
    public run = () => this.val;
    public map = (f:((x:any)=>any )) => this.bind( y => monad.of(f(y)));   
    public tap = (f:((x:any)=>any )) => { f(this.val); return this;}   

}


/**
 * typed monad  
 */
export class tMonad<T> {
    static of = <U>(x:U) => new tMonad<U>(x) ; 
    private constructor(public val:T) { }
    public bind: <U>(f:( (x:T) => tMonad<U> ) ) => tMonad<U>  = (f) =>  f(this.val) ;      

    public map: <U>(f:((x:T) => U)) => tMonad<U> = (f) => this.bind( y => tMonad.of(f(y))); 
    public tap = (f:((x:any)=>any )) => { f(this.val); return this;}      
    public run = () => this.val;
}

//public bind<U>(f:( (x:T) => tMonad<U> ) ) { return  f(this.val) ; }     
//public map<U>( f:((x:T) => U) ) { return this.bind( y => tMonad.of(f(y))); }   
