import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { InputConverter } from 'ontimize-web-ngx';

@Component({
  selector: 'o-gallery-arrows',
  templateUrl: './o-gallery-arrows.component.html',
  styleUrls: ['./o-gallery-arrows.component.scss'],
  inputs: [
    'prevDisabled: prev-disabled',
    'nextDisabled: next-disabled',
    'arrowPrevIcon: arrow-prev-icon',
    'arrowNextIcon: arrow-next-icon'
  ],
  outputs: [
    'onPrevClick',
    'onNextClick'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GalleryArrowsComponent {

  @InputConverter()
  public prevDisabled: boolean;
  @InputConverter()
  public nextDisabled: boolean;
  public arrowPrevIcon: string;
  public arrowNextIcon: string;

  onPrevClick = new EventEmitter();
  onNextClick = new EventEmitter();

  handlePrevClick(): void {
    this.onPrevClick.emit();
  }

  handleNextClick(): void {
    this.onNextClick.emit();
  }

}
