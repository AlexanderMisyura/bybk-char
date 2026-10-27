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
      summary({ classes: [styles.summary], text: 'КУБЫ' }),
      div(
        { classes: [styles.flexWrapper] },
        form(
          {
            classes: [styles.rollForm],
            onsubmit: async (e: Event) => {
              e.preventDefault();
              this.rollInput.getElement().setCustomValidity('');

              try {
                const roll = createRoll(this.rollInput.getElement().value);
                const result = await tray.playRoll(roll);

                this.rollResult.setText(formatRoll(roll, result));
              } catch (error) {
                this.rollInput
                  .getElement()
                  .setCustomValidity(`Ошибка ввода. Следуйте примеру: 1d6 + 2`);
                console.error(error);
              }
            },
          },
          this.rollButton,
          this.rollInput,
        ),
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

  public getRollInput() {
    return this.rollInput.getElement().value;
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
}
