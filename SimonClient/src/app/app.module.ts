import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServicesService } from './services.service';
import { SimonmasterComponent } from './simonmaster/simonmaster.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { UsernameComponent } from './components/username/username.component';
import { ModeSelectComponent } from './mode-select/mode-select.component';

@NgModule({
  declarations: [
    AppComponent,
    SimonmasterComponent,
    LobbyComponent,
    UsernameComponent,
    ModeSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [ServicesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
