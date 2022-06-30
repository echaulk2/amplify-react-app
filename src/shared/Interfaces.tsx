import { Game } from "../models/Game";

export interface Collection {
    data: Game[];
}

export interface IHttpResponse {
    config: object;
    data: Game;
    headers: object;
    request: XMLHttpRequest;
    status: number;
    statusTest: string;
}