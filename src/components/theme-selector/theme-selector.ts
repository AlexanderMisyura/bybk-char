import { BaseComponent } from '../base';
import { button, option, span, selectedcontent } from '../utils';
import { STORAGE_KEY } from '@/models/constants';
import styles from './theme-selector.module.css';
import { createSvgChunk } from '@/utils/create-svg-chunk';

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

  // @ts-expect-error
  private selectedContent: BaseComponent<'selectedcontent'> = selectedcontent({
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
        // @ts-expect-error
        this.selectedContent.addClasses(
          styles.selectedContent,
          styles.icon,
          styles[`${this.selectedTheme}Icon`],
        ),
      ),
      ...Object.values(this.options).map((themeOption) =>
        option({
          value: themeOption,
          classes: [styles.option],
        }).appendSingleSVG(
          createSvgChunk(`icon-${themeOption}`, {
            classes: [styles.themeIcon],
          }),
        ),
      ),
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
