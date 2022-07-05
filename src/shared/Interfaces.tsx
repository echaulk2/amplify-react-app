import { Game } from "../models/Game";

export interface Collection {
    data: Game[];
}

export interface IHttpResponse {
    config: object;
    data: Game | Game[] | Collection | Collection[];
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