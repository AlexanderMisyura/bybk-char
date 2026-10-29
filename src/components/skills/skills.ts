import type { Character } from '@/models/character';
import { BaseComponent } from '../base';
import { details, div, input, summary, textarea } from '../utils';

import { SKILLS_NUMBER } from '@/models/constants';
import styles from './skills.module.css';
import charStyles from '../char-sheet/char-sheet.module.css';

export class Skills extends BaseComponent<'div'> {
  public skillDescriptions: BaseComponent<'textarea'>[];

  public skillsUsage: BaseComponent<'input'>[];

  constructor(character: Character | null) {
    super({
      elementTag: 'div',
      classes: [styles.container],
    });

    this.skillDescriptions = Array.from({ length: SKILLS_NUMBER }).map(
      (_, index) =>
        textarea({
          value: character?.skills[index]?.description ?? '',
          classes: [styles.description],
          id: `skill-description-${index}`,
        }),
    );

    this.skillsUsage = Array.from({ length: SKILLS_NUMBER }).map((_, index) =>
      input({
        value: character?.skills[index]?.usage ?? '',
        classes: [charStyles.textInput, styles.usageInput],
        id: `skill-usage-${index}`,
        type: 'number',
        min: '0',
        max: '5',
      }),
    );

    this.appendChildren(
      details(
        { open: true },
        summary({ classes: [styles.summary], text: 'УМЕНИЯ' }),
        div(
          { classes: [styles.skillsContainer] },
          ...Array.from({ length: SKILLS_NUMBER }).map((_, index) =>
            div(
              { classes: [styles.skill] },
              this.skillDescriptions[index],
              this.skillsUsage[index],
            ),
          ),
        ),
      ),
    );
  }

  public getSkills(): Character['skills'] {
    return this.skillDescriptions.map((description, index) => ({
      description: description.getElement().value,
      usage: this.skillsUsage[index].getElement().value,
    }));
  }

  public updateSkills(skills: Character['skills']) {
    this.skillDescriptions.forEach(
      (description, index) =>
        (description.getElement().value = skills[index].description),
    );
    this.skillsUsage.forEach(
      (usage, index) => (usage.getElement().value = skills[index].usage),
    );
  }
}
