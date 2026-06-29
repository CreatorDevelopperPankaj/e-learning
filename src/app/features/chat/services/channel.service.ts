import { HttpClient } from '@angular/common/http'; import { inject, Injectable } from '@angular/core'; import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; import { Channel } from '../models/channel.model';
@Injectable({providedIn:'root'}) export class ChannelService { private http=inject(HttpClient); private base=`${environment.apiBaseUrl}/v1`;
  list(courseId:string):Observable<{success:boolean;data:Channel[]}>{return this.http.get<{success:boolean;data:Channel[]}>(`${this.base}/courses/${courseId}/channels`)}
  create(courseId:string,payload:Partial<Channel>){return this.http.post(`${this.base}/courses/${courseId}/channels`,payload)}
  update(channelId:string,payload:Partial<Channel>){return this.http.patch(`${this.base}/channels/${channelId}`,payload)}
  delete(channelId:string){return this.http.delete(`${this.base}/channels/${channelId}`)}
  direct(courseId:string,userId:string):Observable<{success:boolean;data:Channel}>{return this.http.post<{success:boolean;data:Channel}>(`${this.base}/courses/${courseId}/direct/${userId}`,{})} }
