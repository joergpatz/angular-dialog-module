import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DialogModule } from './dialog.module';
import { DialogComponent } from './dialog.component';
import { DialogTestComponent } from './components/dialog.test.component';

describe('Container DialogComponent', () => {

  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  const modalId = 'test_modal_dialog';
  const text = 'this is a dynamic created dialog.';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogModule]
    });

    fixture = TestBed.createComponent(DialogComponent);

    // DialogComponent test instance
    component = fixture.componentInstance;
  });

  it('dialog anchor should be defined', function () {
    // query for the dialogAnchor <div> by CSS element selector
    const de = fixture.debugElement.query(By.css('div'));
    const el = de.nativeElement;

    expect(el.outerHTML).toContain('<div');
    expect(component.dialogAnchor).toBeDefined();
  });

  it('should set modal dialog id', function () {
    component.componentData = {
      component: DialogTestComponent,
      inputs: {
        modalId: modalId
      }
    };

    fixture.detectChanges();

    const de = fixture.debugElement.query(By.css('ng-component > div'));
    const el = de.nativeElement;
    expect(el.id).toContain(modalId);
  });

  it('should set component text data', function () {
    component.componentData = {
      component: DialogTestComponent,
      inputs: {
        body: text
      }
    };

    fixture.detectChanges();

    const de = fixture.debugElement.query(By.css('ng-component'));
    const el = de.nativeElement;
    expect(el.textContent).toContain(text);
  });

  it('should destroy dynamic dialog', function () {
    component.componentData = {
      component: DialogTestComponent,
      inputs: {
        body: text
      }
    };

    fixture.detectChanges();

    fixture.debugElement.query(By.css('.close-button')).nativeElement.click();
    const de = fixture.debugElement.query(By.css('ng-component'));
    expect(de).toBeNull();
  });

});
