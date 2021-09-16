import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.scss']
})
export class UsernameComponent implements OnInit {

  userName: string = "";
  showModal: string = "block";
  //@Output() newUsernameEvent = new EventEmitter<string>();
  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.showModal = "block"
  }

  OnCreateUsername() {
    //this.newUsernameEvent.emit(this.username)
    this.userService.userName.next(this.userName);
  }
  checkButton() {
    if (!this.userName || this.userName.length < 3) {
      return true;
    } else {
      return false;
    }
  }
}
