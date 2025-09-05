/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TableauComposerComponent } from './tableau-composer.component';

describe('TableauComposerComponent', () => {
  let component: TableauComposerComponent;
  let fixture: ComponentFixture<TableauComposerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableauComposerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableauComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
