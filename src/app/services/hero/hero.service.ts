import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero, HeroResponse } from '@models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private dataKey = 'heroes';
  private jsonUrl = '/data/wikipedia_marvel_data.json';

  private readonly _http = inject(HttpClient);

  private _generateUniqueId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
  heroes = signal<Hero[]>([]);

  fetchHeroesFromJson(): Observable<Hero[]> {
    return new Observable(observer => {
      this._http.get<HeroResponse[]>(this.jsonUrl).subscribe( data => {
       const heroes = data.map(hero => ({
         name: hero.nameLabel,
         gender: hero.genderLabel,
         citizenship: hero.citizenshipLabel,
         skills: hero.skillsLabel,
         occupation: hero.occupationLabel,
         memberOf: hero.memberOfLabel,
         creator: hero.creatorLabel,
         id: this._generateUniqueId(),
       }));
       this.saveHeroes(heroes);
       observer.next(heroes);
       observer.complete();
     });
    })
  }

  saveHeroes(heroes: Hero[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(heroes));
    this.heroes.set(heroes);
    
  }

  getHeroes(): Hero[] {
    const storedHeroes = localStorage.getItem(this.dataKey);
    return storedHeroes ? JSON.parse(storedHeroes) : [];
  }
  
  addHero(hero: Hero): void {
    hero.id = this._generateUniqueId();
    this.heroes.update(currentHeroes => [hero, ...currentHeroes]);
    localStorage.setItem(this.dataKey, JSON.stringify(this.heroes()));
  }
  
  updateHero(updatedHero: Hero): void {
    this.heroes.update(currentHeroes =>
      currentHeroes.map(hero => hero.id === updatedHero.id ? updatedHero : hero)
    );
    localStorage.setItem(this.dataKey, JSON.stringify(this.heroes()));
  }
  
  deleteHero(id: string): void {
    this.heroes.update(currentHeroes =>
      currentHeroes.filter(hero => hero.id !== id)
    );
    localStorage.setItem(this.dataKey, JSON.stringify(this.heroes()));
  }
}
