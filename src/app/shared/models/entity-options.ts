import { anyEntityOptions, AnyEntityId } from "./any-entity";


export const JgMockTableOption:anyEntityOptions<AnyEntityId> = {
    name: "JgMockTable", 
    location:"/NvaSd2/JgMockTable", 
    selectId: (x) => x.id,
    selBack: (x:string) => ("?ID=" + x )
  };

export const SdIncomingOption:anyEntityOptions<AnyEntityId> = {
    name: "NvaSdIncoming", 
    location:"/NvaSd2/NvaSdIncoming", 
    selectId: (x) => x.ID,
    selBack: (x:string) => ("?ID=" + x )
  };  


export const NvaPlanPurchaseLine:anyEntityOptions<AnyEntityId> = {
    name: "NvaPlanPurchaseLine", 
    location:"/NvaAx/NvaPlanPurchaseLine", 
    selectId: (x) => x.RECID,
    selBack: (x:string) => ("?RECID=" + x )
  };    


// Testing handling access to Auth back service 
// 091019 
export const AuthTestDataOption:anyEntityOptions<AnyEntityId> = {
    name: "AuthTestData", 
    location:"/values", 
    selectId: (x) => x.RECID,
    selBack: (x:string) => ("?RECID=" + x )
  };    

//
export const FlightFidsOption:anyEntityOptions<AnyEntityId> = {
  name: "FlightFids", 
  location:"/NvaAx/FlightFids", 
  selectId: (x) => x.ID,
  selBack: (x:string) => ("/" + x )
};      

export const NvaOmaCustLogo:anyEntityOptions<AnyEntityId> = {
  name: "NvaOmaCustLogo", 
  location:"/NvaAx/NvaOmaCustLogo", 
  selectId: (x) => x.CUSTACCOUNT,
  selBack: (x:string) => ("?CUSTACCOUNT=" + x )
};      