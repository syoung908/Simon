import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor() { }

  generateArray():any{
    return [1,2,3,4];
  }
}
