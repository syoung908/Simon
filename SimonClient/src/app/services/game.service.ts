import { Injectable } from '@angular/core';
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
  public counter = 0;

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
        this.registerOnServerEvents();
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


  private registerOnServerEvents(): void {
    this.hubConnection.on('Players', (data: Array<Player>) => {
      this.counter++;
      console.log(this.counter);
      console.log(data);
    });
  }
}
