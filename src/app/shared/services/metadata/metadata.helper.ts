/**
 *  Helper 
 *      
 * 
 * 
 */


const FK_MACRO_BEGIN = "{"; 
const FK_MACRO_END = "}";

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
export const IsLocationContainsMacros = (location: string) => getLocationMacros( location ).length > 0  

