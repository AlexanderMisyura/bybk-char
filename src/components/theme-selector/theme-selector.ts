import { BaseComponent } from '../base';
import { button, option, selectedcontent } from '../utils';
import { STORAGE_KEY } from '@/models/constants';
import { createSvgChunk } from '@/utils/create-svg-chunk';
import { THEME_OPTIONS } from '@/models/constants';
import styles from './theme-selector.module.css';

const themeOptionsRu = {
  light: 'Светлая',
  dark: 'Темная',
  system: 'Системная',
};

export class ThemeSelector extends BaseComponent<'select'> {
  private options = THEME_OPTIONS;

  private selectedTheme: keyof typeof THEME_OPTIONS;

  // @ts-expect-error
  private selectedContent: BaseComponent<'selectedcontent'> = CSS.supports(
    'appearance',
    'base-select',
  )
    ? selectedcontent({
        classes: [styles.selectedContent],
      })
    : null;

  constructor() {
    super({
      elementTag: 'select',
      classes: [styles.selector],
      title: 'Выбор темы',
      ariaLabel: 'Выбор темы',
    });

    this.selectedTheme =
      (localStorage.getItem(STORAGE_KEY.THEME) as keyof typeof THEME_OPTIONS) ??
      this.options.system;

    const innerButton = button({});
    if (this.selectedContent) {
      innerButton.appendChildren(
        // @ts-expect-error
        this.selectedContent.addClasses(
          styles.selectedContent,
          styles.icon,
          styles[`${this.selectedTheme}Icon`],
        ),
      );
    }

    this.appendChildren(
      innerButton,
      ...Object.values(this.options).map((themeOption) => {
        const optionComponent = option({
          value: themeOption,
          classes: [styles.option],
          title: themeOptionsRu[themeOption],
          ariaLabel: `${themeOptionsRu[themeOption]} тема`,
        });

        if (CSS.supports('appearance', 'base-select')) {
          optionComponent.appendSingleSVG(
            createSvgChunk(`icon-${themeOption}`, {
              classes: [styles.themeIcon],
            }),
          );
        } else {
          optionComponent.setText(themeOptionsRu[themeOption]);
        }
        return optionComponent;
      }),
    );

    this.element.value = this.selectedTheme;
    document.documentElement.dataset.theme = this.selectedTheme;

    this.addListener('change', () => {
      this.selectedTheme = this.element.value as keyof typeof THEME_OPTIONS;

      if (this.selectedContent) {
        this.selectedContent
          .removeClasses(styles.lightIcon, styles.darkIcon, styles.systemIcon)
          .addClasses(styles[`${this.selectedTheme}Icon`]);
      }

      document.documentElement.dataset.theme = this.selectedTheme;
      localStorage.setItem(STORAGE_KEY.THEME, this.selectedTheme);
    });
  }
}
