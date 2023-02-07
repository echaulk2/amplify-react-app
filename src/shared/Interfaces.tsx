import { Game } from "../models/Game";
import { GamePriceMonitor } from "../models/GamePriceMonitor";
import { CognitoUser } from 'amazon-cognito-identity-js';

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

export interface EditableGameCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Game;
    index: number;
    children: React.ReactNode;
}

export interface EditablePriceMonitorCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: GamePriceMonitor;
    index: number;
    children: React.ReactNode;
}

export interface IGDB_Game {
    name: string;
    id: number;
    genres: number[];
    first_release_date: number;
    platforms: number[];
    summary: string;
    storyline: string;  
    developer: string;  
    cover: number;
}

export interface GameRecord {
    gameID: string;
    gameName: string;
    platforms?: string[]
    console?: string;
    genre?: string;
    developer?: string;
    summary?: string;
    yearReleased?: number;
    cover?: string;    
}

export interface IGDB_Platform {
    id: number;
    name: string;
}

export interface IGDB_Developer {
    id: number;
    name: string;
    developed: number[];
}

export interface IGDB_Genre {
    id: number;
    name: string;
}

export interface IGDB_Cover {
    id: number;
    url: string;
}

export interface searchGameProps {
    setCreatingGame: (game: React.SetStateAction<Game>) => void;
    isCreating: boolean;
    initializeCreateGame: () => void;
    handleCreateGame: (game: Game) => Promise<void>;
    resetCreateGame: () => void;
    creatingGame: Game;
}

/** Known cognito user attributes */
export interface CognitoAttributes {
    email: string;
    phone_number: string;
    [key: string]: string;
}

/** Cognito User Interface */
export interface CognitoUserAmplify extends CognitoUser {
    username?: string;
    attributes?: CognitoAttributes;
}