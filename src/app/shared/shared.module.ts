import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { LabelColumnTableComponent } from './components/label-column-table/label-column-table.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { CustomizedCheckboxComponent } from './components/customized-checkbox/customized-checkbox.component';
import { DrRolePipe } from '@shared/pipes';
import {
  RowSelectedDirective,
  OnlyNumberDirective,
  ClickOutsideDirective,
  TrimValueDirective,
  BtnClickBlurDirective,
  CheckBoxDirective,
  RadioButtonDirective,
  SwipeDirective,
  TransformSpaceDirective,
} from '@shared/directives/index';
import { GenderPipe } from './pipes/gender.pipe';
import { DashPipe } from './pipes/dash.pipe';
import { HelpDetail1Component } from './components/help-component/help-detail-1/help-detail-1.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { CustomDatepickerComponent } from './components/custom-datepicker/custom-datepicker.component';
import { TextMaskModule } from 'angular2-text-mask';
import { HelpDetailErrorComponent } from './components/help-component/help-detail-error/help-detail-error.component';
import { HelpDetail2Component } from './components/help-component/help-detail-2/help-detail-2.component';
import { ExportModalComponent } from './components/export-modal/export-modal.component';
import { HelpDetail3Component } from './components/help-component/help-detail-3/help-detail-3.component';

@NgModule({
  declarations: [
    UserLoginComponent,
    LabelColumnTableComponent,
    PaginatorComponent,
    ConfirmModalComponent,
    CustomizedCheckboxComponent,
    DrRolePipe,
    RowSelectedDirective,
    OnlyNumberDirective,
    GenderPipe,
    DashPipe,
    HelpDetail1Component,
    EvaluationComponent,
    CustomDatepickerComponent,
    ClickOutsideDirective,
    TrimValueDirective,
    BtnClickBlurDirective,
    HelpDetailErrorComponent,
    HelpDetail2Component,
    CheckBoxDirective,
    RadioButtonDirective,
    SwipeDirective,
    ExportModalComponent,
    HelpDetail3Component,
    TransformSpaceDirective,
  ],
  exports: [
    CommonModule,
    UserLoginComponent,
    LabelColumnTableComponent,
    PaginatorComponent,
    CustomizedCheckboxComponent,
    TranslateModule,
    NgbCollapseModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DrRolePipe,
    RowSelectedDirective,
    OnlyNumberDirective,
    ClickOutsideDirective,
    GenderPipe,
    DashPipe,
    CustomDatepickerComponent,
    TextMaskModule,
    TrimValueDirective,
    BtnClickBlurDirective,
    CheckBoxDirective,
    RadioButtonDirective,
    SwipeDirective,
    TransformSpaceDirective,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgbModule, TextMaskModule],
})
export class SharedModule {}
