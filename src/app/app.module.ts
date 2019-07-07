import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LazyLoadModule } from './lazy-load/lazy-load.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { MatTableModule } from '@angular/material';  



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    LazyLoadModule,
    CoreModule,
    BrowserAnimationsModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
