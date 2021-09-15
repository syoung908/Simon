import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import * as Tone from 'tone';
import { GameService } from '../services/game.service';
//import { clearInterval } from 'timers';

@Component({
  selector: 'app-simonmaster',
  templateUrl: './simonmaster.component.html',
  styleUrls: ['./simonmaster.component.scss']
})
export class SimonmasterComponent implements OnInit {
  sequence: number[]= [];
  playerSequence:number[]=[];

  color: {[name: string]: number} = {"red": 1, "blue":2, "yellow":3, "green":4}
  style_red = {opacity:"0.5"}
  style_blue = {opacity:"0.5"}
  style_green = {opacity:"0.5"}
  style_yellow = {opacity:"0.5"}
  notes: string[]=[];
  synth: any;  
  gameState:string = "";

  
  
  constructor(private myservice:ServicesService, private gameservice: GameService) { }

  ngOnInit(): void {
    this.sequence = this.myservice.generateArray();
    this.synth = new Tone.Synth().toMaster();
    this.notes = ['C2', 'D2', 'E2', 'F2'];
    this.gameState = "inactive"
  }

  play(){
    this.sequence.forEach(x => {
      let timer = setInterval(() => {
        if( x == 1) this.activateButton("red");
        else if( x == 2) this.activateButton("blue");
        else if( x == 3) this.activateButton("yellow");
        else if( x == 4) this.activateButton("green");
        clearInterval(timer);
      },x* 500)
    })
  }

  activateButton(color: string){
    if(color == "yellow"){
      setTimeout(() => {
        this.style_yellow = {opacity: "0.5"};
      }, 500)
      this.style_yellow = {opacity: "1"};
      this.playNote('D2');
    }
    else if(color == "green"){
      setTimeout(() => {
        this.style_green = {opacity: "0.5"};
      }, 500)
      this.style_green = {opacity: "1"};
      this.playNote('F2');
    }
    else if(color == "red"){
      setTimeout(() => {
        this.style_red = {opacity: "0.5"};
      }, 500)
      this.style_red = {opacity: "1"};
      this.playNote('C2');
    }
    else if(color == "blue"){
      setTimeout(() => {
        this.style_blue = {opacity: "0.5"};
      }, 500)
      this.style_blue = {opacity: "1"};
      this.playNote('E2');
    }

    if(this.gameState=="playerTurn") this.playerSequence.push(this.color[color])
  }

 
  playNote(note: string) {
    this.synth.triggerAttackRelease(note, '8n');
  }



}
