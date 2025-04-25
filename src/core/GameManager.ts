import gsap from "gsap";
import { DEG_TO_RAD } from "pixi.js";
import { SpriteDictionary } from "../helpers/types/SpriteDictionaty";
import App from "./App";
import { generateCombination } from "../helpers/generateCombination";

export default class GameManager {

    private spriteObj: SpriteDictionary

    private currentCombination: Combination[] = [];
    private isResetting: any;
    private isUnlocked: any;
    private currentRotation: number = 0;
    private currentStep: number = 0;
    private enteredCombination: Combination[] = []

    constructor(spriteObj: SpriteDictionary) {
        this.spriteObj = spriteObj
    }

    public start() {
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

        gsap.to(this.spriteObj.handle, {

            rotation: this.spriteObj.handle.rotation + DEG_TO_RAD * degrees,
            duration: 0.2,
            ease: 'power1.out',
            onComplete: () => {
                this.handleRotationComplete(direction);

            }
        });
        //   gsap.to(this.handleShadow, {
        //     rotation: this.handle.rotation + DEG_TO_RAD * degrees,
        //     duration: 0.2,
        //     ease: 'power1.out',
        //     // onComplete: () => {
        //     //     this.handleRotationComplete(direction);
        //     // }
        // });
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
                // unlock
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


        gsap.to(this.spriteObj.handle, {
            rotation: this.spriteObj.handle.rotation + spinRotation,
            duration: 1,
            ease: 'power3.out',
            onComplete: () => {
                this.isResetting = false;
                this.currentCombination = generateCombination(3);
                this.spriteObj.handle.eventMode = 'static';
            }
        });

    }
}
