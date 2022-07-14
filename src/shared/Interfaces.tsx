import { Game } from "../models/Game";
import { GamePriceMonitor } from "../models/GamePriceMonitor";

export interface Collection {
    data: Game[];
}

export interface IHttpResponse {
    config: object;
    data: Game | Game[] | Collection | Collection[] | GamePriceMonitor | GamePriceMonitor[];
    headers: object;
    request: XMLHttpRequest;
    status: number;
    statusTest: string;
}

export interface IModifyGameInputFields {
    gameID: string;
    userID: string;
    gameName: string;
    yearReleased: number;
    genre: string;
    console: string;
    developer: string;    
    collectionID: string;
}

export interface IModifyPriceMonitorInputFields {
    desiredPrice: string;
    desiredCondition: string;
}