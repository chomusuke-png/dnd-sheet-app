import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Dnd5eListResponse, RaceData, ClassData } from '../../shared/models/dnd5e.model';

@Injectable({
  providedIn: 'root'
})
export class Dnd5eService {
  private readonly apiService = inject(ApiService);

  getRaces(): Observable<Dnd5eListResponse> {
    return this.apiService.get<Dnd5eListResponse>('/dnd5e/races');
  }

  getRaceData(index: string): Observable<RaceData> {
    return this.apiService.get<RaceData>(`/dnd5e/races/${index}`);
  }

  getClasses(): Observable<Dnd5eListResponse> {
    return this.apiService.get<Dnd5eListResponse>('/dnd5e/classes');
  }

  getClassData(index: string): Observable<ClassData> {
    return this.apiService.get<ClassData>(`/dnd5e/classes/${index}`);
  }

  getSpells(): Observable<Dnd5eListResponse> {
    return this.apiService.get<Dnd5eListResponse>('/dnd5e/spells');
  }

  getSpell(index: string): Observable<unknown> {
    return this.apiService.get<unknown>(`/dnd5e/spells/${index}`);
  }

  getEquipment(): Observable<Dnd5eListResponse> {
    return this.apiService.get<Dnd5eListResponse>('/dnd5e/equipment');
  }

  getEquipmentItem(index: string): Observable<unknown> {
    return this.apiService.get<unknown>(`/dnd5e/equipment/${index}`);
  }
}