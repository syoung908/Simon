import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/player.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  public playerList: Array<Player> = [];
  public playerReady: boolean = false;
  public allPlayersReady: boolean = false;
  public countdownTimer: number;
  public player : Player | any={
    name: "",
    state:""
  };
  constructor(private gameservice: GameService, private router: Router) {
    this.countdownTimer = 10;
    this.subscribeToEvents();
  }

  ngOnInit(): void {
    // document.getElementById("exampleModalToggle")?.style.setProperty("display","block")
    this.player.name = sessionStorage.getItem("username");
  }

  public toggleReady(): void {
    this.playerReady = !this.playerReady;
    this.gameservice.setReadyStatus(this.playerReady);
    
  }

  public startCountdown() {
    var timer = setInterval(() => {
      if (this.countdownTimer <= 0){
        clearInterval(timer);
        this.router.navigate(['simon']);
      } else {
        this.countdownTimer -= 1;
      }
    }, 1000);
  }

  private subscribeToEvents(): void {
    this.gameservice.playerList.subscribe(players => {
      this.playerList = players;
    });

    this.gameservice.gameEventChannel.subscribe(message => {
      if (message == "Start") {
        this.allPlayersReady = true;
        this.startCountdown();
      }
    });
  }

  getUsername(username: string){
    
     sessionStorage.setItem("username",username)
    if(username) {
      this.gameservice.joinGame(username);
      this.player.name = username;
    }
    else{}
   
  }

}
