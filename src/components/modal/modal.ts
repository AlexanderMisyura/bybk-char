import { BaseComponent } from '../base';
import { button, div } from '../utils';
import { ANIMATION_TIMING } from '@/models/constants';

import styles from './modal.module.css';

type ModalOptions = {
  canBeClosed?: boolean;
  hasCloseButton?: boolean;
  isCloseOnClickWithin?: boolean;
  isScrollBlocked?: boolean;
  needAnimationDelay?: boolean;
  beforeCloseCallback?: ((event?: Event) => void) | null;
};

class Modal extends BaseComponent<'dialog'> {
  public modalControls = {
    showModal: this.showModal.bind(this),
    closeModal: this.closeModal.bind(this),
    closeModalButton: button({
      text: 'Закрыть',
      classes: [styles.closeBtn],
      onclick: () => this.closeModal(),
    }),
  };

  private content: BaseComponent | undefined;
  private canBeClosed = true;
  private isCloseOnClickWithin = false;
  private isOpen = false;
  private isScrollBlocked = true;
  private needAnimationDelay = true;
  private beforeCloseCallback: ((event?: Event) => void) | undefined | null =
    null;

  constructor() {
    super({ elementTag: 'dialog', classes: [styles.modal] });
    this.addListeners();
  }

  public showModal(
    component: BaseComponent<keyof HTMLElementTagNameMap>,
    {
      canBeClosed = true,
      hasCloseButton = false,
      isCloseOnClickWithin = false,
      isScrollBlocked = true,
      needAnimationDelay = true,
      beforeCloseCallback = null,
    }: ModalOptions = {},
  ): void {
    if (this.isOpen) return;

    this.canBeClosed = canBeClosed;
    this.isCloseOnClickWithin = isCloseOnClickWithin;
    this.isScrollBlocked = isScrollBlocked;
    this.needAnimationDelay = needAnimationDelay;
    this.beforeCloseCallback = beforeCloseCallback;

    if (this.isScrollBlocked) {
      document.body.classList.add(styles.noScroll);
    }

    this.isOpen = true;

    this.createModal(hasCloseButton);
    document.body.append(this.getElement());

    if (this.content)
      this.content.getElement().replaceChildren(component.getElement());

    this.element.showModal();
  }

  public closeModal(): void {
    if (this.canBeClosed) {
      this.getElement().requestClose();
      document.body.classList.remove(styles.noScroll);
    }
  }

  public unLock(): void {
    this.canBeClosed = true;
  }

  public renewModalContent(
    component: BaseComponent<keyof HTMLElementTagNameMap>,
    {
      canBeClosed = true,
      isCloseOnClickWithin = false,
      isScrollBlocked = true,
      needAnimationDelay = true,
      beforeCloseCallback,
    }: Omit<ModalOptions, 'hasCloseButton'> = {},
  ) {
    this.canBeClosed = canBeClosed;
    this.isCloseOnClickWithin = isCloseOnClickWithin;
    this.isScrollBlocked = isScrollBlocked;
    this.needAnimationDelay = needAnimationDelay;
    this.beforeCloseCallback = beforeCloseCallback;

    if (this.isScrollBlocked) {
      document.body.classList.add(styles.noScroll);
    }

    this.isOpen = true;

    if (this.content) {
      this.content.getElement().replaceChildren(component.getElement());
    }
  }

  private addListeners(): void {
    this.addListener('click', (event: Event) => {
      if (this.isCloseOnClickWithin) this.closeModal();
      if (event.target === event.currentTarget) this.closeModal();
    });

    this.addListener('close', () => {
      setTimeout(
        () => {
          this.content?.removeSelf();
          this.getElement().remove();
          this.isOpen = false;
        },
        this.needAnimationDelay ? ANIMATION_TIMING : 0,
      );
    });

    this.addListener('cancel', (event?: Event) => {
      if (this.beforeCloseCallback) {
        this.beforeCloseCallback(event);
      }
    });

    this.addListener('keydown', (event: Event) => {
      if (
        event instanceof KeyboardEvent &&
        event.key === 'Escape' &&
        !this.canBeClosed
      ) {
        event.preventDefault();
      }
    });
  }

  private createModal(hasCloseButton: boolean): void {
    this.content = div({ classes: [styles.content] });
    this.appendSingle(this.content);
    if (hasCloseButton) {
      this.appendSingle(this.modalControls.closeModalButton);
    }
  }
}

const modalController = new Modal();
export { modalController, type Modal };
