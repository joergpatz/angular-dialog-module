import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { IDialogData, IDialogResponse } from './dialog.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';


@Injectable()
export class DialogService {

  // Subject Dialog sources (http://reactivex.io/documentation/subject.html)
  private _dialogEmitSource = new Subject();
  private _dialogFeedbackSource: Subject<IDialogResponse> = new Subject<IDialogResponse>();
  private _dialogDestroySource = new Subject();
  private _dialogsOpenStatusSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // Observable Dialog streams (don't leak the "observer-side" of our Subjects out of our API)
  private _dialogEmitted$ = this._dialogEmitSource.asObservable();
  private _dialogFeedback$: Observable<IDialogResponse> = this._dialogFeedbackSource.asObservable();
  private _dialogDestroyCommand$ = this._dialogDestroySource.asObservable();

  private openModalIds: string[] = [];

  public emitDialog(data: IDialogData): Observable<IDialogResponse> {
    this._dialogEmitSource.next(data);
    this.openModalIds.push(data.inputs.modalId);
    this._dialogsOpenStatusSource.next(this.openModalIds.length > 0);
    return this.getFeedbackStream((data && data.inputs) ? data.inputs.modalId : null).take(1);
  }

  public getEmitStream(): Observable<any> {
    return this._dialogEmitted$;
  }

  public sendFeedback(data: IDialogResponse): void {
    this._dialogFeedbackSource.next(data);
  }

  public getFeedbackStream(id: string): Observable<IDialogResponse> {
    return this._dialogFeedback$.filter((data: IDialogResponse) => data.modalId === id);
  }

  public sendDestroyCommand(id: string): void {
    this.openModalIds = this.openModalIds.filter((modalId: string) => modalId !== id);
    this._dialogsOpenStatusSource.next(this.openModalIds.length > 0);
    this._dialogDestroySource.next(id);
  }

  public getDestroyCommandStream(): Observable<any> {
    return this._dialogDestroyCommand$;
  }

  /**
   * The return observable emits values on open and close events. If true, at least one dialog instance is active,
   * if false, no instance is active.
   * @returns {Observable<boolean>}
   */
  public getDialogsOpenStatus(): Observable<boolean> {
    return this._dialogsOpenStatusSource.asObservable();
  }

}
