import { CommonModule } from '@angular/common'; import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'; import { MatIconModule } from '@angular/material/icon';
import { ChatMessage } from '../../models/chat-message.model'; import { CourseMemberView } from '../../services/member.service';
@Component({selector:'app-chat-sidebar-right',standalone:true,imports:[CommonModule,MatIconModule],templateUrl:'./sidebar-right.component.html',styleUrls:['./sidebar-right.component.scss'],changeDetection:ChangeDetectionStrategy.OnPush})
export class SidebarRightComponent {
 @Input() members:CourseMemberView[]=[]; @Input() progressValue=0; @Input() pinnedMessages:ChatMessage[]=[]; @Input() sharedFiles:any[]=[]; @Input() currentUserId=''; @Output() readonly memberSelected=new EventEmitter<CourseMemberView>();
 initials(name:string){return(name||'User').split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()}
 fileName(file:any){return file.name||file.fileName||'Shared file'}
}
