import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import * as Tone from 'tone';
import { GameService } from '../services/game.service';

enum GameState{
  init = 0,
  cpuTurn,
  playerTurn,
  end
}

interface Button{
  id: number,
  style: {
    opacity: string
  },
  note: string
}


@Component({
  selector: 'app-simonmaster',
  templateUrl: './simonmaster.component.html',
  styleUrls: ['./simonmaster.component.scss']
})
export class SimonmasterComponent implements OnInit {
  GameState = GameState;
  sequence: number[]= [];
  playerSequence: number[]=[];
  synth: Tone.Synth = new Tone.Synth().toMaster();
  gameState: GameState = this.GameState.init;
  playerPoints: number = 0;
  result?:string;

  //Button map
  buttons: Map<string, Button> = new Map<string, Button>([
    ["red", {id: 0, style: {opacity: "0.5"}, note: 'D2'}],
    ["blue", {id: 1, style: {opacity: "0.5"}, note: 'F2'}],
    ["yellow", {id: 2, style: {opacity: "0.5"}, note: 'C2'}],
    ["green", {id: 3, style: {opacity: "0.5"}, note: 'E2'}]
  ]);

  constructor(private myservice:ServicesService, private gameservice: GameService) { }

  ngOnInit(): void {
    this.sequence = this.myservice.generateArray(); //Update this to subscribe from backend
  }

  //Returns color string from id number. Returns empty string if id is not found.
  private getColorFromId(id: number): string{
    let color = [...this.buttons].filter(([key, val]) => val.id === id).pop()?.[0];
    return (color ? color : "");
  }

  //Plays incoming sequence for player
  playSequence(){
    this.sequence.forEach((x, i) => {
      setTimeout(() => {
        this.activateButton(this.getColorFromId(x));
        console.log(x);
        if(i === this.sequence.length - 1) this.gameState = this.GameState.playerTurn;
      }, i * 500);
    });
  }

  buttonPress(color: string){
    if(this.gameState === this.GameState.playerTurn){
      this.activateButton(color);
      this.gameLogic(color);
    }
  }

  private gameLogic(color: string){
    let last = this.playerSequence.push(this.buttons.get(color)!.id) - 1;

    if(this.playerSequence.length <= this.sequence.length && this.playerSequence[last] === this.sequence[last]){
      this.playerPoints++;
    }
    else{
      this.result = "You lose!";
      this.gameState = this.GameState.init;
      this.playerSequence = [];
      this.sequence = this.myservice.generateArray();
    }

    if(this.playerSequence.length === this.sequence.length){
      this.result = "Keep it going!";
      this.sequence.push(Math.floor(Math.random() * 4));
      this.playerSequence = [];
      this.gameState = this.GameState.cpuTurn;
      setTimeout(() => this.playSequence(), 1000);
    }
  }

  //Lights up button, plays note, and activates game logic based on game state
  activateButton(color: string){
    let button = this.buttons.get(color)!;
    button.style.opacity= "1";
    this.synth.triggerAttackRelease(button.note, '8n');
    setTimeout(() => {
      button.style.opacity = "0.5";
    }, 300);
  }

  startGame(){
    this.gameState = this.GameState.cpuTurn;
    this.result = "";
    this.playSequence();
  }
}
