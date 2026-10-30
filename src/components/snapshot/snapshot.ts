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
  deleteSnapshotsFromStorage,
} from '../../utils/char-data';

import styles from './snapshot.module.css';
import { CUSTOM_EVENTS } from '@/models/constants';
import { createSvgChunk } from '@/utils/create-svg-chunk';

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
    title: 'Сохранить как',
    ariaLabel: 'Сохранить как',
    onclick: () => {
      modalController.showModal(this.getSnapshotSaveForm(), {
        hasCloseButton: false,
      });
    },
  })
    .appendSingleSVG(
      createSvgChunk('icon-save', {
        classes: [styles.buttonIcon],
      }),
    )
    .appendSingle(
      span({ classes: [styles.buttonText], text: 'Сохранить как' }),
    );

  public loadOpenModalBtn: BaseComponent<'button'> = button({
    classes: [styles.button],
    title: 'Загрузить',
    ariaLabel: 'Загрузить',
    onclick: () => {
      modalController.showModal(this.getSnapshotLoadForm(), {
        hasCloseButton: false,
      });
    },
  })
    .appendSingleSVG(
      createSvgChunk('icon-load', {
        classes: [styles.buttonIcon],
      }),
    )
    .appendSingle(span({ classes: [styles.buttonText], text: 'Загрузить' }));

  public deleteOpenModalBtn: BaseComponent<'button'> = button({
    classes: [styles.button],
    title: 'Удаление',
    ariaLabel: 'Удаление',
    onclick: () => {
      modalController.showModal(this.getSnapshotDeleteForm(), {
        hasCloseButton: false,
      });
    },
  })
    .appendSingleSVG(
      createSvgChunk('icon-delete', {
        classes: [styles.buttonIcon],
      }),
    )
    .appendSingle(span({ classes: [styles.buttonText], text: 'Удаление' }));

  private modalCallback: ((event?: Event) => void) | null = null;

  constructor() {
    super({
      elementTag: 'div',
      classes: [styles.container],
    });
  }

  private getConfirmDelete(snapshotNameIdsToDelete: string[]) {
    return form(
      {
        classes: [styles.formFlexWrapper],
        onsubmit: (e: SubmitEvent) => {
          e.preventDefault();
          this.deleteSnapshots(snapshotNameIdsToDelete);
          modalController.modalControls.closeModal();
        },
      },
      p({
        text: 'Удалить выбранные листы персонажа?',
        classes: [styles.modalHeading],
      }),
      div(
        {
          classes: [styles.confirmDeleteFlexWrapper],
        },
        ...snapshotNameIdsToDelete.map((snapshotNameId) => {
          return span({
            text: snapshotNameId,
            classes: [styles.deleteItem],
          });
        }),
      ),
      div(
        { classes: [styles.buttonContainer] },
        button({
          type: 'submit',
          classes: [styles.button],
          text: 'Удалить',
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

  private getSnapshotDeleteForm() {
    const snapshots = getSnapshotsFromStorage();

    if (!snapshots.length) {
      return this.getMessage(
        'На этом устройстве нет сохраненных листов персонажа',
      );
    }

    return form(
      {
        classes: [styles.formFlexWrapper],
        onsubmit: (e: SubmitEvent) => {
          e.preventDefault();

          if (e.currentTarget instanceof HTMLFormElement) {
            const snapshotsFormData = new FormData(e.currentTarget);
            const snapshotNameIdsToDelete =
              snapshotsFormData.getAll('snapshot-name-id');

            if (!snapshotNameIdsToDelete.length) {
              this.modalCallback = (event) => {
                event?.preventDefault();
                modalController.renewModalContent(this.getSnapshotDeleteForm());
                this.modalCallback = null;
              };

              modalController.renewModalContent(
                this.getMessage('Отметьте листы персонажа для удаления'),
                { beforeCloseCallback: this.modalCallback },
              );

              return;
            }

            modalController.renewModalContent(
              this.getConfirmDelete(snapshotNameIdsToDelete as string[]),
            );
          }
        },
      },
      p({
        text: 'УДАЛЕНИЕ ЛИСТОВ ПЕРСОНАЖА',
        classes: [styles.modalHeading],
      }),
      div(
        { classes: [styles.deleteFlexWrapper] },
        ...snapshots.map((snapshot) =>
          label(
            { classes: [styles.deleteLabel] },
            span({ classes: [styles.deleteLabelText], text: snapshot.id }),
            input({
              type: 'checkbox',
              name: 'snapshot-name-id',
              value: snapshot.id,
              classes: [styles.deleteCheckbox],
            }),
          ),
        ),
      ),
      div(
        { classes: [styles.buttonContainer] },
        button({
          classes: [styles.button],
          type: 'submit',
          text: 'Удалить',
        }),
        button({
          classes: [styles.button],
          type: 'button',
          text: 'Отмена',
          onclick: () => modalController.modalControls.closeModal(),
        }),
      ),
    );
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
      return this.getMessage(
        'На этом устройстве нет сохраненных листов персонажа',
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
    setCharDataToStorage(snapshot);

    window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.SNAPSHOT_LOADED));
  }

  private deleteSnapshots(snapshotNameIds: string[]) {
    deleteSnapshotsFromStorage(snapshotNameIds);

    const currentCharData = getCharDataFromStorage();
    if (currentCharData.id && snapshotNameIds.includes(currentCharData.id)) {
      setCharDataToStorage({ ...currentCharData, id: '' });
    }
  }

  private getMessage(text: string) {
    return div(
      { classes: [styles.formFlexWrapper] },
      p({
        text,
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
}
