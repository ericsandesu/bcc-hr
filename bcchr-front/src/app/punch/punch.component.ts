import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-punch',
  templateUrl: './punch.component.html',
  styleUrls: ['./punch.component.scss']
})
export class PunchComponent implements OnInit {

  //  attendance: String;
  attendance;
  isPunchInDisable : boolean;
  isPunchOutDisable : boolean;
  lastPunchIn: string;
  lastPunchOut: string;
  constructor(private http: HttpClient) { };

  //  const attendances[] = { punchIn: '09:00', punchOut: '15:00' } , { punchIn: '11:00', punchOut: '14:00' };
  attendances: Object[];

  ngOnInit() {
    // ------
    // toPromise.then((res) =>{}) を利用する場合のコード
    // ------
    this.isPunchInDisable = true;
    this.isPunchOutDisable = false;
    this.lastPunchIn = "";

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
          this.attendances = Object.keys(response).map(it => response[it])
          console.log('JSON.parse(JSON.stringify(attendances) ');
          console.log(JSON.stringify(response));
          console.log('last punch out ' + JSON.parse(JSON.stringify(this.attendances[this.attendances.length-1])).Record.punchOut);
          if (JSON.parse(JSON.stringify(this.attendances[this.attendances.length-1])).Record.punchOut == '') {
            this.isPunchInDisable = true;
            this.isPunchOutDisable = false;        
          } else {
            this.isPunchInDisable = false;
            this.isPunchOutDisable = true;
          }
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


  punchIn() {
    /*    const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        });
    */
    /*    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');
*/
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    const data = new FormData();
    data.append("attendanceNumber", this.attendances.length.toString());
    //data.append("password", password);
    var punchIn = { attendanceNumber: this.attendances.length };
    console.log('punch in');
    console.log('next attendance number ' + this.attendances.length);
    /*   this.http.post('http://localhost:3100/punchin', data, {
         headers: headers
       })
   */
    this.http.get('http://localhost:3100/punchin?attendanceNumber=' + this.attendances.length.toString(), {
      headers: headers
    })
      .subscribe(
        response => {
          this.attendances = Object.keys(response).map(it => response[it]);
        });
        this.isPunchInDisable = true;
        this.isPunchOutDisable = false;        
        var now = new Date();
        this.lastPunchIn = now.getHours().toString()+':'+now.getMinutes().toString()+':'+now.getSeconds().toString();
  }

  punchOut() {
    console.log('punch out');
    console.log('last attendance number ' + (this.attendances.length - 1));
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    this.http.get('http://localhost:3100/punchout?attendanceNumber=' + (this.attendances.length-1).toString(), {
      headers: headers
    })
      .subscribe(
        response => {
          this.attendances = Object.keys(response).map(it => response[it]);
        });
        console.log('punch out finished');
        this.isPunchInDisable = false;
        this.isPunchOutDisable = true;        
        var now = new Date();
        this.lastPunchOut = now.getHours().toString()+':'+now.getMinutes().toString()+':'+now.getSeconds().toString();
  }

}
