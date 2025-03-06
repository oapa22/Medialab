import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: false
})
export class TruncatePipe implements PipeTransform {

  transform(text:string, limit:number = 15): string {

    if(text.length > limit){
      text = text.substring(0, limit) + '...';
    }

    return text;
  }

}
