import { BaseComponent } from '../base';
import { div, button, img } from '../utils';
import { createSvgChunk } from '@/utils/create-svg-chunk';
import { ThemeSelector } from '../theme-selector/theme-selector';
import { Snapshot } from '../snapshot/snapshot';
import bybkLogo from '../../assets/bybk-logo.png';
import styles from './header.module.css';

const snapshot = new Snapshot();

export class Header extends BaseComponent<'header'> {
  private toggleBtn: BaseComponent<'button'> = button({
    classes: [styles.toggleButton],
  }).appendSingleSVG(
    createSvgChunk('icon-right-move', {
      classes: [styles.toggleIcon],
    }),
  );

  constructor() {
    super({
      elementTag: 'header',
      classes: [styles.header],
      ariaExpanded: 'false',
    });

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

    const openMenuIcon = createSvgChunk('icon-right-move', {
      classes: [styles.toggleIcon],
    });
    const closeMenuIcon = createSvgChunk('icon-left-alignment', {
      classes: [styles.toggleIcon],
    });

    const expandedObserver = new MutationObserver((mutationList) => {
      if (mutationList[0].attributeName === 'aria-expanded') {
        if (this.getElement().getAttribute('aria-expanded') === 'true') {
          this.toggleBtn.getElement().replaceChildren(closeMenuIcon);
        } else {
          this.toggleBtn.getElement().replaceChildren(openMenuIcon);
        }
      }
    });

    expandedObserver.observe(this.getElement(), {
      attributes: true,
      attributeFilter: ['aria-expanded'],
    });

    this.appendChildren(
      div(
        { classes: [styles.wrapper] },
        div(
          { classes: [styles.container] },
          img({ classes: [styles.logo], src: bybkLogo }),
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
