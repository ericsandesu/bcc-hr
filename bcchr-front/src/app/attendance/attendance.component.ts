import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

//  attendance: String;
  attendance;
  constructor(private http: HttpClient) { }

//  const attendances[] = { punchIn: '09:00', punchOut: '15:00' } , { punchIn: '11:00', punchOut: '14:00' };
  attendances: Object[];

 ngOnInit() {
    // ------
    // toPromise.then((res) =>{}) を利用する場合のコード
    // ------
    this.http.get('http://localhost:3100/attendances')
    .subscribe(
      response => {
      //  this.param = response;
    //    this.messageInfoList = this.param.messages;
        console.log(response);
        this.attendance = JSON.stringify(response);
//        this.attendance = response;
//          this.attendance = Array.of(response.json());
//            this.attendance = JSON.parse(JSON.stringify(response));
//            this.attendance = response;
            this.attendances =  Object.keys(response).map(it => response[it])
            console.log('JSON.parse(JSON.stringify(attendances) ');
            console.log(JSON.stringify(response)); 
//          this.attendance = Array.of(temp.json());
/*            for (var key in response) {
              this.attendance.push(response[key])
            }
          */     }
 //   )
//    .catch(
//      (error) => console.log(error)
    );
  }

}
