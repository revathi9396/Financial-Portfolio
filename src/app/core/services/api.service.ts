import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getData(url: string) {
    return this.http.get(url);
  }

  postData(url: string, data: any) {
    return this.http.post(url, data);
  }

  // Additional methods for PUT, DELETE, etc. can be added here
}
