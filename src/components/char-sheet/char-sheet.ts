import { BaseComponent } from '@/components/base';
import {
  textarea,
  input,
  label,
  form,
  div,
  span,
  details,
  summary,
} from '@/components/utils';
import { LesserStats } from '../lesser-stats/lesser-stats';
import { MainStats } from '../main-stats/main-stats';
import { Skills } from '../skills/skills';
import { RollDiceTray } from '../roll-dice-tray/roll-dice-tray';
import type { Character } from '@/models/character';
import {
  getCharDataFromStorage,
  setCharDataToStorage,
} from '@/utils/char-data';
import styles from './char-sheet.module.css';
import { CUSTOM_EVENTS } from '@/models/constants';

export class CharSheet extends BaseComponent<'div'> {
  private character: Character = getCharDataFromStorage();

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

  private rollDiceTray = new RollDiceTray();

  private lesserStats = new LesserStats(
    this.character ?? null,
    this.rollDiceTray.makeRoll.bind(this.rollDiceTray),
  );

  private skills = new Skills(this.character ?? null);

  public form: BaseComponent<'form'> = form(
    { classes: [styles.form] },
    div(
      { classes: [styles.container] },
      label({ htmlFor: 'name' }, span({ text: 'ИМЯ ПЕРСОНАЖА' })),
      div({ classes: [styles.flexWrapperName] }, this.nameInput),
    ),

    this.mainStats,
    this.lesserStats,
    this.rollDiceTray,
    this.skills,

    div(
      { classes: [styles.container] },
      details(
        { open: true },
        summary({ classes: [styles.summary], text: 'ЗНАЧИМЫЕ ПРЕДМЕТЫ' }),
        div({ classes: [styles.flexWrapper] }, this.itemsInput),
      ),
    ),

    div(
      { classes: [styles.container] },
      details(
        { open: true },
        summary({ classes: [styles.summary], text: 'ДРУГОЕ' }),
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

    this.form.addListener('submit', (e: Event) => {
      e.preventDefault();
    });

    this.form.addListener('input', () => {
      this.updateCharData();
      setCharDataToStorage(this.character);
    });

    this.rollDiceTray.rollInput.addListener('input', () => {
      this.updateCharData();
      setCharDataToStorage(this.character);
    });

    window.addEventListener(CUSTOM_EVENTS.SNAPSHOT_LOADED, () => {
      const charData = getCharDataFromStorage();
      this.updateCharListFields(charData);
    });
  }

  public updateCharData() {
    this.character.name = this.nameInput.getElement().value.trim();
    this.character.maxVitality = this.mainStats.maxVitalityInput
      .getElement()
      .value.trim();
    this.character.vitality = this.mainStats.vitalityInput
      .getElement()
      .value.trim();
    this.character.physical = this.mainStats.physicalInput
      .getElement()
      .value.trim();
    this.character.mental = this.mainStats.mentalInput
      .getElement()
      .value.trim();
    this.character.armor = this.lesserStats.armorInput
      .getElement()
      .value.trim();
    this.character.damageModifier = this.lesserStats.damageInput
      .getElement()
      .value.trim();
    this.character.diceRoll = this.rollDiceTray.rollInput
      .getElement()
      .value.trim();
    this.character.items = this.itemsInput.getElement().value.trim();
    this.character.skills = this.skills.getSkills();
    this.character.other = this.otherInput.getElement().value.trim();

    const charData = getCharDataFromStorage();
    this.character.id = charData.id ?? '';
    this.character.timestamp = charData.timestamp ?? '';
  }

  public updateCharListFields(character: Character) {
    this.nameInput.getElement().value = character.name ?? '';
    this.mainStats.maxVitalityInput.getElement().value =
      character.maxVitality ?? '';
    this.mainStats.vitalityInput.getElement().value = character.vitality ?? '';
    this.mainStats.physicalInput.getElement().value = character.physical ?? '';
    this.mainStats.mentalInput.getElement().value = character.mental ?? '';
    this.lesserStats.armorInput.getElement().value = character.armor ?? '';
    this.lesserStats.damageInput.getElement().value =
      character.damageModifier ?? '';
    this.rollDiceTray.rollInput.getElement().value = character.diceRoll ?? '';
    this.itemsInput.getElement().value = character.items ?? '';
    this.skills.updateSkills(character.skills);
    this.otherInput.getElement().value = character.other ?? '';

    this.updateCharData();
  }
}
