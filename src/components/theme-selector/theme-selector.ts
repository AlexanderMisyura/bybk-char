import { BaseComponent } from '../base';
import { button, option, span } from '../utils';
import { STORAGE_KEY } from '@/models/constants';
import styles from './theme-selector.module.css';

type ThemeOptions = {
  light: 'light';
  dark: 'dark';
  system: 'system';
};

export class ThemeSelector extends BaseComponent<'select'> {
  private options: ThemeOptions = {
    light: 'light',
    dark: 'dark',
    system: 'system',
  } as const;

  private selectedTheme: ThemeOptions[keyof ThemeOptions];

  private selectedContent: BaseComponent<'span'> = span({
    classes: [styles.selectedContent],
  });

  constructor() {
    super({
      elementTag: 'select',
      classes: [styles.selector],
    });

    this.selectedTheme =
      (localStorage.getItem(
        STORAGE_KEY.THEME,
      ) as ThemeOptions[keyof ThemeOptions]) ?? this.options.system;

    this.appendChildren(
      button(
        {},
        this.selectedContent.addClasses(
          styles.selectedContent,
          styles.icon,
          styles[`${this.selectedTheme}Icon`],
        ),
      ),
      option({
        value: this.options.light,
        classes: [styles.option, styles.icon, styles.lightIcon],
      }),
      option({
        value: this.options.dark,
        classes: [styles.option, styles.icon, styles.darkIcon],
      }),
      option({
        value: this.options.system,
        classes: [styles.option, styles.icon, styles.systemIcon],
      }),
    );

    this.element.value = this.selectedTheme;
    document.documentElement.dataset.theme = this.selectedTheme;

    this.addListener('change', () => {
      this.selectedTheme = this.element
        .value as ThemeOptions[keyof ThemeOptions];

      this.selectedContent
        .removeClasses(styles.lightIcon, styles.darkIcon, styles.systemIcon)
        .addClasses(styles[`${this.selectedTheme}Icon`]);

      document.documentElement.dataset.theme = this.selectedTheme;
      localStorage.setItem(STORAGE_KEY.THEME, this.selectedTheme);
    });
  }
}
