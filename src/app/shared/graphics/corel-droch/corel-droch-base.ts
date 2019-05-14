import {  drochIcons } from "./corel-droch-data";


/**
 *  Canvas graph tool
 *  031218    
 */

const defaultIconColor = "black"; 


/**
 * 2D - point
 */
interface Point{
    x:number
    y:number
}

const PointEq = (a:Point, b:Point ) => a.x==b.x && a.y == b.y  

/**
 * 2D - Size
 */
interface Size{
    width:number
    height:number
}

/**
 * Point of beze 
 */
interface CruvePoint{
    begin:Point
    p1:Point
    p2:Point
    end:Point
}

export enum GrAction {  Stroke, Fill, Clear }
export type grStyles = string|string[]

/*
*  Graph primitive by  
*/
interface GrAthom{
    path:CruvePoint[],
    color:grStyles,
    action:GrAction,
}

interface GrIcon{
    athoms:GrAthom[]
}

/**
 *  Legasy converters
 */
const valOrZero = ( p:number[], index:number ) => index < p.length  ? p[index] : 0 ;
const indToPoint = ( p:number[], begIndex:number ):Point => ({x:valOrZero(p,begIndex),y:valOrZero(p,begIndex+1)}) ;
const legasyToCruvePoint = (p:number[]) => ({ begin:indToPoint(p,0), p1:indToPoint(p,2), p2:indToPoint(p,4), end:indToPoint(p,6) })  ;
const legasyToCruvePath = (lPath:number[][]):CruvePoint[] => lPath.map( x =>  legasyToCruvePoint(x) )

/**
*  Legasy string converters
*/
const legasyStrToCruvePath = (lPath:string):CruvePoint[] => {
    const getPoint = (s:string) => { 
        const e = s.indexOf('}'); 
        const b = e > 0 ? s.substr(0,e).lastIndexOf('{') : e ;
        return (e<=0 || b<=0) ? 
            { pnt:undefined, rst:s } :
            { pnt:s.substring(b+1,e), rst: s.substring(e+1)}
    }    

    const next = ( source:string, ret:CruvePoint[] ) =>{
        const parse = (s:string) => {             
            const sa =  s.split(',');
            const pr = (st:string[],i) => st.length > i ? (+st[i]):0
            return { 
                begin: { x: pr(sa,0) , y: pr(sa,1) }, 
                p1: { x: pr(sa,2) , y: pr(sa,3) }, 
                p2: { x: pr(sa,4) , y: pr(sa,5) }, 
                end: { x: pr(sa,6) , y: pr(sa,7) } 
            }
        }
        const p = getPoint(source);
        //console.log(p);
        return p.pnt == undefined ? ret : next( p.rst, [...ret, parse(p.pnt)]  )
    }        
    return next(lPath,[]); 
}


/**
*  Transformation
*/
const baseScale = (p:number, len:number, sourseLen:number = 100 ) => len*p/sourseLen 
const baseScalePoint = (p:Point, size:Size, sourseLen:number = 100 ):Point => ({x:baseScale(p.x,size.width,sourseLen), y:baseScale(p.y,size.height,sourseLen)})
const CruvePointToSize = (cp:CruvePoint, size: Size):CruvePoint => ({ 
    begin:baseScalePoint(cp.begin,size),
    p1:baseScalePoint(cp.p1,size),
    p2:baseScalePoint(cp.p2,size),
    end:baseScalePoint(cp.end,size), 
})
const AthomAsSize = ( icon:GrAthom, size: Size) => ({...icon, path:icon.path.map(x => CruvePointToSize(x,size))})
const IconAsSize  = ( icon:GrIcon, size: Size)  => ({...icon, athoms: icon.athoms.map(x =>AthomAsSize(x, size)) })

