// currently just used for testing purposes (have no markup dependencies)

import {
  Component,
  Input,
  Output,
  Injector,
  EventEmitter
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { DIALOG_LEAVING_TYPE, DIALOG_MESSAGE_TYPE, IDialog, IDialogLabels, IDialogResponse } from '../dialog.interface';
import { Token } from '@angular/compiler';

@Component({
  template: `
    <div class="dialogTest" [id]="modalId">
        <header><div class="title">{{title}}</div><div class="close-button" (click)="onClose()">x</div></header>
        <p>{{body}}</p>
    </div>
    `,
  styles: [`
        .dialogTest {
            width: 250px;
            position: absolute;
            border: 1px solid black;
            border-radius: 5px;
            overflow: hidden;
            position: fixed;
            left: calc(50% - 125px);
            top: 250px;
        }
        .dialogTest p {
            text-align: center;
        }
        .dialogTest header {
            border-bottom: 1px solid black;
            font-size: 12px;
            padding: 5px;
            display: flex;
        }
        .dialogTest header .title {
            flex-grow: 1;
            cursor: default;
        }
        .dialogTest header .close-button {
            cursor: pointer;
            padding: 0 5px;
        }
    `]
})
export class DialogTestComponent implements IDialog {

  @Input() modalId: string;
  @Input() messageType: DIALOG_MESSAGE_TYPE;
  @Input() title: string;
  @Input() body: SafeHtml|string;
  @Input() labels: IDialogLabels;
  @Input() icons: Object;

  @Output() clickStream$: EventEmitter<any> = new EventEmitter();

  private dialogResponse: IDialogResponse;

  constructor(private injector: Injector) {
    this.modalId      = this.injector.get<string>(<any>'modalId');
    this.messageType  = this.injector.get<DIALOG_MESSAGE_TYPE>(<any>'messageType');
    this.title        = this.injector.get<string>(<any>'title');
    this.body         = this.injector.get<SafeHtml|string>(<any>'body');
    this.labels       = this.injector.get<IDialogLabels>(<any>'labels');
    this.icons        = this.injector.get<Object>(<any>'icons');

    this.dialogResponse = {
      modalId: this.modalId,
      leavingType: DIALOG_LEAVING_TYPE.CLOSE
    };
  }

  onClose() {
    this.clickStream$.emit(this.dialogResponse);
  }

}
