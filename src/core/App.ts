import { Application, Container } from "pixi.js";
import * as PIXI from "pixi.js"
import gsap from "gsap";
import PixiPlugin from "gsap/PixiPlugin";
import assetLoader from "./AssetLoader"
import { SpriteDictionary } from "../helpers/types/SpriteDictionaty";
import GameManager from "./GameManager";

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI(PIXI)

export default class App extends Application {

  public static readonly BASE_WIDTH = 6000;
  public static readonly BASE_HEIGHT = 3000;

  spritesObj : SpriteDictionary = {}

  private gameContainer = new Container();


  constructor() {
    super({
      view: document.querySelector("#app") as HTMLCanvasElement,
      autoDensity: true,
      resizeTo: window,
      powerPreference: "high-performance",
      backgroundColor: 0x23272a,
    });
    this.stage.addChild(this.gameContainer)
  }

  async begin() {

    this.gameContainer.sortableChildren = true;
    this.spritesObj = await assetLoader.createSprites(this.gameContainer)

    this.onResize()
    
    new GameManager(this.spritesObj).start()

    window.addEventListener("resize", this.onResize.bind(this));

  }

  private onResize = () => {

    const scale = Math.min(
      window.innerWidth / App.BASE_WIDTH,
      window.innerHeight / App.BASE_HEIGHT
    );

    this.gameContainer.scale.set(scale)

    this.gameContainer.x = (window.innerWidth - App.BASE_WIDTH * scale) / 2;
    this.gameContainer.y = (window.innerHeight - App.BASE_HEIGHT * scale) / 2;

  }
}
