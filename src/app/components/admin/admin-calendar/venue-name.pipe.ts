import { Pipe, PipeTransform } from '@angular/core';
import { Venue } from '../../../models/task';

@Pipe({
  name: 'venueName',
  standalone: true,
  pure: false
})
export class VenueNamePipe implements PipeTransform {

  transform(id: string, hashMap: {[id: string]: Venue}, field = 'title'): string {
    // console.log(id, Object.keys(hashMap).length);

    if (!Object.keys(hashMap).length || !Object.keys(hashMap).includes(id)) {
      return id;
    }

    // @ts-ignore
    const newVar: string = hashMap[id] ? hashMap[id][field] ?? '' : '';
    return  newVar as string;
  }

}
