import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Dsmodel } from './dsmodel.Interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  //private gu = 'http://192.168.100.33:3001/general';
  private gu = 'http://localhost:4000/general';

  constructor(private http: HttpClient) { }

  getDataWithJoinClause(p: Dsmodel) {
    const u = `${this.gu}/getDataWithJoinClause?`
    return this.http.post<any[]>(u, p, httpOptions);
  }

  updateData(p: Dsmodel) {
    const u = `${this.gu}/updateData?`
    return this.http.post<any[]>(u, p, httpOptions);
  }

  callSP(dataX: Object): any {
    let url = `${this.gu}/callSP`
    return this.http.post(url, dataX, httpOptions);
  }
}
