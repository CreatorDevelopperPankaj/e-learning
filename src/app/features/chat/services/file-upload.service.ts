import { HttpClient } from '@angular/common/http'; import { inject, Injectable } from '@angular/core'; import { environment } from '../../../../environments/environment';
@Injectable({providedIn:'root'}) export class FileUploadService {private http=inject(HttpClient);private base=`${environment.apiBaseUrl}/v1`;
 upload(file:File){const body=new FormData();body.append('file',file);return this.http.post<{success:boolean;data:any}>(`${this.base}/files/upload`,body)}
 downloadUrl(fileId:string){return `${this.base}/files/${fileId}/download`} }
