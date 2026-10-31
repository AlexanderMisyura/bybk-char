import type { Character } from '@/models/character';
import { BaseComponent } from '../base';
import {
  button,
  details,
  div,
  form,
  input,
  p,
  summary,
  textarea,
} from '../utils';
import { createSvgChunk } from '@/utils/create-svg-chunk';
import {
  getCharDataFromStorage,
  setCharDataToStorage,
} from '@/utils/char-data';
import { modalController } from '../modal/modal';

import styles from './skills.module.css';

export class Skills extends BaseComponent<'div'> {
  private skillDescriptions: BaseComponent<'textarea'>[];

  private skillUsages: BaseComponent<'input'>[];

  private skillsContainer: BaseComponent<'div'> = div({
    classes: [styles.skillsContainer],
  });

  constructor(character: Character) {
    super({
      elementTag: 'div',
      classes: [styles.container],
    });

    this.skillDescriptions = character.skills.map((skill) =>
      this.createSkillDescription(skill),
    );
    this.skillUsages = character.skills.map((skill) =>
      this.createSkillUsage(skill),
    );

    this.skillsContainer.appendChildren(
      ...character.skills.map((_, index) =>
        this.createSkillComponent(
          this.skillDescriptions[index],
          this.skillUsages[index],
        ),
      ),
    );

    this.appendChildren(
      details(
        { open: true },
        summary({ classes: [styles.summary], text: 'УМЕНИЯ' }),
        this.skillsContainer,
        button({
          type: 'button',
          classes: [styles.addSkillButton],
          title: 'Добавить умение',
          ariaLabel: 'Добавить умение',
          onclick: () => this.addEmptySkill(),
        }).appendSingleSVG(
          createSvgChunk('icon-plus', { classes: [styles.addSkillButtonIcon] }),
        ),
      ),
    );
  }

  public getSkills(): Character['skills'] {
    return this.skillDescriptions.map((description, index) => ({
      id: description.getElement().id.replace('skill-description-', ''),
      description: description.getElement().value,
      usage: this.skillUsages[index].getElement().value,
    }));
  }

  public updateSkills(skills: Character['skills']) {
    const { skillDescriptions, skillUsages, skillComponents } = skills.reduce<{
      skillDescriptions: BaseComponent<'textarea'>[];
      skillUsages: BaseComponent<'input'>[];
      skillComponents: BaseComponent<'div'>[];
    }>(
      (acc, skill, index) => {
        acc.skillDescriptions[index] = this.createSkillDescription(skill);
        acc.skillUsages[index] = this.createSkillUsage(skill);
        acc.skillComponents[index] = this.createSkillComponent(
          acc.skillDescriptions[index],
          acc.skillUsages[index],
        );
        return acc;
      },
      {
        skillDescriptions: [],
        skillUsages: [],
        skillComponents: [],
      },
    );

    this.skillDescriptions = skillDescriptions;
    this.skillUsages = skillUsages;

    this.skillsContainer.removeChildren();
    this.skillsContainer.appendChildren(...skillComponents);
  }

  private addEmptySkill() {
    const uniqueId = crypto.randomUUID();

    const skillDescription = this.createSkillDescription({
      id: uniqueId,
      description: '',
      usage: '',
    });
    const skillUsage = this.createSkillUsage({
      id: uniqueId,
      description: '',
      usage: '',
    });

    this.skillDescriptions.push(skillDescription);
    this.skillUsages.push(skillUsage);

    const skillComponent = this.createSkillComponent(
      skillDescription,
      skillUsage,
    );
    this.skillsContainer.appendChildren(skillComponent);

    const storedCharData = getCharDataFromStorage();
    setCharDataToStorage({
      ...storedCharData,
      skills: [
        ...storedCharData.skills,
        { id: uniqueId, description: '', usage: '' },
      ],
    });
  }

  private createSkillDescription(skill: Character['skills'][number]) {
    return textarea({
      value: skill.description,
      classes: [styles.description],
      id: `skill-description-${skill.id}`,
    });
  }

  private createSkillUsage(skill: Character['skills'][number]) {
    return input({
      value: skill.usage,
      classes: [styles.textInput, styles.usageInput],
      id: `skill-usage-${skill.id}`,
      type: 'number',
      min: '0',
      max: '5',
    });
  }

  private createSkillComponent(
    skillDescription: BaseComponent<'textarea'>,
    skillUsage: BaseComponent<'input'>,
  ) {
    const skill = div(
      {
        classes: [styles.skill],
        id: skillDescription.getElement().id.replace('skill-description-', ''),
      },
      skillDescription,
      div(
        { classes: [styles.removeSkillButtonContainer] },
        button({
          classes: [styles.removeSkillButton],
          title: 'Удалить умение',
          ariaLabel: 'Удалить умение',
          onclick: () => {
            if (
              skillDescription.getElement().value !== '' ||
              skillUsage.getElement().value !== ''
            ) {
              modalController.showModal(this.getConfirmSkillDelete(skill));
              return;
            }

            this.deleteSkill(skill);
          },
        }).appendSingleSVG(
          createSvgChunk('icon-trash', {
            classes: [styles.removeSkillButtonIcon],
          }),
        ),
        skillUsage,
      ),
    );

    return skill;
  }

  private deleteSkill(skillToDelete: BaseComponent<'div'>) {
    this.skillDescriptions = this.skillDescriptions.filter(
      (skill) =>
        skill.getElement().id.replace('skill-description-', '') !==
        skillToDelete.getElement().id,
    );
    this.skillUsages = this.skillUsages.filter(
      (skill) =>
        skill.getElement().id.replace('skill-usage-', '') !== skillToDelete.getElement().id,
    );

    const storedCharData = getCharDataFromStorage();
    setCharDataToStorage({
      ...storedCharData,
      skills: storedCharData.skills.filter(
        (skill) => skill.id !== skillToDelete.getElement().id,
      ),
    });

    skillToDelete.removeSelf();
  }

  private getConfirmSkillDelete(skillToDelete: BaseComponent<'div'>) {
    return form(
      {
        classes: [styles.formFlexWrapper],
        onsubmit: (e: SubmitEvent) => {
          e.preventDefault();
          this.deleteSkill(skillToDelete);
          modalController.modalControls.closeModal();
        },
      },
      p({
        text: 'Вы уверены, что хотите удалить данное умение?',
        classes: [styles.modalHeading],
      }),
      div(
        { classes: [styles.modalButtonContainer] },
        button({
          type: 'submit',
          classes: [styles.modalButton],
          text: 'Удалить',
        }),
        button({
          type: 'button',
          classes: [styles.modalButton],
          text: 'Отмена',
          onclick: () => modalController.modalControls.closeModal(),
        }),
      ),
    );
  }
}
