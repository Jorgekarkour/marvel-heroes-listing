import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

const MATERIAL_MODULES = [MatToolbarModule, MatIconModule, MatButtonModule]

@Component({
  selector: 'app-toolbar',
  imports: [MATERIAL_MODULES],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  onCreateNewHeroEvent = output<void>();

  emitClick(): void {
    this.onCreateNewHeroEvent.emit();
  }
}
