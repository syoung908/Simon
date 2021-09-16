import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServicesService } from './services.service';
import { SimonmasterComponent } from './simonmaster/simonmaster.component';
import { LobbyComponent } from './components/lobby/lobby.component';

@NgModule({
  declarations: [
    AppComponent,
    SimonmasterComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ServicesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
