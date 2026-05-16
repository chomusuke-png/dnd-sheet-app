import { Component, input, output, computed, signal } from '@angular/core';
import { UpperCasePipe, SlicePipe } from '@angular/common';

import { SKILLS, SkillDefinition } from '../../../../shared/data/skills.data';
import { AbilityModifiers } from '../../../../core/services/character-stats.service';
import { ClassData } from '../../../../shared/models/dnd5e.model';

@Component({
  selector: 'app-skills',
  imports: [UpperCasePipe, SlicePipe],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
  readonly modifiers = input.required<AbilityModifiers>();
  readonly proficiencyBonus = input.required<number>();
  readonly classData = input<ClassData | null>(null);
  readonly selectedProficiencies = input<string[]>([]);
  readonly proficienciesChange = output<string[]>();

  protected readonly skills = SKILLS;

  protected readonly availableSkills = computed(() => {
    const classData = this.classData();
    if (!classData || !classData.proficiency_choices?.length) return [];
    return classData.proficiency_choices[0]?.from.map(entry => entry.index) ?? [];
  });

  protected readonly maxProficiencies = computed(() => {
    const classData = this.classData();
    if (!classData || !classData.proficiency_choices?.length) return 0;
    return classData.proficiency_choices[0]?.choose ?? 0;
  });

  protected isAvailable(skillIndex: string): boolean {
    const available = this.availableSkills();
    return available.length === 0 || available.includes(skillIndex);
  }

  protected isProficient(skillIndex: string): boolean {
    return this.selectedProficiencies().includes(skillIndex);
  }

  protected toggleProficiency(skillIndex: string): void {
    if (!this.isAvailable(skillIndex)) return;

    const current = [...this.selectedProficiencies()];
    const existingIndex = current.indexOf(skillIndex);

    if (existingIndex >= 0) {
      current.splice(existingIndex, 1);
    } else {
      if (current.length >= this.maxProficiencies() && this.maxProficiencies() > 0) return;
      current.push(skillIndex);
    }

    this.proficienciesChange.emit(current);
  }

  protected getSkillValue(skill: SkillDefinition): number {
    const modifiers = this.modifiers();
    const abilityModifier = modifiers[skill.abilityIndex as keyof AbilityModifiers] ?? 0;
    const proficiencyBonus = this.isProficient(skill.index) ? this.proficiencyBonus() : 0;
    return abilityModifier + proficiencyBonus;
  }

  protected formatModifier(value: number): string {
    return value >= 0 ? `+${value}` : `${value}`;
  }
}