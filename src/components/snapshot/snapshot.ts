import { BaseComponent } from '../base';
import {
  button,
  datalist,
  div,
  form,
  input,
  label,
  option,
  p,
  select,
  span,
} from '../utils';
import { modalController } from '../modal/modal';
import {
  checkSnapshotExists,
  getCharDataFromStorage,
  getSnapshotsFromStorage,
  setSnapshotToStorage,
  setCharDataToStorage,
  getSingleSnapshotFromStorage,
  isCharDataSameAsSnapshot,
} from '../../utils/char-data';

import styles from './snapshot.module.css';
import { CUSTOM_EVENTS } from '@/models/constants';

export class Snapshot extends BaseComponent<'div'> {
  private snapshotNameIdInput: BaseComponent<'input'> = input({
    value: (getCharDataFromStorage().id || getCharDataFromStorage().name) ?? '',
    classes: [styles.textInput],
    id: 'snapshot-name-id',
    required: true,
  });

  private snapshotSelect: BaseComponent<'select'> = select({
    classes: [styles.selector],
    id: 'snapshot-select',
    required: true,
  });

  public saveOpenModalBtn: BaseComponent<'button'> = button({
    classes: [styles.button],
    text: 'Сохранить',
    onclick: () => {
      modalController.showModal(this.getSnapshotSaveForm(), {
        hasCloseButton: false,
      });
    },
  });

  public loadOpenModalBtn: BaseComponent<'button'> = button({
    classes: [styles.button],
    text: 'Загрузить',
    onclick: () => {
      modalController.showModal(this.getSnapshotLoadForm(), {
        hasCloseButton: false,
      });
    },
  });

  private modalCallback: ((event?: Event) => void) | null = null;

  constructor() {
    super({
      elementTag: 'div',
      classes: [styles.container],
    });
  }

  private getNameIdDatalist(): BaseComponent<'datalist'> {
    return datalist(
      {
        id: 'snapshot-name-id-datalist',
      },
      ...getSnapshotsFromStorage().map((snapshot) =>
        option({ value: snapshot.id }),
      ),
    );
  }

  private getSnapshotLoadForm() {
    const snapshots = getSnapshotsFromStorage();

    if (!snapshots.length) {
      return div(
        { classes: [styles.formFlexWrapper] },
        p({
          text: 'На этом устройстве нет сохраненных листов персонажа',
          classes: [styles.modalHeading],
        }),
        div(
          { classes: [styles.buttonContainer] },
          button({
            classes: [styles.button],
            text: 'Закрыть',
            onclick: () => modalController.modalControls.closeModal(),
          }),
        ),
      );
    }

    const currentCharData = getCharDataFromStorage();
    const savedSnapshot = snapshots.find(
      (snapshot) => snapshot.id === currentCharData.id,
    );

    if (
      !currentCharData.id ||
      JSON.stringify(currentCharData) !== JSON.stringify(savedSnapshot)
    ) {
      return div(
        { classes: [styles.formFlexWrapper] },
        p({
          text: 'Текущие данные не сохранены. При загрузке листа вы потеряете их. Хотите сохранить?',
          classes: [styles.modalHeading],
        }),
        div(
          { classes: [styles.buttonContainer] },
          button({
            type: 'button',
            classes: [styles.button],
            text: 'Сохранить',
            onclick: () => {
              const getSnapshotLoadForm = this.getSnapshotLoadForm.bind(this);
              this.modalCallback = (event) => {
                event?.preventDefault();
                modalController.renewModalContent(getSnapshotLoadForm());
                this.modalCallback = null;
              };
              modalController.renewModalContent(this.getSnapshotSaveForm(), {
                beforeCloseCallback: this.modalCallback,
              });
            },
          }),
          button({
            type: 'button',
            classes: [styles.button],
            text: 'Продолжить без сохранения',
            onclick: () => {
              modalController.renewModalContent(this.getChooseSnapshotForm());
            },
          }),
          button({
            classes: [styles.button],
            text: 'Отмена',
            onclick: () => modalController.modalControls.closeModal(),
          }),
        ),
      );
    }

    return this.getChooseSnapshotForm();
  }

  private getChooseSnapshotForm(): BaseComponent<'form'> {
    return form(
      {
        classes: [styles.formFlexWrapper],
        onsubmit: (e: Event) => {
          e.preventDefault();
          this.loadSnapshot();

          modalController.modalControls.closeModal();
        },
      },
      p({
        text: 'ЗАГРУЗИТЬ ЛИСТ ПЕРСОНАЖА',
        classes: [styles.modalHeading],
      }),
      this.getSnapshotSelect(),
      div(
        { classes: [styles.buttonContainer] },
        button({
          type: 'submit',
          classes: [styles.button],
          text: 'Загрузить',
        }),
        button({
          type: 'button',
          classes: [styles.button],
          text: 'Отмена',
          onclick: () => modalController.modalControls.closeModal(),
        }),
      ),
    );
  }

