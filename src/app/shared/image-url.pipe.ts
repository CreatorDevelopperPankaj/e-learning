import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  // Compute the base URL once instead of every time the pipe runs
  private readonly baseUrl = environment.apiBaseUrl.replace('/api', '') + '/uploads/';

  transform(profileImage: string | null | undefined): string {
    if (!profileImage) {
      return ''; // Or return a fallback placeholder image URL e.g., 'assets/placeholder.png'
    }
    return `${this.baseUrl}${profileImage}`;
  }
}
