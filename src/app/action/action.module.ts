import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionRoutingModule } from './action-routing.module';
import { AdditemComponent } from './additem/additem.component';
import { MatCardModule} from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FileSelectDirective } from 'ng2-file-upload';
import {ImagePreview} from './image-preview.directive';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {RestserviceService} from './restservice.service';
import {MatIconModule} from '@angular/material/icon';
import { OrderComponent } from './order/order.component';
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule } from '@angular/material';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import * as  Cloudinary from 'cloudinary-core';


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
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'pasindu124', upload_preset: 'nuyp4jky', api_key: '478836332838794', api_secret: 'F5Xwq5HQC-cLGQmQtvGeU7hLpuU'}),
  ],
  declarations: [
    AdditemComponent,
    FileSelectDirective,
    ImagePreview,
    OrderComponent
  ],
  exports: [
    ImagePreview
  ],
  providers: [
    RestserviceService
   ],
})
export class ActionModule { }
