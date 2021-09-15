import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import * as Tone from 'tone';

enum GameState{
  init,
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
  sequence: number[]= [];
  playerSequence:number[]=[];
  synth: Tone.Synth = new Tone.Synth().toMaster();
  gameState:GameState = GameState.init;
  playerPoints: number = 0;

  //Button map
  buttons: Map<string, Button> = new Map<string, Button>([
<<<<<<< HEAD
    ["red", {id: 0, style: {opacity: "0.5"}, note: 'D2'}],
    ["blue", {id: 1, style: {opacity: "0.5"}, note: 'F2'}],
    ["yellow", {id: 2, style: {opacity: "0.5"}, note: 'C2'}],
    ["green", {id: 3, style: {opacity: "0.5"}, note: 'E2'}]
=======
    ["red", {id: 1, style: {opacity: "0.5"}, note: 'D2'}],
    ["blue", {id: 2, style: {opacity: "0.5"}, note: 'F2'}],
    ["yellow", {id: 3, style: {opacity: "0.5"}, note: 'C2'}],
    ["green", {id: 4, style: {opacity: "0.5"}, note: 'E2'}]
>>>>>>> cfdd08e24d10988e3767a85b3b8095db669beea0
  ]);

  constructor(private myservice:ServicesService) { }

  ngOnInit(): void {
    this.sequence = this.myservice.generateArray(); //Update this to subscribe from backend
  }

<<<<<<< HEAD
  //Returns color string from id number. Will return empty string if no matching id is found in map
  private getColorFromId(id: number): string{
    let color = [...this.buttons].filter(([key, val]) => val.id === id).pop()?.[0]
    return (color ? color : "");
=======
  private getColorFromId(id: number): string | undefined{
    return [...this.buttons].filter(([key, val]) => val.id === id).pop()?.[0];
>>>>>>> cfdd08e24d10988e3767a85b3b8095db669beea0
  }

  //Plays incoming sequence for player
  playSequence(){
    this.sequence.forEach(x => {
      setTimeout(() => {
<<<<<<< HEAD
        this.activateButton(this.getColorFromId(x));
=======
        this.activateButton(this.getColorFromId(x)!);
>>>>>>> cfdd08e24d10988e3767a85b3b8095db669beea0
      }, x * 500)
    })
  }

  //Lights up button, plays note, and activates game logic based on game state
  activateButton(color: string){
    let button = this.buttons.get(color)!;
    button.style.opacity= "1";
    this.synth.triggerAttackRelease(button.note, '8n');
    setTimeout(() => {
      button.style.opacity = "0.5";
    }, 500)
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> cfdd08e24d10988e3767a85b3b8095db669beea0
