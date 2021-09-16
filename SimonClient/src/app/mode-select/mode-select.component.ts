import { Component, OnInit } from '@angular/core';

enum ModeType{
  unselected,
  singlePlayer,
  multiPlayer
}

@Component({
  selector: 'app-mode-select',
  templateUrl: './mode-select.component.html',
  styleUrls: ['./mode-select.component.scss']
})
export class ModeSelectComponent implements OnInit {
  ModeType = ModeType;
  modeType: ModeType = this.ModeType.unselected;
  constructor() { }

  ngOnInit(): void {
  }

  TypeSelect(type:string)
  {
    if(type === "singleplayer")
      this.modeType = this.ModeType.singlePlayer;
    if (type === "multiplayer")
      this.modeType = this.ModeType.multiPlayer;
  }
}