  private getSnapshotSaveForm(): BaseComponent<'form'> {
    if (!this.snapshotNameIdInput.getElement().value) {
      this.snapshotNameIdInput.getElement().value =
        (getCharDataFromStorage().id || getCharDataFromStorage().name) ?? '';
    }

    this.snapshotNameIdInput.addAttributes({
      list: this.getNameIdDatalist().getElement().id,
    });

    this.snapshotNameIdInput.getElement().select();

    return form(
      {
        classes: [styles.formFlexWrapper],
        onsubmit: (e: Event) => {
          e.preventDefault();

          this.snapshotNameIdInput.getElement().value = this.snapshotNameIdInput
            .getElement()
            .value.trim();
          const snapshotName = this.snapshotNameIdInput.getElement().value;

          if (!snapshotName) return;

          if (
            checkSnapshotExists(snapshotName) &&
            !isCharDataSameAsSnapshot(getCharDataFromStorage(), snapshotName)
          ) {
            modalController.renewModalContent(
              this.getConfirmExistedForm(snapshotName),
              {
                beforeCloseCallback: this.modalCallback ?? null,
              },
            );

            return;
          }

          this.saveSnapshot(snapshotName);
          modalController.modalControls.closeModal();
        },
      },
      p({
        text: 'СОХРАНИТЬ ЛИСТ ПЕРСОНАЖА',
        classes: [styles.modalHeading],
      }),
      div(
        { classes: [styles.flexWrapper] },
        label(
          {
            htmlFor: this.snapshotNameIdInput.getElement().id,
            classes: [styles.flexWrapper],
          },
          span({ text: 'Название' }),
          this.snapshotNameIdInput,
          this.getNameIdDatalist(),
        ),
      ),
      div(
        { classes: [styles.buttonContainer] },
        button({
          type: 'submit',
          classes: [styles.button],
          text: 'Сохранить',
        }),
        button({
          type: 'button',
          classes: [styles.button],
          text: 'Отмена',
          onclick: () => modalController.modalControls.closeModal(),
        }),
      ),
    );
  }

  private getConfirmExistedForm(snapshotName: string) {
    return form(
      {
        classes: [styles.formFlexWrapper],
        onsubmit: (e: Event) => {
          e.preventDefault();

          this.saveSnapshot(snapshotName);
          modalController.modalControls.closeModal();
        },
      },
      p({
        text: 'Лист персонажа с таким названием уже существует, и его данные отличаются. Перезаписать?',
        classes: [styles.modalHeading],
      }),
      div(
        { classes: [styles.buttonContainer] },
        button({
          type: 'submit',
          classes: [styles.button],
          text: 'Перезаписать',
        }),
        button({
          type: 'button',
          classes: [styles.button],
          text: 'Отмена',
          onclick: () => modalController.modalControls.closeModal(),
        }),
      ),
    );
  }

  private getSnapshotSelect(): BaseComponent<'select'> {
    const snapshots = getSnapshotsFromStorage().toSorted((a, b) =>
      a.name.localeCompare(b.name),
    );

    this.snapshotSelect.getElement().value = snapshots[0].id;
    this.snapshotSelect.getElement().replaceChildren(
      ...snapshots.map((snapshot) =>
        option({
          value: snapshot.id,
          text: snapshot.id,
          classes: [styles.option],
        }).getElement(),
      ),
    );

    return this.snapshotSelect;
  }

  private saveSnapshot(snapshotName: string) {
    const timestamp = Date.now().toString();
    const character = getCharDataFromStorage();

    setSnapshotToStorage({
      ...character,
      id: snapshotName,
      timestamp,
    });
    setCharDataToStorage({
      ...character,
      id: snapshotName,
      timestamp,
    });
  }

  private loadSnapshot() {
    const snapshotId = this.snapshotSelect.getElement().value;
    const snapshot = getSingleSnapshotFromStorage(snapshotId);

    if (!snapshot) {
      modalController.modalControls.showModal(
        div(
          { classes: [styles.flexWrapper] },
          p({
            text: 'Произошла ошибка. Лист персонажа не найден',
            classes: [styles.modalHeading],
          }),
          button({
            classes: [styles.button],
            text: 'Закрыть',
            onclick: () => modalController.modalControls.closeModal(),
          }),
        ),
      );

      return;
    }

    this.snapshotNameIdInput.getElement().value = snapshot.id;
    console.log(snapshot.id);
    setCharDataToStorage(snapshot);

    window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SNAPSHOT_LOADED));
  }
}
