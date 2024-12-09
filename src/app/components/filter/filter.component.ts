import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatLabel, MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

const MATERIAL_MODULES = [MatLabel, MatFormFieldModule, MatFormField, MatChipsModule, MatIconModule]
@Component({
  selector: 'app-filter',
  imports: [FormsModule, MATERIAL_MODULES],
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent {
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  filterChips = model<string[]>([]);
  label = input<string>('Filter');
  placeholder = input<string>('Ex. name');

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.filterChips.update(chips => [...chips, value]);
    }
    event.chipInput!.clear();
  }

  removeChip(filterChip: string) {
    this.filterChips.update(chips => {
      const index = chips.indexOf(filterChip);
      if (index < 0) {
        return chips
      }
      chips.splice(index , 1);
      return [...chips]
    });
  }
}