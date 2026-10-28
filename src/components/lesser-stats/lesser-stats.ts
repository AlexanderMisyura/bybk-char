import type { Character } from '@/models/character';
import { BaseComponent } from '../base';
import { button, div, input, label, span } from '../utils';
import { DAMAGE_DIE } from '@/models/constants';
import styles from './lesser-stats.module.css';
import { createSvgChunk } from '@/utils/create-svg-chunk';

export class LesserStats extends BaseComponent<'div'> {
  public damageButton: BaseComponent<'button'>;

  public armorInput: BaseComponent<'input'>;

  public damageInput: BaseComponent<'input'>;

  constructor(character: Character, makeRoll: (roll: string) => void) {
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

    this.damageButton = button({
      type: 'button',
      classes: [styles.rollButton],
    }).appendSingleSVG(
      createSvgChunk('icon-dice-six', { classes: [styles.rollIcon] }),
    );

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
        div({ classes: [styles.stat] }, this.damageButton),
      ),
    );

    this.damageButton.getElement().addEventListener('click', () => {
      const damageModifier = Number(character?.damageModifier) ?? 0;

      makeRoll(
        `1d${DAMAGE_DIE}${damageModifier === 0 ? '' : `${Math.sign(damageModifier) > 0 ? ' + ' : ' - '}${Math.abs(damageModifier)}`}`,
      );
    });
  }
}
