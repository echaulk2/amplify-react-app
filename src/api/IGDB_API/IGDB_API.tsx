import axios from "axios";
import * as Interfaces from "../../shared/Interfaces";

export class IGDB_API {
    user: Interfaces.CognitoUserAmplify;
    game: string;
    platform: string;
    userToken: string | undefined;
    private error: string;

    constructor(user: Interfaces.CognitoUserAmplify, game:string, platform:string) {
      this.user = user;
      this.game = game;
      this.platform = platform;
      this.userToken = this.user.getSignInUserSession()?.getIdToken().getJwtToken();
      this.error = "";
    }    

    getGames = async (): Promise<Interfaces.GameRecord[]> => {
        let results: Interfaces.GameRecord[] = [];
        let platformData = await this.getPlatforms();

        if (!platformData.length) {
            this.error = "Unable to find platform data.";
        }

        await axios({
            url: " https://4fu7yxd9ml.execute-api.us-east-1.amazonaws.com/production/v4/games",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': this.userToken
            },
            data: `fields name, summary, id, platforms, first_release_date, genres, cover; 
                    search "${this.game}"; 
                    limit 25; 
                    where platforms = (${platformData.map((platform: Interfaces.IGDB_Platform) => { return platform.id; })});`
          })
            .then(async (response: any) => {
                if (response.data.length) {
                    let developerData = await this.getDevelopers(response.data);
                    let genreData = await this.getGenres(response.data);
                    let imageData = await this.getImages(response.data);
                    results = this.formatData(response.data, platformData, developerData, genreData, imageData);                    
                }                   
            })
            .catch((err: any) => {
                throw new Error(this.error);
        });
        return results;
    }
    
    private getPlatforms = async (): Promise<Interfaces.IGDB_Platform[]> => {
        let platformData: Interfaces.IGDB_Platform[] = [];
        
        await axios({
            url: " https://4fu7yxd9ml.execute-api.us-east-1.amazonaws.com/production/v4/platforms",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': this.userToken
            },
            data: `fields id, name; search "${this.platform}";`
          })
            .then((response: any) => {
                platformData = response.data;         
            })
            .catch((err: any) => {
                console.error(err);
                throw new Error("Error fetching Platform data.")
        });
        return platformData;
    }

    private getDevelopers = async (data: Interfaces.IGDB_Game[]): Promise<Interfaces.IGDB_Developer[]> => {
        let developerData: Interfaces.IGDB_Developer[] = [];
        
        await axios({
            url: " https://4fu7yxd9ml.execute-api.us-east-1.amazonaws.com/production/v4/companies",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': this.userToken
            },
            data: `fields id, name, developed; where developed = (${data.map((game: Interfaces.IGDB_Game) => { return game.id })});`
          })
            .then((response: any) => {
                developerData = response.data;         
            })
            .catch((err: any) => {
                console.error(err);
                throw new Error("Error fetching Game Developer data.")
        });
        return developerData;
    }

    private getGenres = async (data: Interfaces.IGDB_Game[]): Promise<Interfaces.IGDB_Genre[]> => {
        let genreData: Interfaces.IGDB_Genre[] = [];
        let genreIDs = data.map((game: Interfaces.IGDB_Game) => { return game?.genres?.[0] }).filter((element) => element !== undefined);

        await axios({
            url: " https://4fu7yxd9ml.execute-api.us-east-1.amazonaws.com/production/v4/genres",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': this.userToken
            },
            data: `fields id, name; where id = (${genreIDs});`
          })
            .then((response: any) => {
                genreData = response.data;         
            })
            .catch((err: any) => {
                console.error(err);
                throw new Error("Error fetching Genre data.")
        });
        return genreData;
    }

    private getImages = async (data: Interfaces.IGDB_Game[]): Promise<Interfaces.IGDB_Cover[]> => {
        let coverData: Interfaces.IGDB_Cover[] = [];
        let coverIDs = data.map((game: Interfaces.IGDB_Game) => { return game.cover }).filter((element) => element !== undefined);
        let query = `fields *; where id = (${coverIDs});`;

        await axios({
            url: " https://4fu7yxd9ml.execute-api.us-east-1.amazonaws.com/production/v4/covers",
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': this.userToken
            },
            data: query
          })
            .then((response: any) => {
                coverData = response.data;    
            })
            .catch((err: any) => {
                console.error(err);
                throw new Error("Error fetching Image data.")
        });
        return coverData;
    }

    // Formats IGDB Relational Data from API calls to game format
        // -  Map platform IDs to platform names, and then separate games with multiple platforms into separate records
        // -  Convert UNIX time to just the year
        // -  Map developer IDs to developer names
        // -  Map the first genre associated with the game to the genre name            
    private formatData = (data: Interfaces.IGDB_Game[], platformData: Interfaces.IGDB_Platform[], developerData: Interfaces.IGDB_Developer[], genreData: Interfaces.IGDB_Genre[],
        imageData: Interfaces.IGDB_Cover[]): Interfaces.GameRecord[] => {
        let results = data.map((element:Interfaces.IGDB_Game): Interfaces.GameRecord => {
            let platformNames: string[] = [];
            element.platforms.forEach((platformID: number) => {
                    let name = platformData.filter((item: Interfaces.IGDB_Platform) => {
                    return item.id == platformID;
                });
                name[0] && platformNames.push(name[0]?.name);
            });                        
            
            return {
                gameID: element.id.toString(),
                gameName: element.name, 
                yearReleased: new Date(element.first_release_date * 1000).getFullYear() || undefined, 
                console: (platformNames.length == 1) ? platformNames[0] : undefined,
                platforms: platformNames || undefined,
                developer: developerData.find((developer: Interfaces.IGDB_Developer) => developer.developed.find((id: number) => id == element.id))?.name || undefined, 
                genre: genreData.find((genre: Interfaces.IGDB_Genre) => genre.id == element?.genres?.[0])?.name || undefined,
                summary: element.summary || undefined,
                cover: imageData.find((image: Interfaces.IGDB_Cover) => image.id == element.cover)?.url || undefined
            } as Interfaces.GameRecord
        });

        //Separate games with multiple platforms into separate records
        let gamesWithMultiplePlatforms = results.filter((game: Interfaces.GameRecord) => {
            return game.platforms && game.platforms.length > 1;
        });

        gamesWithMultiplePlatforms.forEach((game: Interfaces.GameRecord) => {
            let index = results.findIndex((object: Interfaces.GameRecord) => object.gameID == game.gameID );
            
            results = results.filter((oldGame: Interfaces.GameRecord) => { return game.gameID != oldGame.gameID });

            game.platforms && game.platforms.forEach((platform: any) => {
                results.splice(index, 0, {...game, gameID: `${game.gameID}-${platform}`, console: platform });
                index++;
            });
        });

        return results;
    }
}