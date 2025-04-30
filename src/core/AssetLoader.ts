import { Assets, Container, Sprite } from "pixi.js";
import App from "./App";
import { SpriteDictionary } from "../helpers/types/SpriteDictionary";
import { sound } from "@pixi/sound";
import sceneManager from "./SceneManager";


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

        return sceneManager.arrangeScene(sprites)
    }

    private loadSounds() {
        sound.add("lever", "../../public/sounds/lever.mp3")
        sound.add("door", "../../public/sounds/door.mp3")
        sound.add("shiny", "../../public/sounds/shiny.mp3")
    }
}

export default new AssetLoader();