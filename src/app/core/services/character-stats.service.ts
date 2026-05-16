import { Injectable } from '@angular/core';

export interface AbilityModifiers {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface ComputedStats {
  modifiers: AbilityModifiers;
  proficiencyBonus: number;
  initiative: number;
  passivePerception: number;
  spellSaveDC: number;
  spellAttackBonus: number;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterStatsService {
  computeModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  computeProficiencyBonus(level: number): number {
    return Math.ceil(level / 4) + 1;
  }

  computeModifiers(scores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  }): AbilityModifiers {
    return {
      strength:     this.computeModifier(scores.strength),
      dexterity:    this.computeModifier(scores.dexterity),
      constitution: this.computeModifier(scores.constitution),
      intelligence: this.computeModifier(scores.intelligence),
      wisdom:       this.computeModifier(scores.wisdom),
      charisma:     this.computeModifier(scores.charisma),
    };
  }

  computeHitPoints(hitDie: number, level: number, constitutionModifier: number): number {
    return hitDie + constitutionModifier + (level - 1) * (Math.floor(hitDie / 2) + 1 + constitutionModifier);
  }

  computeSpellSaveDC(spellcastingAbilityModifier: number, proficiencyBonus: number): number {
    return 8 + proficiencyBonus + spellcastingAbilityModifier;
  }

  computeSpellAttackBonus(spellcastingAbilityModifier: number, proficiencyBonus: number): number {
    return spellcastingAbilityModifier + proficiencyBonus;
  }

  formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }
}