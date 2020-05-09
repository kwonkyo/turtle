import { IGameState, Tile2DGameState } from './GameState.js';


interface IRenderer<T extends IGameState> {
    render(state: T): void;
}

class Tile2DRenderer implements IRenderer<Tile2DGameState> {
    private buffer: CanvasRenderingContext2D;
    private tiles: Record<number, ITile2DRenderable>

    constructor(
        private context: CanvasRenderingContext2D,
        tiles: Record<number, Record<string, string>>,
        private tileSize: number,
        private cameraViewFieldLength: number
    ) {
        this.buffer = document
            .createElement('canvas')
            .getContext('2d');
        this.context = context;
        
        this.tiles = Object.keys(tiles)
            .map(k => [parseInt(k), new Tile2DRectangle(
                tiles[k]['name'], tiles[k]['color'])]
            )
            .reduce((z, x) => {
                z[(<[number, Tile2DRectangle]> x)[0]] = x[1]

                return z;
            }, {});
        this.tileSize = tileSize;
        this.cameraViewFieldLength = cameraViewFieldLength;
    }

    render(state: Tile2DGameState): void {
        this.initBuffer(state);
        this.renderMap(state);
        this.drawCanvas();
    }

    private initBuffer(state: Tile2DGameState) {
        this.buffer.canvas.height = this.tileSize * state.heightInTiles;
        this.buffer.canvas.width = this.tileSize * state.widthInTiles;

        this.buffer.clearRect(
            0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    }

    private renderMap(state: Tile2DGameState): void {
        let [xLimitLeft, xLimitRight] = this.getCameraFieldOfView(
            state.cameraPosition, state.widthInTiles);

        for (let i = 0; i < state.map.length; i++) {
            let [xPixelInWorld, yPixelInWorld] = (
                this.getPositionInWorld(i, state.widthInTiles)
            );

            if (!this.isTileInXBound(xPixelInWorld, xLimitLeft, xLimitRight)) {
                continue;
            }

            let [xCutLeft, xCutRight] = this.getTileCutLines(
                xPixelInWorld, xLimitLeft, xLimitRight);
            
            let [xPixelInCanvas, yPixelInCanvas] = (
                this.offsetTileByCameraViewField(
                    xPixelInWorld, yPixelInWorld, state.cameraPosition)
            );

            let tile = this.getTileAt(state.map, i);
            tile.draw(
                this.buffer, xPixelInCanvas, yPixelInCanvas,
                this.tileSize, this.tileSize, xCutLeft, xCutRight);
        }
    }

    private getCameraFieldOfView(cameraPosition, widthInTiles) {
        let xLimitLeft = Math.min(
            Math.max(
                0, cameraPosition.x - this.cameraViewFieldLength),
            widthInTiles * this.tileSize - this.cameraViewFieldLength);
        let xLimitRight = Math.max(
            this.cameraViewFieldLength, Math.min(
                widthInTiles * this.tileSize,
                cameraPosition.x + this.cameraViewFieldLength));

        return [xLimitLeft, xLimitRight];
    }

    private getPositionInWorld(mapIndex, widthInTiles) {
        let xPixelInWorld = (mapIndex % widthInTiles) * this.tileSize;
        let yPixelInWorld = Math.floor(mapIndex / widthInTiles) * this.tileSize;

        return [xPixelInWorld, yPixelInWorld];
    }

    private isTileInXBound(xPixelInWorld, xLimitLeft, xLimitRight) {
        return xPixelInWorld >= xLimitLeft && xPixelInWorld + this.tileSize <= xLimitRight;
    }

    private getTileCutLines(xPixelInWorld, xLimitLeft, xLimitRight) {
        let xCutLeft = xPixelInWorld < xLimitLeft ? Math.abs(xPixelInWorld - xLimitLeft) : 0;
        let xCutRight = xPixelInWorld > xLimitRight ? this.tileSize - Math.abs(xPixelInWorld - xLimitRight) : 0;

        return [xCutLeft, xCutRight];
    }

    private getTileAt(map, mapIndex) {
        let tileIndex = map[mapIndex];
        let tile = this.tiles[tileIndex];

        return tile;
    }

    private offsetTileByCameraViewField(x, y, cameraPosition) {
        return [
            x - (cameraPosition.x - this.cameraViewFieldLength), y];
    }

    private drawCanvas() {
        this.context.clearRect(
            0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.drawImage(
            this.buffer.canvas,
            0, 0, this.buffer.canvas.width, this.buffer.canvas.height,
            0, 0, this.context.canvas.width, this.context.canvas.height);
    }
}


interface ITile2DRenderable {
    draw(
        canvas: CanvasRenderingContext2D, x: number, y: number,
        width: number, height: number, xCutLeft: number, xCutRight: number);
}


class Tile2DRectangle implements ITile2DRenderable {
    constructor(
            private name: string,
            private color: string) {
        this.name = name;
        this.color = color;
    }

    draw(canvas: CanvasRenderingContext2D, x: number, y: number,
         width: number, height: number, xCutLeft: number, xCutRight: number) {
        canvas.fillStyle = this.color;
        canvas.fillRect(x + xCutLeft, y, width - (xCutLeft + xCutRight), height);
    }
}


export {
    IRenderer,
    Tile2DRenderer
}