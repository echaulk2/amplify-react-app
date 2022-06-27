export interface Game {
    collectionID: string;
    console: string;
    developer: string;
    gameID: string;
    gameName: string;
    genre: string;
    userID: string;
    yearReleased: number;
}

export interface GameProps {
    game: Game;
}
export interface Collection {
    data: Game[];
}