import { Component, AfterViewInit, OnDestroy, NgZone, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { DialogService } from './dialog-module/dialog.service';
import { DIALOG_LEAVING_TYPE, IDialogData } from './dialog-module/dialog.interface';
import { DialogComponent } from './dialog-module/dialog.component';
import { DialogTestComponent } from './dialog-module/components/dialog.test.component';
import { DialogInputComponent } from './dialog-module/components/dialog.input.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  title = 'Dialog-Module';

  @ViewChild('dialogContainer') dialogContainer: DialogComponent;

  private subscriptions: Subscription[] = [];

  constructor(private _ngZone: NgZone,
              private dialogService: DialogService) {
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.dialogService.getEmitStream().subscribe((data: IDialogData) => {
        this._ngZone.run(() => {
          this.dialogContainer.componentData = data;
        });
      })
    );
  }

  ngOnDestroy(): void {
    // prevent memory leak when component is destroyed
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  // DEMO methods
  openPlainDialog() {
    this.dialogService.emitDialog({
      component: DialogTestComponent,
      inputs: {
        modalId: 'test-dialog'
      }
    });
  }

  openDialog() {
    this.dialogService.emitDialog({
      inputs: {
        modalId: 'default-dialog',
        body: `Try hitting the <code>tab</code> key and notice how the focus stays within the modal itself.
              Also, <code>esc</code> to close modal.`
      }
    }).subscribe(choice => {
      console.log(choice);
    });
  }

  openInputDialog() {
    this.dialogService.emitDialog({
      component: DialogInputComponent,
      inputs: {
        modalId: 'input-dialog',
        body: `Try hitting the <code>tab</code> key and notice how the focus stays within the modal itself.
              Also, <code>esc</code> to close modal.`
      }
    }).subscribe(choice => {
      if (choice.leavingType === DIALOG_LEAVING_TYPE.CONFIRM) {
        console.log(choice);
      }
    });
  }


}
