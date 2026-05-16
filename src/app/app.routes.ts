import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full'
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('./features/character-list/character-list.component').then(
        (module) => module.CharacterListComponent
      )
  },
  {
    path: 'characters/:id',
    loadComponent: () =>
      import('./features/character-sheet/character-sheet.component').then(
        (module) => module.CharacterSheetComponent
      )
  }
];