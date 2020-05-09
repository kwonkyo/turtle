class IGameStatus {
    status: string;
}

class GameStatus implements IGameStatus {
    constructor(public status: string) {
        this.status = status
    }

    static CONTINUE = new GameStatus('continue');
    static ERROR = new GameStatus('error');
    static END = new GameStatus('end');
}


export {
    IGameStatus,
    GameStatus
}