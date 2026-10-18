import { BaseComponent } from '../base';
import { div, button, img } from '../utils';
import { ThemeSelector } from '../theme-selector/theme-selector';
import { Snapshot } from '../snapshot/snapshot';
import bybkLogo from '../../assets/bybk-logo.png';
import styles from './header.module.css';

const snapshot = new Snapshot();

export class Header extends BaseComponent<'header'> {
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

      const isExpanded =
        this.getElement().getAttribute('aria-expanded') === 'true';

      this.addAttributes({ 'aria-expanded': `${!isExpanded}` });

      if (window.innerWidth <= 550) {
        if (isExpanded && history.length > 1) {
          history.back();
        } else {
          history.pushState({ menuOpen: true }, '');
        }
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 550) {
        this.addAttributes({ 'aria-expanded': 'false' });
      }
    });

    window.addEventListener('popstate', () => {
      if (window.innerWidth <= 550) {
        if (this.getElement().getAttribute('aria-expanded') === 'true') {
          this.addAttributes({ 'aria-expanded': 'false' });
        } else if (history.state?.menuOpen) {
          this.addAttributes({ 'aria-expanded': 'true' });
        }
      }
    });

    this.addListener('keydown', (event: Event) => {
      if (
        event instanceof KeyboardEvent &&
        event.key === 'Escape' &&
        this.getElement().getAttribute('aria-expanded') === 'true'
      ) {
        this.toggleBtn.getElement().click();
      }
    });

    if (window.innerWidth <= 550 && history.state?.menuOpen) {
      this.addAttributes({ 'aria-expanded': 'true' });
    }

    this.appendChildren(
      div(
        { classes: [styles.wrapper] },
        div(
          { classes: [styles.container] },
          logo,
          div(
            { classes: [styles.flexWrapper] },
            div(
              { classes: [styles.buttonContainer] },
              snapshot.saveOpenModalBtn,
              snapshot.loadOpenModalBtn,
              div({ classes: [styles.themeSelectorContainer] }, themeSelector),
              this.toggleBtn,
            ),
          ),
        ),
      ),
    );
  }
}
