import {
  Component,
  ComponentRef,
  ComponentFactoryResolver,
  Input,
  ViewChild,
  ViewContainerRef,
  ReflectiveInjector,
  EventEmitter,
  HostListener,
  SecurityContext,
  OnInit,
  Injector
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IDialogLabels, IDialogData, IDialogResponse, DIALOG_MESSAGE_TYPE } from './dialog.interface';
import { DialogService } from './dialog.service';
import { DialogDefaultComponent } from './components/dialog.default.component';
import { mergeDeep } from './utils/merge-deep/merge-deep.utils';


// default dialog options
const defaultModalId: string = 'modal_dialog';
const defaultTitle: string = 'Define Title';
const defaultMessageType: DIALOG_MESSAGE_TYPE = DIALOG_MESSAGE_TYPE.HINT;
const defaultLabels: IDialogLabels = {
  view: 'View',
  save: 'Save',
  cancel: 'Cancel',
  edit: 'Edit',
  change: 'Change',
  send: 'Send',
  confirm: 'Confirm',
  submit: 'Submit',
  close: 'Close',
  yes: 'Yes',
  no: 'No',
  check: 'Check',
  ok: 'Ok',
  proceed: 'Proceed'
};
const defaultIcons: Object = {
  confirm: '',
  cancel: ''
};

const blueprint: IDialogData = {
  component: DialogDefaultComponent,
  inputs: {
    modalId: defaultModalId,
    messageType: defaultMessageType,
    title: defaultTitle,
    body: 'Define Text',
    labels: defaultLabels,
    icons: defaultIcons
  }
};

@Component({
  selector: 'app-dialog-container',
  template: `
    <!--The dialog is inserted as a sibling to this element-->
    <div #dialogAnchor></div>
  `,
  styles: [`
    [dialogAnchor] {
      display: none;
    }
  `],
})
export class DialogComponent implements OnInit {

  // ViewContainerRef can be informally thought of as a location in the DOM where new components can be inserted
  @ViewChild('dialogAnchor', {read: ViewContainerRef}) dialogAnchor: ViewContainerRef;

  private dialogComponentRef: ComponentRef<any>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private dialogService: DialogService,
              private domSanitizer: DomSanitizer) {
  }


  ngOnInit(): void {
    this.dialogService
      .getDestroyCommandStream()
      .subscribe((id: string) => {
        this.destroyComponentRef(id);
      });
  }

  @HostListener('window:hashchange', ['$event'])
  onHashChange(event) {
    if (this.dialogAnchor.length > 0) {
      this.dialogAnchor.clear();
    }
  }

  @Input()
  set componentData(data: Object) {
    if (!data) {
      return;
    }

    this.dialogAnchor.clear();
    this.sanitize(data);

    const version: IDialogData = mergeDeep(blueprint, data);

    // Inputs need to be in the following format to be resolved properly
    const staticProviders = Object.keys(version.inputs).map((inputName) => {
      return {provide: inputName, useValue: version.inputs[inputName], deps: []};
    });
    const options = { providers: staticProviders, parent: this.dialogAnchor.parentInjector, name: 'test'};
    const injector = Injector.create(options);

    // Create a factory out of the component we want to create
    const dialogComponentFactory = this.componentFactoryResolver.resolveComponentFactory(version.component);

    // ViewContainerRef class, which provides a handy createComponent method
    this.dialogComponentRef = this.dialogAnchor.createComponent(dialogComponentFactory, 0, injector);

    this.subscribeClickEvent();
  }

  private subscribeClickEvent(): void {
    if (this.dialogComponentRef.instance.clickStream$ instanceof EventEmitter) {
      this.dialogComponentRef.instance.clickStream$.subscribe((dialogResponse: IDialogResponse) => {
        this.dialogService.sendFeedback(dialogResponse);
        this.dialogService.sendDestroyCommand(dialogResponse.modalId);
      });
    }
  }

  private destroyComponentRef(id: string): void {
    if (this.dialogComponentRef
      && this.dialogComponentRef.instance.modalId
      && this.dialogComponentRef.instance.modalId === id) {

      this.dialogComponentRef.destroy();
    }
  }

  private sanitize(data): void {
    if (data && data.inputs && data.inputs.body) {
      data.inputs.body = this.domSanitizer.sanitize(SecurityContext.HTML, data.inputs.body);
    }
  }

}
