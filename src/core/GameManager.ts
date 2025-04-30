import gsap from "gsap";
import { Container, DEG_TO_RAD, Ticker } from "pixi.js";
import { SpriteDictionary } from "../helpers/types/SpriteDictionary";
import App from "./App";
import { generateCombination } from "../helpers/generateCombination";
import { shinyVault } from "../animations/shinyVault";
import { sound } from "@pixi/sound"
import assetLoader from "./AssetLoader"
import { after } from "../utils/misc";
import { Stopwatch } from "./Stopwatch";

export default class GameManager {

    private spriteObj: SpriteDictionary = {}
    private stopwatch: Stopwatch

    private currentCombination: Combination[] = [];
    private isResetting: boolean = false;
    private isUnlocked: boolean = false;
    private currentRotation: number = 0;
    private currentStep: number = 0;
    private enteredCombination: Combination[] = []
    private gameContainer: Container;

    constructor(gameContainer: Container, ticker: Ticker) {
        this.gameContainer = gameContainer
        this.stopwatch = new Stopwatch(ticker, App.BASE_WIDTH / 2 - 1175, App.BASE_HEIGHT / 2 - 150)
    }

    public async start() {

        this.spriteObj = await assetLoader.createSprites(this.gameContainer)
        this.gameContainer.addChild(this.stopwatch.display)
        this.stopwatch.start()
        this.currentCombination = generateCombination(3)

        this.spriteObj.handle.on('click', (e) => {

            const clickX = e.global.x;
            const handleCenterX = this.spriteObj.handle.getGlobalPosition().x;

            const direction = clickX > handleCenterX ? 'clockwise' : 'counterclockwise';
            this.rotateHandle(direction)
        })
    }

    public rotateHandle(direction: 'clockwise' | 'counterclockwise') {
        const degrees = direction === 'clockwise' ? 60 : -60;

        sound.play("lever")

        gsap.to([this.spriteObj.handle, this.spriteObj.handleShadow], {
            rotation: this.spriteObj.handle.rotation + DEG_TO_RAD * degrees,
            duration: 0.2,
            onComplete: () => {
                this.handleRotationComplete(direction);

            }
        });
    }

    private handleRotationComplete(direction: 'clockwise' | 'counterclockwise') {
        if (this.isResetting || this.isUnlocked) return;

        this.currentRotation += 1;

        const currentPair = this.currentCombination[this.currentStep];
        if (this.currentRotation === currentPair.number && direction === currentPair.direction) {

            this.enteredCombination.push({
                number: this.currentRotation,
                direction
            });

            this.currentStep += 1;
            this.currentRotation = 0;

            if (this.currentStep === 3) {
                this.unlockVault()
            }
        } else if (this.currentRotation > currentPair.number ||
            direction !== currentPair.direction) {
            this.resetGame();
        }
    }

    private resetGame() {
        if (this.isResetting) return;

        this.isResetting = true;
        this.enteredCombination = [];
        this.currentStep = 0;
        this.currentRotation = 0;

        const spinDirection = Math.random() > 0.5 ? 1 : -1;
        const spinRotation = spinDirection * 10 * Math.PI * 2;

        this.spriteObj.handle.eventMode = 'passive';

        gsap.to([this.spriteObj.handle, this.spriteObj.handleShadow], {
            rotation: this.spriteObj.handle.rotation + spinRotation,
            duration: 1,
            ease: 'power3.out',
            onComplete: () => {
                this.isResetting = false;
                this.stopwatch.reset()
                this.currentCombination = generateCombination(3);
                this.spriteObj.handle.eventMode = 'static';

            }
        });

    }

    private async unlockVault() {
        this.spriteObj.door.visible = false;
        this.spriteObj.handle.visible = false;
        this.spriteObj.handleShadow.visible = false;
        this.spriteObj.doorOpen.visible = true;
        this.spriteObj.doorOpen.position.set(App.BASE_WIDTH / 2 + 1500, App.BASE_HEIGHT / 2 - 35)
        this.spriteObj.doorOpenShadow.visible = true;
        this.spriteObj.doorOpenShadow.position.set(App.BASE_WIDTH / 2 + 1575, App.BASE_HEIGHT / 2 + 50 - 35)
        sound.play("door")
        shinyVault([this.spriteObj.blink, this.spriteObj.blink2, this.spriteObj.blink3])
        sound.play("shiny")
        this.stopwatch.stop()
        await after(5, () => {
            assetLoader.baseEditSprites(this.spriteObj)
            sound.play("door")
            this.resetGame()
        })

    }
}
