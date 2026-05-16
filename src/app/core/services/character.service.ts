import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Character, CreateCharacterRequest } from '../../shared/models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly apiService = inject(ApiService);

  getAll(): Observable<Character[]> {
    return this.apiService.get<Character[]>('/characters');
  }

  getById(id: number): Observable<Character> {
    return this.apiService.get<Character>(`/characters/${id}`);
  }

  create(character: CreateCharacterRequest): Observable<Character> {
    return this.apiService.post<Character>('/characters', character);
  }

  update(id: number, character: Partial<Character>): Observable<Character> {
    return this.apiService.put<Character>(`/characters/${id}`, character);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`/characters/${id}`);
  }
}