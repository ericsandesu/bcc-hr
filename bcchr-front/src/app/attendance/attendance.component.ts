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
            this.attendances.forEach(this.calculateLength);
//          this.attendance = Array.of(temp.json());
/*            for (var key in response) {
              this.attendance.push(response[key])
            }
          */     }
 //   )
//    .catch(
//      (error) => console.log(error)\
    );
  }

  calculateLength(value, index, array) {
    console.log("punchOut " + array[index].Record.punchOut);
    if ( array[index].Record.punchOut != "") {
      var punchOutSplit = array[index].Record.punchOut.split(":");
      var punchOutTime = new Date(1970, 1, 1, punchOutSplit[0], punchOutSplit[1], punchOutSplit[2], 0);
      var punchInSplit = array[index].Record.punchIn.split(":");
      var punchInTime = new Date(1970, 1, 1, punchInSplit[0], punchInSplit[1], punchInSplit[2], 0);
      var diff: number = punchOutTime.getTime() - punchInTime.getTime();
      diff = diff / 1000;
      array[index].Record.timelength = Math.trunc(diff/3600) + ":" + Math.trunc((diff%3600)/60)+ ":" + Math.trunc((diff%60));  
    } else {
      array[index].Record.timelength = "";
    }
  }

}