const splitCruvePoint = (icon:CruvePoint[]):CruvePoint[][] => {
    const splitStep =( acc: { ret: CruvePoint[][] , cur:CruvePoint[] }, i:CruvePoint ) =>
        acc.cur.length > 0 && ! PointEq( acc.cur[acc.cur.length-1].end , i.begin  )?
                     { ret:[...acc.ret, [ ...acc.cur]], cur:[i] }:
                     { ret: acc.ret, cur:[...acc.cur, i] } ;
    const r = icon.reduce( splitStep , {ret:[], cur:[]});  
    return [...r.ret, r.cur];
}


const drawAthom = ( icon:GrAthom, ctx:CanvasRenderingContext2D ) => {
    const is = splitCruvePoint(icon.path);
    const getFillStyle = (i:number ) => 
        !icon.color ? undefined:( 
            !Array.isArray(icon.color)? icon.color: 
                ( icon.color.length > i ? icon.color[i] : icon.color[icon.color.length-1] ) 
        )
    const draw = (a:number,i:CruvePoint[]) => {
        ctx.beginPath();  
        ctx.moveTo(i[0].begin.x, i[0].begin.y);
        i.forEach( p => ctx.bezierCurveTo(p.p1.x,p.p1.y,p.p2.x,p.p2.y,p.end.x,p.end.y));
        ctx.fillStyle = getFillStyle(a) ;
        ctx.fill();
        return a + 1;
    }
    console.log(is);
    is.reduce( draw, 0);
}

const drawIcon = ( icon:GrIcon, context:CanvasRenderingContext2D ) => icon.athoms.forEach( x => drawAthom(x,context))


/**
 *  legasy Data to Athom
 */
const legasyToFillAthom = (lPath:number[][], color:string):GrAthom => ({ path: legasyToCruvePath(lPath), color: color, action:GrAction.Fill})
const IconAddAthom = ( athom: GrAthom, icon:GrIcon = { athoms:[]} ):GrIcon =>  ({ ...icon,  athoms: [ ...icon.athoms, athom] }) ;
const IconFromLegasy = ( lPath:number[][], color:string ):GrIcon =>  IconAddAthom( legasyToFillAthom( lPath,color )  )  ;

const legasyStrToFillAthom = (lPath:string, color:grStyles):GrAthom => ({ path: legasyStrToCruvePath(lPath), color: color, action:GrAction.Fill})

const IconFromLegasyStr = ( lPath:string, color:grStyles ):GrIcon =>  IconAddAthom( legasyStrToFillAthom( lPath,color )  )  ;


export const findIconByName = (name: string) => drochIcons.hasOwnProperty(name)?drochIcons[name]:undefined;


interface DrochIconOptions{
    presetName: string;
    color:      string;    
    size:       {}   
}

export const drawIconByOption = ( context:CanvasRenderingContext2D, option:{} ) => 
    option.hasOwnProperty("presetName")
        ? drawIcon(
            IconAsSize( 
                IconFromLegasy( 
                    findIconByName(option["presetName"])
                    ,option.hasOwnProperty("color")? option["color"] : defaultIconColor 
                )
                , {height:100,width:100}
            ), context)
        : console.log('не шмогла'); 



export const toSvgPath = (data:number[][]) => 
    data.reduce( 
        ( a:{ret:string, lx:number, ly:number },x) => 
            x.length!=8
                ? a
                : { 
                    lx: x[6],
                    ly: x[7], 
                    ret:( a.ret +' '+(x[0]!=a.lx||x[1]!=a.ly?'M '+x[0]+' '+x[1]:'') + ' C '+ x[2]+' '+x[3]+', '+x[4]+' '+x[5]+', '+x[6]+' '+x[7] )  
                }
        ,({ret:"", lx:-1, ly:-1 }) 
    ).ret
    

export const toHtml = ( data:number[][]) =>
    "<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\">" + "\n"+                //viewBox=\"0 0 100 100\"
    "<path  d=\""+ toSvgPath(data) +"\"/>" + "\n"+     
    "</svg>"

 