import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceBeforeCaps'
})
export class SpaceBeforeCapsPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    const spacedString = value.replace(/([A-Z])/g, ' $1').trim();
    return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
  }

}
