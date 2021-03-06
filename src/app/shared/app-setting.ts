export class AppSettings {
    //svcFasadeUri1:  string = "http://webgate.nvavia.ru:8080/api" ;
    //svcFasadeUri2: string = "httpp://b-ortal.nvavia.ru/api" ;
    //svcFasadeUri : string = "http://localhost:50997/api" ;
    svcFasadeUri : string = "https://dock.nvavia.ru/api" ;
    
    svcRestMetadataSuffix: string ="/Md" ;
    svcRestRecTemplateSuffix: string ="/!Template" ;


    auth2AuthEndPoint: string           = "https://adfs.nvavia.ru/adfs/oauth2/authorize";
    auth2ClientId:string                = "JOHNY_GALON_AUTH"; //"TESTFRONTID";
    auth2FSloc:string                   = "https://adfs.nvavia.ru/federationmetadata/2007-06/federationmetadata.xml";
    auth2LogoutEndPoint:string          = "https://adfs.nvavia.ru/ADFS/ls";

    //auth2resource:string              = "https://sqlback-win12.nvavia.ru/FsCsweb";
    auth2resource:string                = "https://adfs.nvavia.ru/adfs/JohnyGalon";
    auth2LoginRedirectSuffix:string     = "Auth";
    auth2RequestTokenSuffix:string      = "Token";

    auth2AuthEndPoint_Google: string    = "https://accounts.google.com/o/oauth2/v2/auth";
    auth2ClientId_Google:string         = "919554785719-j6it3qqmrja7iqcpa0jkejmhi03coevn.apps.googleusercontent.com" ;//"919554785719-dj2snd740luu6hr698acfs9b5lsvl3he.apps.googleusercontent.com";
    auth2Scope_Google:string            = "email"; //"profile";//"email" ;
    auth2LogoutEndPoint_Google:string   = "https://mail.google.com/mail/u/0/?logout&hl=ru";

                                            //"https://www.googleapis.com/auth/drive.metadata.readonly";
    //auth2Scope_Google:string            = "https://www.googleapis.com/auth/gmail.labels";


    //http://webgate.nvavia.ru:8080/api/NvaAx/NvaSdVoluntaryMessageRecipients/Md

 }
   