import { BaseComponent } from '../base';
import { createSvgChunk } from '@/utils/create-svg-chunk';

import styles from './mute-toggler.module.css';
import { span } from '../utils';

export class MuteToggler extends BaseComponent<'button'> {
  private isMuted: boolean;

  private onToggle: (isMuted: boolean) => void;
  constructor(isMuted: boolean, onToggle: (isMuted: boolean) => void) {
    super({
      elementTag: 'button',
      classes: [styles.muteButton],
      title: isMuted ? 'Включить звук' : 'Выключить звук',
      ariaLabel: isMuted ? 'Включить звук' : 'Выключить звук',
    });

    this.isMuted = isMuted;
    this.onToggle = onToggle;

    this.appendSingleSVG(
      createSvgChunk(this.isMuted ? 'icon-no-sound' : 'icon-sound', {
        classes: [styles.muteIcon],
      }),
    ).appendSingle(
      span({
        classes: [styles.muteText],
        text: this.isMuted ? 'Включить звук' : 'Выключить звук',
      }),
    );

    this.addListener('click', () => {
      this.isMuted = !this.isMuted;
      this.onToggle(this.isMuted);
      this.updateButton();
    });

    this.updateButton();
  }

  private updateButton() {
    this.addAttributes({
      title: this.isMuted ? 'Включить звук' : 'Выключить звук',
      ariaLabel: this.isMuted ? 'Включить звук' : 'Выключить звук',
    });

    this.getElement().replaceChildren(
      createSvgChunk(this.isMuted ? 'icon-no-sound' : 'icon-sound', {
        classes: [styles.muteIcon],
      }),
      span({
        classes: [styles.muteText],
        text: this.isMuted ? 'Включить звук' : 'Выключить звук',
      }).getElement(),
    );
  }
}
