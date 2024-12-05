import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { ModalComponent } from '@components/modal/modal.component';
import { ToolbarComponent } from '@components/toolbar/toolbar.component';
import { Hero } from '@models/hero.model';
import { ModalService } from '@services/modal/modal.service';

const MATERIAL_MODULES = [MatCardModule];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent, MATERIAL_MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  private readonly _modalService = inject(ModalService);

  onClickCreateNewHero(): void {
    this._modalService.openModal<ModalComponent, Hero>(ModalComponent, {} as Hero, true);
  }
}
