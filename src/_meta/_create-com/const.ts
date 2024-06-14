import { EnumSelectType } from "./editors"

export interface Data {
    enbaleDymimic: boolean,
    comDef: {
        namespace: string,
        data: string,
    },
    enbalePlace: boolean,
    placeType: EnumSelectType
    targetSceneDef: any
    targetComDef: any
    targetSlotId: string
}