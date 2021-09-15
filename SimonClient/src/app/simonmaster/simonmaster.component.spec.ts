import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimonmasterComponent } from './simonmaster.component';

describe('SimonmasterComponent', () => {
  let component: SimonmasterComponent;
  let fixture: ComponentFixture<SimonmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimonmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimonmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
