import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import * as Tone from 'tone';
import { GameService } from '../services/game.service';
import { Player } from '../models/player.model';
import { textChangeRangeIsUnchanged } from 'typescript';
import { threadId } from 'worker_threads';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

enum GameState {
  init = 0,
  cpuTurn,
  playerTurn,
  end
}

interface Button {
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
  sequence: number[] = [];
  playerSequence: number[] = [];
  synth: Tone.Synth = new Tone.Synth().toMaster();
  gameState: GameState = this.GameState.init;
  playerPoints: number = 0;
  result?: string;
  playerList: Array<Player> = [];
  playerLost: boolean = false;
  round: number;
  titleMessage: string;
  subtitleMessage: string;
  gameOver: boolean;
  roundActive: boolean;

  subscriptions = new Subscription();

  //Button map
  buttons: Map<string, Button> = new Map<string, Button>([
    ["red", { id: 0, style: { opacity: "0.5" }, note: 'D2' }],
    ["blue", { id: 1, style: { opacity: "0.5" }, note: 'F2' }],
    ["yellow", { id: 2, style: { opacity: "0.5" }, note: 'C2' }],
    ["green", { id: 3, style: { opacity: "0.5" }, note: 'E2' }]
  ]);

  constructor(private gameservice: GameService, private router: Router) {
    this.round = 0;
    this.titleMessage = "Waiting for all players to join...";
    this.subtitleMessage = "Starting first round";
    this.gameOver = false;
    this.roundActive = false;
  }

  ngOnInit(): void {
    this.subscribeToEvents();
  }

  ngOnDestroy(): void {
    this.unsubscribeToEvents();
    this.gameservice.leaveGame();
  }

  //Returns color string from id number. Returns empty string if id is not found.
  private getColorFromId(id: number): string {
    let color = [...this.buttons].filter(([key, val]) => val.id === id).pop()?.[0];
    return (color ? color : "");
  }

  //Plays incoming sequence for player
  playSequence() {
    this.sequence.forEach((x, i) => {
      setTimeout(() => {
        this.activateButton(this.getColorFromId(x));
        console.log(x);
        if (i === this.sequence.length - 1) {
          this.gameState = this.GameState.playerTurn;
          this.subtitleMessage = "Player's Turn";
        }
      }, i * 500);
    });
  }

  buttonPress(color: string) {
    if (this.gameState === this.GameState.playerTurn) {
      this.activateButton(color);
      this.gameLogic(color);
    }
  }

  private gameLogic(color: string) {
    let last = this.playerSequence.push(this.buttons.get(color)!.id) - 1;

    if (this.playerSequence.length <= this.sequence.length && this.playerSequence[last] === this.sequence[last]) {
      this.playerPoints++;
    }
    else {
      this.subtitleMessage = "You Lose!"
      this.gameState = this.GameState.init;
      this.playerSequence = [];
      this.submitRound(false);
      this.playerLost = true;
      this.roundActive = false;

    }

    if (this.playerSequence.length === this.sequence.length) {
      this.subtitleMessage = "Waiting for other players to finish..."
      this.playerSequence = [];
      this.gameState = this.GameState.cpuTurn;
      this.submitRound(true);
      this.roundActive = false;
    }
  }

  //Lights up button, plays note, and activates game logic based on game state
  activateButton(color: string) {
    let button = this.buttons.get(color)!;
    button.style.opacity = "1";
    this.synth.triggerAttackRelease(button.note, '8n');
    setTimeout(() => {
      button.style.opacity = "0.5";
    }, 300);
  }

  startGame() {
    this.gameState = this.GameState.cpuTurn;
    this.result = "";
    this.playSequence();
  }

  private submitRound(survived: boolean) {
    this.gameservice.submitRound(survived);
  }

  private subscribeToEvents(): void {
    this.subscriptions.add(
      this.gameservice.gameEventChannel.subscribe(message => {
        switch (message) {
          case 'Round Start':
          case 'Round End':
          case 'Start':
            break;
          default:
            this.titleMessage = "Game Ended!"
            this.subtitleMessage = message;
            this.gameOver = true;
        }
      })
    );

    this.subscriptions.add(
      this.gameservice.gameSequenceChannel.subscribe(sequence => {
        if (this.roundActive) return;
        this.roundActive = true;
        this.round++;
        this.titleMessage = `Round ${(this.round == 0) ? 1 : this.round}`;
        if (!this.playerLost) {
          this.sequence = sequence;
          this.gameState = this.GameState.cpuTurn;
          this.subtitleMessage = "CPU's Turn";
          setTimeout(() => this.playSequence(), 5000);
        }
      })
    );

    this.subscriptions.add(
      this.gameservice.playerList.subscribe(players => {
        this.playerList = players;
      })
    );

    this.subscriptions.add(
      this.gameservice.connectedToGame.subscribe(isConnected => {
        if (isConnected) {
          this.gameservice.setReadyGameStart();
        }
      })
    );
  }

  private unsubscribeToEvents(): void {
    if(this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  public transformStatus(status: string): string {
    switch (status) {
      case 'GameReady': return 'Ready';
      case 'WonRound': return 'Won Round';
      case 'LostRound': return 'Lost Round';
      default: return status;
    }
  }

  public returnToLobby() {
    this.router.navigateByUrl('');
  }
}
