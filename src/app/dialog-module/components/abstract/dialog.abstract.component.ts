/**
 * Use a tiny javascript library for creating accessible modal dialogs
 *
 * https://github.com/Ghosh/micromodal
 */

import {
  Input,
  Output,
  AfterViewInit,
  EventEmitter,
  Component,
  OnInit
} from '@angular/core';

import MicroModal from 'micromodal';

import { DIALOG_MESSAGE_TYPE, IDialog, IDialogLabels } from '../../dialog.interface';

@Component({
  selector: 'app-dialog-abstract',
  templateUrl: 'dialog.abstract.component.html',
  styleUrls: ['./dialog.abstract.component.css']
})
export class DialogAbstractComponent implements OnInit, AfterViewInit, IDialog {

  @Input() modalId: string;
  @Input() messageType: DIALOG_MESSAGE_TYPE;
  @Input() title: string;
  @Input() labels: IDialogLabels;
  @Input() icons: Object;

  @Output() close: EventEmitter<any> = new EventEmitter();

  messageTypeClass: string;

  ngOnInit(): void {
    this.messageTypeClass = DIALOG_MESSAGE_TYPE[this.messageType].toLowerCase();
  }

  ngAfterViewInit(): void {
    MicroModal.show(this.modalId);
  }

  onClose(): void {
    this.close.emit();
  }
}
