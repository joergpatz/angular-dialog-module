import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { DialogService } from './dialog.service';
import { DialogComponent } from './dialog.component';
import { DialogAbstractComponent } from './components/abstract/dialog.abstract.component';

import { dialogUIComponents } from './dialog.barrel';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule],
  declarations: [
    DialogComponent,
    DialogAbstractComponent,
    ...dialogUIComponents
  ],
  entryComponents: [...dialogUIComponents],
  providers: [DialogService],
  exports: [DialogComponent]
})
export class DialogModule {
}
