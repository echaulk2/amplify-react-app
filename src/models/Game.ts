export class Game { 
    //Fields 
    gameID?: string;
    userID?: string;
    gameName?: string;
    yearReleased?: number;
    genre?: string;
    console?: string;
    developer?: string;    
    collectionID?: string;

    //Constructor 
    constructor(gameID?: string, userID?: string, gameName?:string, yearReleased?:number, genre?:string, console?:string, developer?:string, collectionID?:string) { 
       this.gameID = gameID
       this.userID = userID   
       this.gameName = gameName
       this.yearReleased = yearReleased
       this.genre = genre
       this.console = console
       this.developer = developer   
       this.collectionID = collectionID
    }    
 }