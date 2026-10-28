import { BaseComponent } from '../base';
import { button, canvas, div, form, input, span, summary } from '../utils';
import { createRoll } from 'pollyroll';
import { createDiceTray } from 'pollyroll/render';
import { diceClacks } from 'pollyroll/sounds';
import { formatRoll } from 'pollyroll/format';
import { DICE_SKIN, THEME_OPTIONS } from '@/models/constants';
import { createSvgChunk } from '@/utils/create-svg-chunk';
import { debounce } from '@/utils/debounce';

import styles from './roll-dice-tray.module.css';
import { getCharDataFromStorage } from '@/utils/char-data';

const PADDING_SHIFT = 8;

export class RollDiceTray extends BaseComponent<'details'> {
  public rollInput: BaseComponent<'input'> = input({
    type: 'text',
    placeholder: '1d6 + 2',
    classes: [styles.rollInput],
    value: getCharDataFromStorage().diceRoll ?? '',
    oninput: () => {
      this.rollInput.getElement().setCustomValidity('');
    },
  });

  private rollButton: BaseComponent<'button'> = button({
    type: 'submit',
    classes: [styles.rollButton],
    title: 'Бросить кубы',
    ariaLabel: 'Бросить кубы',
  }).appendSingleSVG(
    createSvgChunk('icon-dice', { classes: [styles.rollIcon] }),
  );

  private rollForm: BaseComponent<'form'> = form(
    { classes: [styles.rollForm] },
    this.rollButton,
    this.rollInput,
  );

  private rollResult: BaseComponent<'span'> = span({
    classes: [styles.rollResult],
  });

  private rollCanvas: BaseComponent<'canvas'> = canvas({});

  private trayContainer: BaseComponent<'div'> = div(
    {
      classes: [styles.trayContainer],
    },
    this.rollCanvas,
  );

  constructor() {
    super({
      elementTag: 'details',
      open: true,
      classes: [styles.container],
    });

    this.appendChildren(
      summary({ classes: [styles.summary], text: 'БРОСКИ' }),
      div(
        { classes: [styles.flexWrapper] },
        this.rollForm,
        div({}, span({ text: 'Результат: ' }), this.rollResult),
        this.trayContainer,
      ),
    );

    const tray = createDiceTray(this.rollCanvas.getElement(), {
      clacks: diceClacks,
      sound: 0.5,
      dieScale: 2.5,
      skin: DICE_SKIN.WHITE_PLASTIC,
    });

    this.rollForm.addListener('submit', async (e: Event) => {
      e.preventDefault();

      try {
        const roll = createRoll(this.rollInput.getElement().value);
        const result = await tray.playRoll(roll);

        this.rollResult.setText(formatRoll(roll, result));
      } catch (error) {
        if (error instanceof Error) {
          this.rollInput
            .getElement()
            .setCustomValidity(`Ошибка ввода - ${error.message}`);
        }
      }
    });

    const themeObserver = new MutationObserver((mutationList) => {
      if (mutationList[0].attributeName === 'data-theme') {
        const theme = document.documentElement.getAttribute('data-theme');

        if (theme === THEME_OPTIONS.dark) {
          tray.setSkin(DICE_SKIN.OBSIDIAN_STONE);
        } else if (theme === THEME_OPTIONS.light) {
          tray.setSkin(DICE_SKIN.WHITE_PLASTIC);
        } else {
          const preferDark = window.matchMedia('(prefers-color-scheme: dark)');
          if (preferDark.matches) {
            tray.setSkin(DICE_SKIN.OBSIDIAN_STONE);
          } else {
            tray.setSkin(DICE_SKIN.WHITE_PLASTIC);
          }
        }
      }
    });

    themeObserver.observe(document.documentElement, {
      attributeFilter: ['data-theme'],
    });

    document.addEventListener('DOMContentLoaded', () => this.setCanvasSize());

    window.addEventListener('resize', debounce(this.setCanvasSize.bind(this)));
  }

  private setCanvasSize() {
    const containerRect = this.trayContainer
      .getElement()
      .getBoundingClientRect();

    this.rollCanvas.getElement().width =
      containerRect.width - PADDING_SHIFT * 2;
    this.rollCanvas.getElement().height =
      containerRect.height - PADDING_SHIFT * 2;
  }

  public makeRoll(roll: string) {
    this.rollInput.getElement().value = roll;
    this.rollInput.getElement().dispatchEvent(new Event('input'));
    this.rollForm.getElement().dispatchEvent(new Event('submit'));
  }
}
