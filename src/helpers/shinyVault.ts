import gsap from "gsap";
import { Sprite } from "pixi.js";

export function shinyVault(star: Sprite) {
    gsap.fromTo(star,
        { pixi: { alpha: 0, rotation: 0, scale: 0.5 } },
        {
            pixi: { alpha: 0.8, rotation: Math.PI * 2, scale: 1.2 },
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        }
    );
}