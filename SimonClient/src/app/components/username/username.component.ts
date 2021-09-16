import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit {

  username: string = "";
  showModal: string = "block";
  @Output() newUsernameEvent = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
    this.showModal = "block"
  }

  OnCreateUsername() {
    this.newUsernameEvent.emit(this.username)
  }
  checkButton() {
    if (!this.username || this.username.length < 3) {
      return true;
    } else {
      return false;
    }
  }
}
