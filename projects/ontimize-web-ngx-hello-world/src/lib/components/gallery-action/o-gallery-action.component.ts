import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { InputConverter } from 'ontimize-web-ngx';

@Component({
  selector: 'o-gallery-action',
  templateUrl: './o-gallery-action.component.html',
  inputs: [
    'icon',
    'disabled',
    'titleText'
  ],
  outputs: [
    'onClick'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryActionComponent {
  public icon: string;
  @InputConverter()
  public disabled: boolean = false;
  public titleText: string = '';

  onClick: EventEmitter<Event> = new EventEmitter();

  handleClick(event: Event) {
    if (!this.disabled) {
      this.onClick.emit(event);
    }

    event.stopPropagation();
    event.preventDefault();
  }
}
