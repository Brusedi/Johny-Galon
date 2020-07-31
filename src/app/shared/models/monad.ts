export const id = (x) => x
export const isNotEmpty = (x:any) => !!x


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

/*
* 210720 New monads 
* No need to stand - you need to shine
*/

export interface IMonad<E,T>
{
    bind<U>( f:((x:T) => IMonad<E,U>)) : IMonad<E,U>
    ret<U> ( v:U ) : IMonad<E,U>
}


// Extention пока по дурацки
export class MonadExtention{
    public static map = <U,E,T>( inst:IMonad<E,T> , f:((x:T)=> U) )  => inst.bind( (y:T) => inst.ret(f(y)) )
    public static tap = <E,T>( inst:IMonad<E,T> , f:((x:T)=> any) )  => inst.bind( (y:T) => { f(y) ; return inst.ret( y ); })
    public static applicative = <U,E,T>( inst:IMonad<E,T> , mf:(  IMonad<E, (x:T) => U >) )  => mf.bind( (f) => MonadExtention.map(inst,f))
    public static join = <E,T>( inst:IMonad<E, IMonad<E,T>>  )  => inst.bind( (x) => x)
}

/*
* Either As Haskell lexic
*/
export class Either<E,T> {
    public static Left =  <E,U>( e:E )   => new Either<E,U>(true, e, null ) ;
    public static Right = <E,U>( v:U ) => new Either<E,U>(false, null,v) ;
    private constructor( private readonly isLeft:boolean, private readonly err?:E, private readonly val?:T ){ }                             // лигитимные типы могут быть нулэйблы, нужен флаг :( ...
    public bind :  <U>( f:((x:T) => Either<E,U>)) => Either<E,U> = (f)  => this.isLeft ? Either.Left(this.err) : f(this.val) ;
    public ret  = <U>( v:U ) => Either.Right<E,U>(v) ;
    public run = ()  => this.isLeft ? this.err : this.val ;

    //Extention
    public map = <U>(f:((x:T)=> U)) => <Either<E,U>>MonadExtention.map<U,E,T>(this,f) ; 
    public tap = (f:((x:T)=> any)) =>  <Either<E,T>>MonadExtention.tap<E,T>(this,f);
    public applicative = <U>( mf:Either<E, (x:T)=> U>) =>  <Either<E,U>>MonadExtention.applicative<U,E,T>(this,mf) ;      

    public static join = MonadExtention.join;      
    //public join = <U>(f:((x:T)=> Either<E,U>))  MonadExtention.join;      

    //Invent 
    /*
    * Ну пиздец блядь!!! Зеркалит монаду  
    */
    public reverse: () => Either<T,E> = () =>  this.isLeft ? Either.Right<T,E>(this.err) : Either.Left<T,E>(this.val) 

    //tools 
    public LeftIs : (f:((y:T)=> boolean), fc?:( (y:T) => E ) ) => Either<E,T> = (f,fc?)  => 
                this.bind( x => f(x) ? Either.Left( (fc == undefined) ? id(x) : fc(x) ) :  Either.Right(x)  )  

    public LeftOrMap = <U>( isF :((y:T)=> boolean) , f:((x:T)=> U), fc?:( (y:T) => E ) ) => this.LeftIs(isF, fc ).map(f)
    public LeftIsNotEmptyOrMap = <U>(f:((x:T)=> U), fc?:( (y:T) => E ) ) => this.LeftOrMap(isNotEmpty, f, fc)

}



