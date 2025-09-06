/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TableauxComponent } from './tableaux.component';

describe('TableauxComponent', () => {
  let component: TableauxComponent;
  let fixture: ComponentFixture<TableauxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableauxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
