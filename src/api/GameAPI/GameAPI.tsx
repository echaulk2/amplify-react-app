import { API } from "aws-amplify";
import { Game } from "../../models/Game";
import * as Interfaces from "../../shared/Interfaces";

export class GameAPI {
  user: Interfaces.CognitoUserAmplify;
  userToken: string | undefined;
  gameID?: string;
  collectionID?: string;
  game?: Game;
  
  constructor(user: Interfaces.CognitoUserAmplify, gameID?:string, collectionID?: string, game?: Game) {
    this.user = user;    
    this.gameID = gameID;
    this.userToken = this.user.getSignInUserSession()?.getIdToken().getJwtToken();
    this.collectionID = collectionID;
    this.game = game;
  }

  handleGetGame = async(): Promise<Game> => {
    let data: Game = {} as Game;
    let apiName = 'GameAPI';
    let path = '/getGame'; 
    let init = {
        headers: {
          'Authorization': this.userToken
        },
        response: true,
        queryStringParameters: {  
            gameID: this.gameID
        }        
    };

    await API
      .get(apiName, path, init)
      .then((response: any) => {
        if (response.data) {
            data = response.data;
        }
      })
      .catch((error: any) => {
        console.log(error);
    });
    return data;
  }

  handleGetCollection = async() => {
    let collection: Game[] = [];
    let apiName = 'GameAPI';
    let path = "";
    let init = {};
    if (this.collectionID) {
      path = '/collection/wishlist/'; 
      init = {
          headers: {
            'Authorization': this.userToken
          },
          response: true,
          queryStringParameters: {
            collectionID: this.collectionID
          }
      }
    } else {
      path = '/listGames'; 
      init = {
        headers: {
          'Authorization': this.userToken
        },
      response: true
      }
    }    

    await API
      .get(apiName, path, init)
      .then(response => {
        if (response.data) {
          collection = response.data;
        }
      })
      .catch(error => {
        console.log(error.response);
    });
    return collection;    
  }

}