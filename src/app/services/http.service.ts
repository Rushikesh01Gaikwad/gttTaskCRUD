import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiUrl = "https://fakestoreapi.com/products";

  constructor(public api: HttpClient) { }


  public post(obj?: any, params?: any) {
    return this.api.post(this.apiUrl, obj, { params: params });
  }

  public get(param?: any): Observable<any> {
    return this.api.get(this.apiUrl, { params: param })
  }

  public put(obj?: [], param?: any): Observable<any> {
    return this.api.put(this.apiUrl, obj, { params: param });
  }

  public delete(param?: any, fun?: any): Observable<any> {
    return this.api.delete(this.apiUrl, { params: param });
  }

}


