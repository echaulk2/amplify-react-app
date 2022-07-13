import { GamePriceData } from "./GamePriceData";

export class GamePriceMonitor {
    priceMonitorID?: string;
    userID?: string;
    collectionID?: string;
    gameID?: string;
    desiredPrice?: number;
    desiredCondition?: string;
    gamePriceData?: GamePriceData;

    constructor(priceMonitorID?:string, userID?:string, collectionID?:string, gameID?: string, desiredPrice?:number, desiredCondition?: string, gamePriceData?: GamePriceData) {
        this.priceMonitorID = priceMonitorID
        this.userID = userID
        this.collectionID = collectionID
        this.gameID = gameID
        this.desiredPrice = desiredPrice
        this.desiredCondition = desiredCondition
        this.gamePriceData = gamePriceData
    }
}