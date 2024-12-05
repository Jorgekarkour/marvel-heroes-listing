import { Hero } from "./hero.model";

export interface GridAction {
    data: Hero;
    action: string;
}