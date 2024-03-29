import { GamePriceMonitor } from "./GamePriceMonitor";

export class Game { 
    //Fields 
    gameID: string;
    userID?: string;
    gameName?: string;
    yearReleased?: number;
    genre?: string;
    console?: string;
    developer?: string;
    cover?: string;
    collectionID?: string;
    priceMonitorData?: GamePriceMonitor[];
    
    //Constructor 
    constructor(gameID: string, userID?: string, gameName?:string, yearReleased?:number, genre?:string, console?:string, developer?:string, cover?:string, collectionID?:string, priceMonitorData?: GamePriceMonitor[]) { 
       this.gameID = gameID
       this.userID = userID   
       this.gameName = gameName
       this.yearReleased = yearReleased
       this.genre = genre
       this.console = console
       this.developer = developer
       this.cover = cover
       this.collectionID = collectionID
       this.priceMonitorData = priceMonitorData
    }    
 }