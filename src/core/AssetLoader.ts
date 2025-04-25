import { Assets, Container, Sprite } from "pixi.js";
import App   from "./App";
import { SpriteDictionary } from "../helpers/types/SpriteDictionaty";


class AssetLoader {

    private async loadedTextures() {
        const assetFiles = import.meta.glob("/public/images/*.png");
        const texturePaths = Object.keys(assetFiles);
        const allTexturesPromises = texturePaths.map((path) => Assets.load(path))

        try {
            const loadedTextures = await Promise.all(allTexturesPromises);
            console.log("Textures loaded:", loadedTextures);
            return loadedTextures
        } catch (e) {
            console.error("Texture loading failed:", e);
            throw e;
        }
    }

    private baseEditSprites(spritesObj: SpriteDictionary) {
        spritesObj.door.anchor.set(0.46, 0.5)

        spritesObj.doorOpen.anchor.set(0.46, 0.5)
        spritesObj.doorOpen.zIndex = 1;
        spritesObj.doorOpen.visible = false;

        spritesObj.doorOpenShadow.visible = false;
        spritesObj.doorOpenShadow.anchor.set(0.46, 0.5)

        spritesObj.handleShadow.anchor.set(0.46, 0.46)
        // spritesObj.handleShadow.visible = false;

        spritesObj.handle.zIndex = 1;
        spritesObj.handle.eventMode = 'static';

        return spritesObj
        
    }

    async createSprites(container: Container) {
        let sprites: SpriteDictionary = {};

        (await this.loadedTextures()).forEach((texture) => {
            const fileName: string = texture.textureCacheIds[0].split('/')[3]
            const spriteName = fileName.slice(0, fileName.length - 4)
            const sprite = new Sprite(texture)
            sprites[spriteName] = sprite
            container.addChild(sprite)
            sprite.anchor.set(0.5)
            sprite.position.set(App.BASE_WIDTH / 2, App.BASE_HEIGHT / 2)
        })

        return this.baseEditSprites(sprites)
    }
}

export default new AssetLoader();