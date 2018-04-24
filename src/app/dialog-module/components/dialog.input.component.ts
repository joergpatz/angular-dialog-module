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

  form: FormGroup;
  private dialogResponse: IDialogResponse;

  constructor(private injector: Injector,
              private formBuilder: FormBuilder) {
    this.modalId      = this.injector.get<string>(<any>'modalId');
    this.messageType  = this.injector.get<DIALOG_MESSAGE_TYPE>(<any>'messageType');
    this.title        = this.injector.get<string>(<any>'title');
    this.body         = this.injector.get<SafeHtml|string>(<any>'body');
    this.labels       = this.injector.get<IDialogLabels>(<any>'labels');
    this.icons        = this.injector.get<Object>(<any>'icons');

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
