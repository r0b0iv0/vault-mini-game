import { SpriteDictionary } from "../helpers/types/SpriteDictionary";
import App from "./App";

class SceneManager {

    public arrangeScene(spritesObj: SpriteDictionary) {
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

    public unlockVault(spriteObj: SpriteDictionary) {
        spriteObj.door.visible = false;
        spriteObj.handle.visible = false;
        spriteObj.handleShadow.visible = false;
        spriteObj.doorOpen.visible = true;
        spriteObj.doorOpen.position.set(App.BASE_WIDTH / 2 + 1500, App.BASE_HEIGHT / 2 - 35)
        spriteObj.doorOpenShadow.visible = true;
        spriteObj.doorOpenShadow.position.set(App.BASE_WIDTH / 2 + 1575, App.BASE_HEIGHT / 2 + 50 - 35)
    }

    public restartScene(spritesObj: SpriteDictionary) {
        spritesObj.door.visible = true;
        spritesObj.doorOpen.visible = false;
        spritesObj.doorOpenShadow.visible = false;
        spritesObj.handleShadow.visible = true;
        spritesObj.handle.visible = true;

        return spritesObj
    }
}

export default new SceneManager()