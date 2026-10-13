import { BaseComponent } from '../base';
import { div, input, span, label, button, img } from '../utils';
import { ThemeSelector } from '../theme-selector/theme-selector';
import bybkLogo from '../../assets/bybk-logo.png';
import styles from './header.module.css';

export class Header extends BaseComponent<'header'> {
  private saveBtn: BaseComponent<'button'> = button(
    { classes: [styles.button] },
    div({}, div({ text: 'Сохранить' }), div({ text: 'снимок' })),
  );

  private loadBtn: BaseComponent<'button'> = button(
    { classes: [styles.button] },
    div({}, div({ text: 'Загрузить' }), div({ text: 'снимок' })),
  );

  private toggleBtn: BaseComponent<'button'> = button(
    { classes: [styles.toggleButton] },
    div({ classes: [styles.toggleIcon] }),
  );

  constructor() {
    super({
      elementTag: 'header',
      classes: [styles.header],
      ariaExpanded: 'false',
    });

    const logo = img({ classes: [styles.logo], src: bybkLogo });
    const themeSelector = new ThemeSelector();

    this.toggleBtn.addListener('click', () => {
      if (this.getElement().getAttribute('aria-expanded') !== 'true') {
        this.addAttributes({ 'aria-expanded': 'true' });
      } else {
        this.addAttributes({ 'aria-expanded': 'false' });
      }
    });

    this.appendChildren(
      div(
        { classes: [styles.wrapper] },
        div(
          { classes: [styles.container] },
          logo,
          div(
            { classes: [styles.buttonContainer] },
            // this.saveBtn,
            // this.loadBtn,
            themeSelector,
            this.toggleBtn,
          ),
        ),
      ),
    );
  }
}
