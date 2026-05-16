import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CharacterService } from '../../core/services/character.service';
import { Character } from '../../shared/models/character.model';

@Component({
  selector: 'app-character-list',
  imports: [RouterLink],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent implements OnInit {
  private readonly characterService = inject(CharacterService);

  protected readonly characters = signal<Character[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCharacters();
  }

  private loadCharacters(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.characterService.getAll().subscribe({
      next: (characters) => {
        this.characters.set(characters);
        this.isLoading.set(false);
      },
      error: (exception) => {
        this.error.set(exception.message);
        this.isLoading.set(false);
      }
    });
  }
}