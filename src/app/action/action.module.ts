import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionRoutingModule } from './action-routing.module';
import { AdditemComponent } from './additem/additem.component';
import { MatCardModule} from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material';
import { FormsModule }   from '@angular/forms';
import { FileSelectDirective } from 'ng2-file-upload';
import {ImagePreview} from './image-preview.directive';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {RestserviceService} from './restservice.service';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    ActionRoutingModule,
    MatCardModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    HttpClientModule,
    HttpModule,
    MatIconModule
  ],
  declarations: [
    AdditemComponent,
    FileSelectDirective,
    ImagePreview
  ],
  exports: [
    ImagePreview
  ],
  providers: [
    RestserviceService
   ],
})
export class ActionModule { }
