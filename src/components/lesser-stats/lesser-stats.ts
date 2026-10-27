import type { Character } from '@/models/character';
import { BaseComponent } from '../base';
import { button, div, input, label, span } from '../utils';
import { DAMAGE_DIE } from '@/models/constants';
import styles from './lesser-stats.module.css';

export class LesserStats extends BaseComponent<'div'> {
  public damageOutput: BaseComponent<'span'>;

  public damageButton: BaseComponent<'button'>;

  public armorInput: BaseComponent<'input'>;

  public damageInput: BaseComponent<'input'>;

  constructor(character: Character) {
    super({
      elementTag: 'div',
      classes: [styles.container],
    });

    this.armorInput = input({
      value: character.armor,
      type: 'number',
      classes: [styles.textInput],
      min: '0',
      max: '2',
    });

    this.damageInput = input({
      value: character.damageModifier,
      type: 'number',
      id: 'damage',
      classes: [styles.textInput],
      step: '2',
      min: '-4',
      max: '2',
    });

    this.damageOutput = span({});

    this.damageButton = button({
      text: '🎲',
      type: 'button',
      classes: [styles.rollButton],
    });

    this.appendChildren(
      label(
        { classes: [styles.stat] },
        span({ text: 'БРОНЯ' }),
        this.armorInput,
      ),

      div(
        { classes: [styles.stat] },
        label({ htmlFor: 'damage', text: 'УРОН 1d6 +' }),
        this.damageInput,
        div({ classes: [styles.stat] }, this.damageButton, this.damageOutput),
      ),
    );

    this.damageButton.getElement().addEventListener('click', () => {
      this.damageOutput.setText('');
      const damageModifier = Number(character?.damageModifier) ?? 0;
      const diceRoll = Math.floor(Math.random() * DAMAGE_DIE) + 1;
      const result = diceRoll + damageModifier;
      setTimeout(() => {
        this.damageOutput.setText(
          `бросок 1к${DAMAGE_DIE}${Math.sign(damageModifier) >= 0 ? '+' : '-'}${Math.abs(damageModifier)} : ${diceRoll}${Math.sign(damageModifier) >= 0 ? '+' : '-'}${Math.abs(damageModifier)} = ${result}`,
        );
      }, 100);
    });
  }
}
