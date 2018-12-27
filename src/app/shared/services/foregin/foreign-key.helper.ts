/**
 *  Helper 
 *      
 * 
 * 
 */


const FK_MACRO_BEGIN = "{"; 
const FK_MACRO_END = "}";
const FK_PARS_PATR_DEVIDER = "?";
const FK_NAME_PATR_DEVIDER = "/";

/**
*  Legasy
*  Get Macros from location  
*/ 
export const getLocationMacros = (location: string) => {
    var recFun = (s: string, r: string[]) => {
        var bp = s.indexOf(FK_MACRO_BEGIN)
        if (bp > 0 && s.length > (bp+1) ) {
            var ss = s.substring(bp+1);
            var ep = ss.indexOf(FK_MACRO_END);
            if (ep > 0) {
              r.push(ss.substring(0, ep));
              r = recFun(ss.substring(ep), r);
            }
        }
        return r;
    }
    return recFun(location, []);
}

/**
 *  Check location contains macros
 */
export const isLocationContainsMacros = (location: string) => getLocationMacros( location ).length > 0  

/**
 *  Check location undepend
 */
export const isLocationUndepended =  isLocationContainsMacros ;

/**
 *  Cut native name from location
 */
export const locationToName = (loc: string) => {
    const e = loc.indexOf(FK_PARS_PATR_DEVIDER);
    const l = e > 0 ?  loc.substring(0,e) : loc;
    const b = l.lastIndexOf(FK_NAME_PATR_DEVIDER);
    return b>0 ? l.substring(b): l;
}
    
/**
 *  location to simple option
 */
export const locationToEntityOption = (location: string) => (
    {
        name:       locationToName(location) ,          
        location:   location,                  // http sublocation  key 
        selectId:   undefined,                 // entity to id value func    
        selBack:    undefined    
    }
);




