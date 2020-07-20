import { Url } from "url";
import { of } from "rxjs";
/*
*  ПАРСИТ ПРОИЗВОЛЬНУЮ ОШИБКУ И ПРИВОДИТ К СТАНДАРТИЗИРОВАННОМУ ВИДУ 
*/
export class ErrorParsed {
;
    private readonly WWW_AUTH_HEADER = "www-authenticate";
    private readonly X_CAP = "Ошибка";
    private readonly X_DSC = "Неизвестная ошибка";

    private safeGet = (e,p,d) => e.hasOwnProperty(p) ? e[p] : d; 
    private isHtml = (err) => err.hasOwnProperty('status') &&  err.hasOwnProperty('statusText') ? true : false ; 
    private isHtmlWithAuthBearer = (err) => err.hasOwnProperty('headers') &&  err['headers'].hasOwnProperty(this.WWW_AUTH_HEADER) ? true : false ;  

    caption:string;
    description:string;
    
    constructor(public objectError:any ) 
    {
        this.objectError = this.safeGet(objectError,"error",objectError);
        this.caption     = this.X_CAP;
        this.description = this.X_DSC;
        this.TryParseError(this.objectError)
        console.log( this.objectError);
        console.log( this.caption);
        console.log( this.description);
    }

    private TryParseError = (err) => this.isHtml(err)? this.tryParseHtml(err) : this.tryParseUnknown(err)

    private tryParseUnknown = (err) => {
        this.caption     = this.safeGet(err,"Name",this.X_CAP) ;
        this.description = this.safeGet(err,"Message",this.X_DSC) ;
    }

    private tryParseHtmlSimpl = (err) => {
        this.caption     = this.safeGet(err,"status",this.X_CAP) ;
        this.description = this.safeGet(err,"statusText",this.X_DSC) ;
    }


    private  tryParseHtml = (err) => this.tryParseHtmlSimpl(err)
        // this.isHtmlWithAuthBearer(err) 
        // ?    

    toDialogData = () => ({ Message: this.description, Name:this.caption });    
    

}
