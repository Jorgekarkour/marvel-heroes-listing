import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { GridComponent } from '@components/grid/grid.component';
import { ModalComponent } from '@components/modal/modal.component';
import { GridAction } from '@models/gridAction.model';
import { Hero } from '@models/hero.model';
import { HeroService } from '@services/hero/hero.service';
import { ModalService } from '@services/modal/modal.service';


@Component({
  selector: 'app-hero-dashboard',
  imports: [GridComponent],
  templateUrl: './hero-dashboard.component.html'
})
export class HeroDashboardComponent<T> implements OnInit {
  heroes = signal<Hero[]>([]);
  displayedColumns: string[] = ['name', 'gender', 'citizenship','skills', 'memberOf', 'action'];
  sortables: string[] = ['name', 'gender','citizenship', 'skills', 'memberOf'];
  private readonly _heroService = inject(HeroService);
  private readonly _modalService = inject(ModalService);

  constructor () {
    effect(() => {
      this.heroes.set(this._heroService.heroes());
    })
  }

  ngOnInit(): void {
    const persistedHeroes = this._heroService.getHeroes();
    if (persistedHeroes.length > 0) {
      this._heroService.heroes.set(persistedHeroes);
    } else {
      this._heroService.fetchHeroesFromJson().subscribe( data => {
        this.heroes.set(data);
        this._heroService.saveHeroes(data);
      })
    }
  }

  onClickAction(actionEvent: GridAction): void {
    const actionHandlers: { [key: string]: (data: any) => void } = {
      delete: this.deleteHero.bind(this),
      showInfo: this.openHeroInfo.bind(this),
      edit: this.openEditForm.bind(this),
    };
  
    const handler = actionHandlers[actionEvent.action];
    if (handler) {
      handler(actionEvent.data);
    }
  }

  deleteHero(hero: Hero) {
    const confirmation = confirm('Are you sure you want to delete this hero: ' + hero.name);
    if (confirmation) {
      this._heroService.deleteHero(hero.id);
    }
  }

  openEditForm(data: Hero): void {
    this._modalService.openModal<ModalComponent>(ModalComponent, data, true);
  }

  openHeroInfo(data: Hero): void {
    this._modalService.openModal<ModalComponent>(ModalComponent, data, false);
  }

}
