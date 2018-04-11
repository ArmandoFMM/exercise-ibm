import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http} from '@angular/http';
import { AppComponent } from './app.component';
import { ContasDataService } from './contas-data.service'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [ ContasDataService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
