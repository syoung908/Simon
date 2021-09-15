import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimonmasterComponent } from './simonmaster/simonmaster.component';

const routes: Routes = [{path:"simon", component: SimonmasterComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
