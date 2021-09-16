import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './components/lobby/lobby.component';
import { SimonmasterComponent } from './simonmaster/simonmaster.component';

const routes: Routes = [
  {path: "", component: LobbyComponent},
  {path: "simon", component: SimonmasterComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
