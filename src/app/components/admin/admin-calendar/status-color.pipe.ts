import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {

  transform(status: string): string {
    switch (status) {
      case 'confirmed':
        return '#52c41a';
      case 'paid':
        return '#b4befe';
      case 'cancelled':
        return '#f5222d';
      default:
        return '#faad14'; // pending
    }
  }

}
