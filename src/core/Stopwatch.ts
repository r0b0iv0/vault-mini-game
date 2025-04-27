import {Text, Ticker, } from 'pixi.js';

export class Stopwatch {
    public display: Text;
    private elapsedSeconds: number = 0;
    private startTime: number = 0;
    private isRunning: boolean = false;
    private ticker: Ticker;

    constructor(ticker: Ticker, x: number = 0, y: number = 0) {
        this.ticker = ticker;
        
        this.display = new Text('00:00', {
            fontFamily: 'Arial',
            fontSize: 70,
            fill: 0xffffff,
            align: 'center'
        });
        
        this.display.anchor.set(0.5);
        this.display.position.set(x, y);
    }

    start(){
        if (this.isRunning) return;
        
        this.startTime = performance.now() - (this.elapsedSeconds * 1000);
        this.isRunning = true;
        this.ticker.add(this.update, this);
    }

    stop(){
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.ticker.remove(this.update, this);
    }

    reset(){
        this.stop();
        this.elapsedSeconds = 0;
        this.display.text = '00:00';
        this.start()
    }

    private update(): void {
        const currentTime = performance.now();
        this.elapsedSeconds = Math.floor((currentTime - this.startTime) / 1000);
        
        const minutes = Math.floor(this.elapsedSeconds / 60).toString().padStart(2, '0');
        const seconds = (this.elapsedSeconds % 60).toString().padStart(2, '0');
        
        this.display.text = `${minutes}:${seconds}`;
    }
}