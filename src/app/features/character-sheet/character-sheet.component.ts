import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { CharacterService } from '../../core/services/character.service';
import { Dnd5eService } from '../../core/services/dnd5e.service';
import { CharacterStatsService, AbilityModifiers } from '../../core/services/character-stats.service';
import { Character } from '../../shared/models/character.model';
import { Dnd5eListEntry, RaceData, ClassData } from '../../shared/models/dnd5e.model';

@Component({
  selector: 'app-character-sheet',
  imports: [ReactiveFormsModule, TitleCasePipe, RouterLink],
  templateUrl: './character-sheet.component.html',
  styleUrl: './character-sheet.component.css'
})
export class CharacterSheetComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly characterService = inject(CharacterService);
  private readonly dnd5eService = inject(Dnd5eService);
  private readonly statsService = inject(CharacterStatsService);
  private readonly subscriptions = new Subscription();

  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly characterId = signal<number | null>(null);

  // Dropdowns
  protected readonly races = signal<Dnd5eListEntry[]>([]);
  protected readonly classes = signal<Dnd5eListEntry[]>([]);

  // Datos procesados de raza y clase seleccionadas
  protected readonly selectedRaceData = signal<RaceData | null>(null);
  protected readonly selectedClassData = signal<ClassData | null>(null);

  // Stats calculadas reactivamente
  protected readonly abilityScores = signal({
    strength: 10, dexterity: 10, constitution: 10,
    intelligence: 10, wisdom: 10, charisma: 10,
  });

  protected readonly level = signal(1);

  protected readonly modifiers = computed(() =>
    this.statsService.computeModifiers(this.abilityScores())
  );

  protected readonly proficiencyBonus = computed(() =>
    this.statsService.computeProficiencyBonus(this.level())
  );

  protected readonly initiative = computed(() => this.modifiers().dexterity);

  protected readonly passivePerception = computed(() =>
    10 + this.modifiers().wisdom
  );

  protected readonly spellcastingAbility = computed(() =>
    this.selectedClassData()?.spellcasting_ability ?? null
  );

  protected readonly spellSaveDC = computed(() => {
    const ability = this.spellcastingAbility();
    if (!ability) return null;
    const modifiers = this.modifiers();
    const modifier = modifiers[ability as keyof AbilityModifiers] ?? 0;
    return this.statsService.computeSpellSaveDC(modifier, this.proficiencyBonus());
  });

  protected readonly spellAttackBonus = computed(() => {
    const ability = this.spellcastingAbility();
    if (!ability) return null;
    const modifiers = this.modifiers();
    const modifier = modifiers[ability as keyof AbilityModifiers] ?? 0;
    return this.statsService.computeSpellAttackBonus(modifier, this.proficiencyBonus());
  });

  protected readonly form: FormGroup = this.formBuilder.group({
    name:                ['', Validators.required],
    race:                ['', Validators.required],
    class:               ['', Validators.required],
    background:          [''],
    alignment:           [''],
    experience_points:   [0],
    level:               [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    strength:            [10, [Validators.required, Validators.min(1), Validators.max(30)]],
    dexterity:           [10, [Validators.required, Validators.min(1), Validators.max(30)]],
    constitution:        [10, [Validators.required, Validators.min(1), Validators.max(30)]],
    intelligence:        [10, [Validators.required, Validators.min(1), Validators.max(30)]],
    wisdom:              [10, [Validators.required, Validators.min(1), Validators.max(30)]],
    charisma:            [10, [Validators.required, Validators.min(1), Validators.max(30)]],
    max_hit_points:      [0],
    current_hit_points:  [0],
    temporary_hit_points:[0],
    armor_class:         [10],
    speed:               [30],
    hit_dice:            [''],
    is_custom_race:      [false],
    is_custom_class:     [false],
    personality_traits:  [''],
    ideals:              [''],
    bonds:               [''],
    flaws:               [''],
    backstory:           [''],
  });

  protected readonly abilityNames = [
    'strength', 'dexterity', 'constitution',
    'intelligence', 'wisdom', 'charisma'
  ] as const;

  ngOnInit(): void {
    this.loadDropdowns();
    this.watchFormChanges();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.characterId.set(Number(id));
      this.loadCharacter(Number(id));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadDropdowns(): void {
    this.subscriptions.add(
      this.dnd5eService.getRaces().subscribe({
        next: (response) => this.races.set(response.results),
        error: (exception) => this.error.set(exception.message)
      })
    );

    this.subscriptions.add(
      this.dnd5eService.getClasses().subscribe({
        next: (response) => this.classes.set(response.results),
        error: (exception) => this.error.set(exception.message)
      })
    );
  }

  private watchFormChanges(): void {
    // Sincroniza ability scores y level con signals para cálculos reactivos
    this.subscriptions.add(
      this.form.valueChanges.subscribe((values) => {
        this.abilityScores.set({
          strength:     values.strength     ?? 10,
          dexterity:    values.dexterity    ?? 10,
          constitution: values.constitution ?? 10,
          intelligence: values.intelligence ?? 10,
          wisdom:       values.wisdom       ?? 10,
          charisma:     values.charisma     ?? 10,
        });
        this.level.set(values.level ?? 1);
      })
    );

    // Cuando cambia la raza, carga sus datos y aplica bonuses
    this.subscriptions.add(
      this.form.get('race')!.valueChanges.subscribe((raceIndex: string) => {
        if (!raceIndex) return;
        this.onRaceChange(raceIndex);
      })
    );

    // Cuando cambia la clase, carga sus datos y aplica hit dice
    this.subscriptions.add(
      this.form.get('class')!.valueChanges.subscribe((classIndex: string) => {
        if (!classIndex) return;
        this.onClassChange(classIndex);
      })
    );
  }

  private onRaceChange(raceIndex: string): void {
    this.dnd5eService.getRaceData(raceIndex).subscribe({
      next: (raceData) => {
        this.selectedRaceData.set(raceData);
        this.form.patchValue({ speed: raceData.speed }, { emitEvent: false });
      },
      error: (exception) => this.error.set(exception.message)
    });
  }

  private onClassChange(classIndex: string): void {
    this.dnd5eService.getClassData(classIndex).subscribe({
      next: (classData) => {
        this.selectedClassData.set(classData);

        const hitDie = classData.hit_die;
        const constitutionModifier = this.modifiers().constitution;
        const currentLevel = this.level();
        const maxHitPoints = this.statsService.computeHitPoints(
          hitDie, currentLevel, constitutionModifier
        );

        this.form.patchValue({
          hit_dice:         `${currentLevel}d${hitDie}`,
          max_hit_points:   maxHitPoints,
          current_hit_points: maxHitPoints,
        }, { emitEvent: false });
      },
      error: (exception) => this.error.set(exception.message)
    });
  }

  private loadCharacter(id: number): void {
    this.isLoading.set(true);

    this.characterService.getById(id).subscribe({
      next: (character) => {
        this.form.patchValue(character);

        if (character.race) this.onRaceChange(character.race);
        if (character.class) this.onClassChange(character.class);

        this.isLoading.set(false);
      },
      error: (exception) => {
        this.error.set(exception.message);
        this.isLoading.set(false);
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    const id = this.characterId();
    const request$ = id
      ? this.characterService.update(id, this.form.value)
      : this.characterService.create(this.form.value);

    request$.subscribe({
      next: (character: Character) => {
        this.isSaving.set(false);
        this.router.navigate(['/characters', character.id]);
      },
      error: (exception) => {
        this.error.set(exception.message);
        this.isSaving.set(false);
      }
    });
  }

  protected formatModifier(modifier: number): string {
    return this.statsService.formatModifier(modifier);
  }

  protected get isEditing(): boolean {
    return this.characterId() !== null;
  }
}