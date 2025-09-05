/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HSEEnComponent } from './HSEEn.component';

describe('HSEEnComponent', () => {
  let component: HSEEnComponent;
  let fixture: ComponentFixture<HSEEnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HSEEnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HSEEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
