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