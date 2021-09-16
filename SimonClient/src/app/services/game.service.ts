import { Injectable, EventEmitter } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private hubConnection: HubConnection;
  public connectionEstablished = new BehaviorSubject<boolean>(false);
  public connectedToGame = new BehaviorSubject<boolean>(false);
  public playerList = new BehaviorSubject<Array<Player>>([]);
  public gameEventChannel = new EventEmitter<string>();
  public gameSequenceChannel = new EventEmitter<Array<number>>();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.api.url}/game`)
      .withAutomaticReconnect()
      .build();

    this.startConnection();
    this.registerOnServerEvents();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Hub connection started');
        this.connectionEstablished.next(true);
        this.joinGame();
      })
      .catch(_ => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(() => this.startConnection(), 5000);
      });
    this.hubConnection.onreconnecting(() => {
      this.connectionEstablished.next(false);
    });
    this.hubConnection.onreconnected(() => {
      this.connectionEstablished.next(true);
    })
  }

  public joinGame(): void {
    this.hubConnection.invoke('JoinGame', "testname")
      .then(() => {
        console.log(`Connected to game`);
        this.connectedToGame.next(true);
      })
      .catch(err => {
        console.log(err);
        console.log('retrying...');
        setTimeout(() => this.joinGame(), 5000);
      })

  }

  public setReadyStatus(isReady: boolean) {
    this.hubConnection.invoke("PlayerReady", isReady);
  }

  public setReadyGameStart() {
    this.hubConnection.invoke("ReadyGameStart");
  }

  public submitRound(survived: boolean) {
    this.hubConnection.invoke("SubmitRoundResults", survived);
  }


  private registerOnServerEvents(): void {
    this.hubConnection.on('Players', (data: Array<Player>) => {
      this.playerList.next(data);
      console.log(data);
    });

    this.hubConnection.on('Game', (data: string)=> {
      this.gameEventChannel.emit(data);
      console.log(data);
    });

    this.hubConnection.on('GameSequence', (data: Array<number>) => {
      this.gameSequenceChannel.emit(data);
      console.log(data);
    });
  }
}
