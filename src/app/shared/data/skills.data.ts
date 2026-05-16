export interface SkillDefinition {
  index: string;
  name: string;
  abilityIndex: string;
}

export const SKILLS: SkillDefinition[] = [
  { index: 'skill-acrobatics',      name: 'Acrobatics',      abilityIndex: 'dex' },
  { index: 'skill-animal-handling', name: 'Animal Handling', abilityIndex: 'wis' },
  { index: 'skill-arcana',          name: 'Arcana',          abilityIndex: 'int' },
  { index: 'skill-athletics',       name: 'Athletics',       abilityIndex: 'str' },
  { index: 'skill-deception',       name: 'Deception',       abilityIndex: 'cha' },
  { index: 'skill-history',         name: 'History',         abilityIndex: 'int' },
  { index: 'skill-insight',         name: 'Insight',         abilityIndex: 'wis' },
  { index: 'skill-intimidation',    name: 'Intimidation',    abilityIndex: 'cha' },
  { index: 'skill-investigation',   name: 'Investigation',   abilityIndex: 'int' },
  { index: 'skill-medicine',        name: 'Medicine',        abilityIndex: 'wis' },
  { index: 'skill-nature',          name: 'Nature',          abilityIndex: 'int' },
  { index: 'skill-perception',      name: 'Perception',      abilityIndex: 'wis' },
  { index: 'skill-performance',     name: 'Performance',     abilityIndex: 'cha' },
  { index: 'skill-persuasion',      name: 'Persuasion',      abilityIndex: 'cha' },
  { index: 'skill-religion',        name: 'Religion',        abilityIndex: 'int' },
  { index: 'skill-sleight-of-hand', name: 'Sleight of Hand', abilityIndex: 'dex' },
  { index: 'skill-stealth',         name: 'Stealth',         abilityIndex: 'dex' },
  { index: 'skill-survival',        name: 'Survival',        abilityIndex: 'wis' },
];