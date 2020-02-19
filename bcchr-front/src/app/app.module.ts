import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { PunchComponent } from './punch/punch.component';
import { TravelCreateComponent } from './travel-create/travel-create.component';
import { ActivityCreateComponent } from './activity-create/activity-create.component';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DialogOverviewExampleDialog } from './activity-create/activity-create.component';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatSelectModule,
  MatSliderModule,
  MatDialogModule
} from '@angular/material';

// HTTP クライアントとしてのコンポーネント
// import { HttpClientComponent } from './http-client/http-client.component';

// バックエンドとの通信を実際に担当するサービス
// import { HttpClientService } from './service/http-client.service';

const appRoutes: Routes = [
  { path: '', component: AppComponent },
  {
    path: 'attendance',
    component: AttendanceComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AttendanceComponent,
    MenuComponent,
    PunchComponent,
    TravelCreateComponent,
    ActivityCreateComponent,
    DialogOverviewExampleDialog
//    HttpClientComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatSliderModule,
    MatDialogModule,
    FormsModule,
    NgxChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewExampleDialog]
})
export class AppModule { }
