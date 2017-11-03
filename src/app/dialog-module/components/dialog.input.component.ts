import {
  Input,
  Output,
  Injector,
  EventEmitter,
  Component, OnInit
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DIALOG_LEAVING_TYPE, DIALOG_MESSAGE_TYPE, IDialog, IDialogLabels, IDialogResponse } from '../dialog.interface';

@Component({
  templateUrl: 'dialog.input.component.html'
})
export class DialogInputComponent implements OnInit, IDialog {

  @Input() modalId: string;
  @Input() messageType: DIALOG_MESSAGE_TYPE;
  @Input() title: string;
  @Input() body: SafeHtml|string;
  @Input() labels: IDialogLabels;
  @Input() icons: Object;

  @Output() clickStream$: EventEmitter<IDialogResponse> = new EventEmitter<IDialogResponse>();

  private form: FormGroup;
  private dialogResponse: IDialogResponse;

  constructor(private injector: Injector,
              private formBuilder: FormBuilder) {
    // see: https://codecraft.tv/courses/angular/dependency-injection-and-providers/tokens/
    this.modalId      = this.injector.get('modalId');
    this.messageType = this.injector.get('messageType');
    this.title        = this.injector.get('title');
    this.body         = this.injector.get('body');
    this.labels       = this.injector.get('labels');
    this.icons        = this.injector.get('icons');

    this.dialogResponse = {
      modalId: this.modalId
    };
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      inputField: ['', [
        Validators.required]]
    });
  }

  onSend(): void {
    this.dialogResponse.data = {inputValue: this.form.get('inputField').value};
    this.dialogResponse.leavingType = DIALOG_LEAVING_TYPE.CONFIRM;
    this.closeDialog();
  }

  onClose(): void {
    this.dialogResponse.leavingType = DIALOG_LEAVING_TYPE.CLOSE;
    this.closeDialog();
  }


  private closeDialog(): void {
    this.clickStream$.emit(this.dialogResponse);
  }

}
