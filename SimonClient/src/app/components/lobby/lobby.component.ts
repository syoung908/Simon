import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/models/player.model';
import { GameService } from 'src/app/services/game.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  private subscriptions = new Subscription();
  public playerList: Array<Player> = [];
  public playerReady: boolean = false;
  public allPlayersReady: boolean = false;
  public countdownTimer: number = 10;
  public player: Player | any = {
    name: "",
    state: ""
  };
  constructor(private gameservice: GameService, private userservice: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.subscribeToEvents();
    this.countdownTimer = 10;
  }

  ngOnDestroy(): void {
    this.unsubscribeToEvents();
  }

  public toggleReady(): void {
    this.playerReady = !this.playerReady;
    this.gameservice.setReadyStatus(this.playerReady);

  }

  private subscribeToEvents(): void {
    this.subscriptions.add(
      this.gameservice.playerList.subscribe(players => {
        this.playerList = players;
      })
    );

    this.subscriptions.add(
      this.gameservice.gameEventChannel.subscribe(message => {
        if (message == "Start") {
          this.allPlayersReady = true;
          this.countdownTimer = 10;
          const timer = setInterval(() => {
            if (this.countdownTimer <= 0) {
              clearInterval(timer);
              this.router.navigate(['simon']);
            } else {
              this.countdownTimer -= 1;
            }
          }, 1000);
        }
      })
    );
    this.subscriptions.add(
      this.userservice.userName.subscribe(username => {
        if (username) {
          this.gameservice.joinGame(username);
          this.player.name = username;
        }
      })
    );
  }

  private unsubscribeToEvents(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
