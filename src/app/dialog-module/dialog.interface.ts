import { Type } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

export enum DIALOG_LEAVING_TYPE {
  CLOSE = -1,
  CANCEL = 0,
  CONFIRM = 1
}

export enum DIALOG_MESSAGE_TYPE {
  HINT,
  ERROR
}

export interface IDialogLabels {
  view?: string;
  save?: string;
  cancel?: string;
  edit?: string;
  change?: string;
  send?: string;
  confirm?: string;
  submit?: string;
  close?: string;
  yes?: string;
  no?: string;
  check?: string;
  ok?: string;
  proceed?: string;
}

export interface IDialog {
  modalId: string;
  messageType?: DIALOG_MESSAGE_TYPE;
  title?: string;
  body?: SafeHtml|string;
  input?: { placeholder: SafeHtml|string, regEx?: string, value?: string };
  labels?: IDialogLabels;
  icons?: Object;
}

export interface IDialogData {
  component?: Type<any>;
  inputs?: IDialog;
}

export interface IDialogResponse {
  modalId: string;
  leavingType?: DIALOG_LEAVING_TYPE;
  data?: any;
  validationError?: boolean;
}
