import { BaseComponent } from '../base';
import { div, button, img } from '../utils';
import { createSvgChunk } from '@/utils/create-svg-chunk';
import { ThemeSelector } from '../theme-selector/theme-selector';
import { Snapshot } from '../snapshot/snapshot';
import { MuteToggler } from '../mute-toggler/mute-toggler';
import { rollDiceTray } from '../roll-dice-tray/roll-dice-tray';
import bybkLogo from '../../assets/bybk-logo.png';
import styles from './header.module.css';

const snapshot = new Snapshot();
const muteToggler = new MuteToggler(
  rollDiceTray.isMuted,
  rollDiceTray.toggleMute.bind(rollDiceTray),
);

export class Header extends BaseComponent<'header'> {
  private toggleBtn: BaseComponent<'button'> = button({
    classes: [styles.toggleButton],
    title: 'Открыть меню',
  }).appendSingleSVG(
    createSvgChunk('icon-open-menu', {
      classes: [styles.toggleIcon],
    }),
  );

  private inertContainer: BaseComponent<'div'> = div({
    classes: [styles.inertContainer],
    inert: true,
  });

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

      if (isExpanded && history.length > 1) {
        history.back();
      } else {
        history.pushState({ menuOpen: true }, '');
      }
    });

    window.addEventListener('popstate', () => {
      if (this.getElement().getAttribute('aria-expanded') === 'true') {
        this.addAttributes({ 'aria-expanded': 'false' });
      } else if (history.state?.menuOpen) {
        this.addAttributes({ 'aria-expanded': 'true' });
      }
    });

    window.addEventListener('keydown', (event: Event) => {
      if (
        event instanceof KeyboardEvent &&
        event?.key === 'Escape' &&
        this.getElement().getAttribute('aria-expanded') === 'true' &&
        !document.querySelector('dialog[open]')
      ) {
        this.toggleBtn.getElement().click();
      }
    });

    const openMenuIcon = createSvgChunk('icon-open-menu', {
      classes: [styles.toggleIcon],
    });
    const closeMenuIcon = createSvgChunk('icon-close-menu', {
      classes: [styles.toggleIcon],
    });

    if (history.state?.menuOpen) {
      this.addAttributes({ 'aria-expanded': 'true' });
      this.toggleBtn.getElement().replaceChildren(closeMenuIcon);
      this.toggleBtn.addAttributes({
        'aria-label': 'Закрыть меню',
        title: 'Закрыть меню',
      });
      this.inertContainer.removeAttributes(['inert']);
    }

    const expandedObserver = new MutationObserver((mutationList) => {
      if (mutationList[0].attributeName === 'aria-expanded') {
        if (this.getElement().getAttribute('aria-expanded') === 'true') {
          this.toggleBtn.getElement().replaceChildren(closeMenuIcon);
          this.toggleBtn.addAttributes({
            'aria-label': 'Закрыть меню',
            title: 'Закрыть меню',
          });
          this.inertContainer.removeAttributes(['inert']);
        } else {
          this.toggleBtn.getElement().replaceChildren(openMenuIcon);
          this.toggleBtn.addAttributes({
            'aria-label': 'Открыть меню',
            title: 'Открыть меню',
          });
          this.inertContainer.addAttributes({ inert: 'true' });
        }
      }
    });

    expandedObserver.observe(this.getElement(), {
      attributes: true,
      attributeFilter: ['aria-expanded'],
    });

    this.inertContainer.appendChildren(
      snapshot.loadOpenModalBtn,
      snapshot.saveOpenModalBtn,
      snapshot.deleteOpenModalBtn,
      muteToggler,
      div({ classes: [styles.themeSelectorContainer] }, themeSelector),
    );

    this.appendChildren(
      div(
        { classes: [styles.wrapper] },
        div(
          { classes: [styles.container] },
          img({ classes: [styles.logo], src: bybkLogo, alt: 'BYBK logo' }),
          div(
            { classes: [styles.flexWrapper] },
            div(
              { classes: [styles.buttonContainer] },
              this.inertContainer,
              this.toggleBtn,
            ),
          ),
        ),
      ),
    );
  }
}
