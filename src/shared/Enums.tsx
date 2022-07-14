export enum GameMap {
    gameName = "Game Name",
    yearReleased = "Year Released",
    genre = "Genre",
    developer = "Developer",
    console = "Console"
}

export enum GamePriceDataMap {
    desiredPrce = "Desired Price",
    desiredPriceExists = "Desired Price Exists",
    lastChecked = "Last Checked",
    lowestPrice = "Lowest Price",
    averagePrice = "Average Price",
    listedItemTitle = "Title",
    listedItemURL = "Link",
    listedItemConsole = "Console"
}

export enum Game {
    gameName = "Game Name",
    yearReleased = "Year Released",
    genre = "Genre",
    console = "Console",
    developer = "Developer",
}

export enum GamePriceMonitor {
    priceMonitorID = "Price Monitor ID",
    gameID = "Game ID",
    userID = "User ID",
    desiredPrice = "Desired Price",
    desiredCondition = "Desired Condition"
}

export enum ExcludedModifyKeys {
    gameID,
    userID,
    collectionID,
    priceMonitorData
}

export enum ExcludedGamePriceMonitorKeys {
    priceMonitorID,
    userID,
    gameID,
    collectionID,
    gamePriceData
}

export enum ExcludeGamePriceData {
    gamePriceDataID,
    priceMonitorID
}