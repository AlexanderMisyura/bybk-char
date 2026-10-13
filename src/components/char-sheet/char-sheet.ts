import { BaseComponent } from '@/components/base';
import { textarea, input, label, form, p, div, span } from '@/components/utils';
import { LesserStats } from '../lesser-stats/lesser-stats';
import { MainStats } from '../main-stats/main-stats';
import { Skills } from '../skills/skills';
import type { Character } from '@/models/character';
import { getCharData, setCharData } from '@/utils/char-data';
import styles from './char-sheet.module.css';

export class CharSheet extends BaseComponent<'div'> {
  private character: Character = getCharData();

  private nameInput: BaseComponent<'input'> = input({
    value: this.character?.name ?? '',
    classes: [styles.textInput, styles.name],
    id: 'name',
  });

  private itemsInput: BaseComponent<'textarea'> = textarea({
    value: this.character?.items ?? '',
    classes: [styles.largeTextInput],
  });

  private otherInput: BaseComponent<'textarea'> = textarea({
    value: this.character?.other ?? '',
    classes: [styles.largeTextInput],
  });

  private mainStats = new MainStats(this.character ?? null);

  private lesserStats = new LesserStats(this.character ?? null);

  private skills = new Skills(this.character ?? null);

  public form: BaseComponent<'form'> = form(
    { classes: [styles.form] },
    div(
      { classes: [styles.container] },
      label({ htmlFor: 'name' }, span({ text: 'ИМЯ ПЕРСОНАЖА' })),
      div(
        { classes: [styles.flexWrapperName] },
        this.nameInput,
      ),
    ),

    this.mainStats,
    this.lesserStats,

    div(
      { classes: [styles.container] },
      label(
        {},
        p({ text: 'ЗНАЧИМЫЕ ПРЕДМЕТЫ' }),
        div({ classes: [styles.flexWrapper] }, this.itemsInput),
      ),
    ),
    this.skills,
    div(
      { classes: [styles.container] },
      label(
        {},
        p({ text: 'ДРУГОЕ' }),
        div({ classes: [styles.flexWrapper] }, this.otherInput),
      ),
    ),
  );
  constructor() {
    super({
      elementTag: 'div',
      classes: [styles.charSheet],
    });

    this.appendChildren(this.form);

    this.form.getElement().addEventListener('submit', (e: Event) => {
      e.preventDefault();
    });

    this.form.getElement().addEventListener('input', () => {
      this.character.name = this.nameInput.getElement().value;
      this.character.maxVitality =
        this.mainStats.maxVitalityInput.getElement().value;
      this.character.vitality = this.mainStats.vitalityInput.getElement().value;
      this.character.physical = this.mainStats.physicalInput.getElement().value;
      this.character.mental = this.mainStats.mentalInput.getElement().value;
      this.character.armor = this.lesserStats.armorInput.getElement().value;
      this.character.damageModifier =
        this.lesserStats.damageInput.getElement().value;
      this.character.items = this.itemsInput.getElement().value;
      this.character.skills = this.skills.getSkills();
      this.character.other = this.otherInput.getElement().value;

      setCharData(this.character);
    });
  }
}
