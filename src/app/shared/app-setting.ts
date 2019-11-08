export class AppSettings {
    svcFasadeUri:  string = "http://webgate.nvavia.ru:8080/api" ;
    svcFasadeUri2: string = "http://b-portal.nvavia.ru/api" ;
    svcFasadeUri3: string = "http://localhost:50997/api" ;
    svcRestMetadataSuffix: string ="/Md" ;
    svcRestRecTemplateSuffix: string ="/!Template" ;


   

    auth2AuthEndPoint: string           = "https://adfs.nvavia.ru/adfs/oauth2/authorize";
    auth2TokenndPoint: string           = "http://localhost:50997/api/Token";                                //"https://adfs.nvavia.ru/adfs/oauth2/token";
    auth2ClientId:string                = "TESTFRONTID";
    auth2FSloc:string                   = "https://adfs.nvavia.ru/federationmetadata/2007-06/federationmetadata.xml";
    auth2LogoutEndPoint:string          = "https://adfs.nvavia.ru/ADFS/ls";



    auth2resource:string                = "https://sqlback-win12.nvavia.ru/FsCsweb";
    auth2LoginRedirectSuffix:string     = "Auth";
    auth2RequestTokenSuffix:string      = "Token";


    //http://webgate.nvavia.ru:8080/api/NvaAx/NvaSdVoluntaryMessageRecipients/Md

 }
   