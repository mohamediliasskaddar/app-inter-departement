/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QualiteComponent } from './Qualite.component';

describe('QualiteComponent', () => {
  let component: QualiteComponent;
  let fixture: ComponentFixture<QualiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
