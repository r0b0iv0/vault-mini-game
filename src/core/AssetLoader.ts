import { Assets, Container, Sprite } from "pixi.js";
import App from "./App";
import { SpriteDictionary } from "../helpers/types/SpriteDictionaty";
import { sound } from "@pixi/sound";


class AssetLoader {

    private async loadedTextures() {
        const assetFiles = import.meta.glob("/public/images/*.png");
        const texturePaths = Object.keys(assetFiles);
        const allTexturesPromises = texturePaths.map((path) => Assets.load(path))

        this.loadSounds()
        
        try {
            const loadedTextures = await Promise.all(allTexturesPromises);
            console.log("Textures loaded:", loadedTextures);
            return loadedTextures
        } catch (e) {
            console.error("Texture loading failed:", e);
            throw e;
        }
    }

    public baseEditSprites(spritesObj: SpriteDictionary) {
        spritesObj.door.anchor.set(0.5)
        spritesObj.door.position.set(App.BASE_WIDTH / 2 + 75, App.BASE_HEIGHT / 2 - 30)
        spritesObj.door.visible = true;

        spritesObj.doorOpen.anchor.set(0.5)
        spritesObj.doorOpen.zIndex = 1;
        spritesObj.doorOpen.visible = false;

        spritesObj.doorOpenShadow.visible = false;
        spritesObj.doorOpenShadow.anchor.set(0.5)

        spritesObj.handleShadow.anchor.set(0.5)
        spritesObj.handleShadow.position.set(App.BASE_WIDTH / 2, App.BASE_HEIGHT / 2)
        spritesObj.handleShadow.visible = true;

        spritesObj.handle.zIndex = 1;
        spritesObj.handle.position.set(App.BASE_WIDTH / 2 - 20, App.BASE_HEIGHT / 2 - 25)
        spritesObj.handle.eventMode = 'static';
        spritesObj.handle.visible = true;

        spritesObj.blink.position.set(App.BASE_WIDTH / 2 - 50, App.BASE_HEIGHT / 2 + 100)
        spritesObj.blink2.position.set(App.BASE_WIDTH / 2 + 300, App.BASE_HEIGHT / 2 + 200)
        spritesObj.blink3.position.set(App.BASE_WIDTH / 2 - 400, App.BASE_HEIGHT / 2 - 100)

        return spritesObj
        
    }

    async createSprites(container: Container) {
        let sprites: SpriteDictionary = {};

        (await this.loadedTextures()).forEach((texture) => {
            const fileName: string = texture.textureCacheIds[0].split('/')[3]
            const spriteName = fileName.slice(0, fileName.length - 4)
            const sprite = new Sprite(texture)

            if (spriteName == 'blink') sprites['blink2'] = new Sprite(texture), sprites['blink3'] = new Sprite(texture)

            sprites[spriteName] = sprite

        })

        for (const key in sprites) {
            sprites[key].anchor.set(0.5)
            sprites[key].position.set(App.BASE_WIDTH / 2, App.BASE_HEIGHT / 2)
            container.addChild(sprites[key])
        }

        return this.baseEditSprites(sprites)
    }

    private loadSounds() {
        sound.add("lever", "../../public/sounds/lever.mp3")
        sound.add("door", "../../public/sounds/door.mp3")
        sound.add("shiny", "../../public/sounds/shiny.mp3")
    }
}

export default new AssetLoader();