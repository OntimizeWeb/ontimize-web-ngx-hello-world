import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, HostListener, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

import { GalleryImageSize } from '../../models/gallery-image-size.model';
import { GalleryImage } from '../../models/gallery-image.model';
import { GalleryLayout } from '../../models/gallery-layout.model';
import { GalleryOptions } from '../../models/gallery-options.model';
import { GalleryOrderedImage } from '../../models/gallery-ordered-image.model';
import { GalleryHelperService } from '../../services/gallery-helper.service';
import { GalleryImageComponent } from '../gallery-image/o-gallery-image.component';
import { GalleryPreviewComponent } from '../gallery-preview/o-gallery-preview.component';
import { GalleryThumbnailsComponent } from '../gallery-thumbnails/o-gallery-thumbnails.component';

export const DEFAULT_OUTPUTS_O_GALLERY = [
  'onImagesReady',
  'onChange',
  'onPreviewOpen',
  'onPreviewClose',
  'onPreviewChange'
];
export const DEFAULT_INPUTS_O_GALLERY = [
  'options: gallery-options',
  'images: gallery-images'
];

@Component({
  selector: 'o-gallery',
  templateUrl: './o-gallery.component.html',
  styleUrls: ['./o-gallery.component.scss'],
  providers: [GalleryHelperService],
  inputs: DEFAULT_INPUTS_O_GALLERY,
  outputs: DEFAULT_OUTPUTS_O_GALLERY
})
export class GalleryComponent implements AfterViewInit {

  set options(val: GalleryOptions[]) {
    let options = val.map(option => new GalleryOptions(option));

    // sort options
    options = [
      ...options.filter(o => o.breakpoint === undefined),
      ...options
        .filter(o => o.breakpoint !== undefined)
        .sort((a, b) => b.breakpoint - a.breakpoint)
    ];

    this._options = options;

    this.setBreakpoint();
    this.setOptions();
    this.checkFullWidth();
    if (this.currentOptions) {
      this.selectedIndex = this.currentOptions.startIndex;
    }
  }
  get options(): GalleryOptions[] {
    return this._options;
  }
  private _options: GalleryOptions[];

  set images(val: GalleryImage[]) {
    this._images = val;

    const smallImages = [];
    const mediumImages = [];
    const bigImages = [];
    const descriptions = [];
    const links = [];
    const labels = [];
    this._images.forEach((img, i) => {
      img.type = this.helperService.getFileType(img.url as string || img.big as string || img.medium as string || img.small as string || '');
      smallImages.push(img.small || img.medium);
      mediumImages.push(new GalleryOrderedImage({ src: img.medium, type: img.type, index: i }));
      bigImages.push(img.big || img.medium);
      descriptions.push(img.description);
      links.push(img.url);
      labels.push(img.label);
    });
    this.smallImages = smallImages;
    this.mediumImages = mediumImages;
    this.bigImages = bigImages;
    this.descriptions = descriptions;
    this.links = links;
    this.labels = labels;

    if (this.images && this.images.length) {
      this.onImagesReady.emit();
    }
  }
  get images(): GalleryImage[] {
    return this._images;
  }
  private _images: GalleryImage[];

  onImagesReady = new EventEmitter();
  onChange = new EventEmitter<{ index: number; image: GalleryImage; }>();
  onPreviewOpen = new EventEmitter();
  onPreviewClose = new EventEmitter();
  onPreviewChange = new EventEmitter<{ index: number; image: GalleryImage; }>();

  smallImages: string[] | SafeResourceUrl[];
  mediumImages: GalleryOrderedImage[];
  bigImages: string[] | SafeResourceUrl[];
  descriptions: string[];
  links: string[];
  labels: string[];

  selectedIndex = 0;
  previewEnabled: boolean;

  currentOptions: GalleryOptions = new GalleryOptions({});

  private breakpoint: number | undefined = undefined;
  private prevBreakpoint: number | undefined = undefined;
  private fullWidthTimeout: any;

  @ViewChild(GalleryPreviewComponent, { static: false })
  preview: GalleryPreviewComponent;
  @ViewChild(GalleryImageComponent, { static: false })
  galleryMainImage: GalleryImageComponent;
  @ViewChild(GalleryThumbnailsComponent, { static: false })
  thubmnails: GalleryThumbnailsComponent;

  @HostBinding('style.width') width: string;
  @HostBinding('style.height') height: string;
  @HostBinding('style.left') left: string;

  constructor(
    private myElement: ElementRef,
    private helperService: GalleryHelperService
  ) { }

  ngAfterViewInit(): void {
    if (this.galleryMainImage) {
      this.galleryMainImage.reset(this.currentOptions.startIndex);
    }

    if (this.currentOptions.thumbnailsAutoHide && this.currentOptions.thumbnails && this.images.length <= 1) {
      this.currentOptions.thumbnails = false;
      this.currentOptions.imageArrows = false;
    }

    this.checkFullWidth();
  }

  @HostListener('window:resize')
  onResize() {
    this.setBreakpoint();

    if (this.prevBreakpoint !== this.breakpoint) {
      this.setOptions();
      this.resetThumbnails();
    }

    if (this.currentOptions && this.currentOptions.fullWidth) {

      if (this.fullWidthTimeout) {
        clearTimeout(this.fullWidthTimeout);
      }

      this.fullWidthTimeout = setTimeout(() => {
        this.checkFullWidth();
      }, 200);
    }
  }

  openPreview(index: number): void {
    if (this.currentOptions.previewCustom) {
      this.currentOptions.previewCustom(index);
    } else {
      this.previewEnabled = true;
      this.preview.open(index);
    }
  }

  previewOpened(): void {
    this.onPreviewOpen.emit();

    if (this.galleryMainImage && this.galleryMainImage.autoPlay) {
      this.galleryMainImage.stopAutoPlay();
    }
  }

  previewClosed(): void {
    this.previewEnabled = false;
    this.onPreviewClose.emit();

    if (this.galleryMainImage && this.galleryMainImage.autoPlay) {
      this.galleryMainImage.startAutoPlay();
    }
  }

  selectFromImage(index: number) {
    this.select(index);
  }

  selectFromThumbnails(index: number) {
    this.select(index);

    if (this.currentOptions && this.currentOptions.thumbnails && this.currentOptions.preview
      && (!this.currentOptions.image || this.currentOptions.thumbnailsRemainingCount)) {
      this.openPreview(this.selectedIndex);
    }
  }

  show(index: number): void {
    this.select(index);
  }

  showNext(): void {
    this.galleryMainImage.showNext();
  }

  showPrev(): void {
    this.galleryMainImage.showPrev();
  }

  canShowNext(): boolean {
    if (this.images && this.currentOptions) {
      return (this.currentOptions.imageInfinityMove || this.selectedIndex < this.images.length - 1)
        ? true : false;
    } else {
      return false;
    }
  }

  canShowPrev(): boolean {
    if (this.images && this.currentOptions) {
      return (this.currentOptions.imageInfinityMove || this.selectedIndex > 0) ? true : false;
    } else {
      return false;
    }
  }

  previewSelect(index: number) {
    this.onPreviewChange.emit({ index, image: this.images[index] });
  }

  moveThumbnailsRight() {
    this.thubmnails.moveRight();
  }

  moveThumbnailsLeft() {
    this.thubmnails.moveLeft();
  }

  canMoveThumbnailsRight() {
    return this.thubmnails.canMoveRight;
  }

  canMoveThumbnailsLeft() {
    return this.thubmnails.canMoveLeft;
  }

  changeWidth(newWidth: string) {
    this.changeOptionsProp('width', newWidth);
  }

  changeHeight(newHeight: string) {
    this.changeOptionsProp('height', newHeight);
  }

  changeThumbPosition(): void {
    this.options = this.options.map(o => {
      o.layout = o.layout === GalleryLayout.ThumbnailsTop ? GalleryLayout.ThumbnailsBottom : GalleryLayout.ThumbnailsTop;
      return o;
    });
  }

  changeImageSize(): void {
    this.options = this.options.map(o => {
      o.imageSize = o.imageSize === GalleryImageSize.Cover ? GalleryImageSize.Contain : GalleryImageSize.Cover;
      return o;
    });
  }

  changeThumbnailSize(): void {
    this.options = this.options.map(o => {
      o.thumbnailSize = o.thumbnailSize === GalleryImageSize.Cover ? GalleryImageSize.Contain : GalleryImageSize.Cover;
      return o;
    });
  }

  changeImage(): void {
    this.toggleOptionsProp('image');
  }

  changeThumbnails(): void {
    this.toggleOptionsProp('thumbnails');
  }

  changePreview(): void {
    this.toggleOptionsProp('preview');
  }

  changeImageArrows(): void {
    this.toggleOptionsProp('imageArrows');
  }

  changePreviewArrows(): void {
    this.toggleOptionsProp('previewArrows');
  }

  changePreviewAutoPlay(): void {
    this.toggleOptionsProp('previewAutoPlay');
  }

  changePreviewDescription(): void {
    this.toggleOptionsProp('previewDescription');
  }

  changePreviewFullscreen(): void {
    this.toggleOptionsProp('previewFullscreen');
  }

  changePreviewCloseonClick(): void {
    this.toggleOptionsProp('previewCloseOnClick');
  }

  changePreviewCloseonEsc(): void {
    this.toggleOptionsProp('previewCloseOnEsc');
  }

  changePreviewKeyboardNavigation(): void {
    this.toggleOptionsProp('previewKeyboardNavigation');
  }

  changePreviewZoom(): void {
    this.toggleOptionsProp('previewZoom');
  }

  changePreviewRotate(): void {
    this.toggleOptionsProp('previewRotate');
  }

  changePreviewDownload(): void {
    this.toggleOptionsProp('previewDownload');
  }

  private resetThumbnails() {
    if (this.thubmnails) {
      this.thubmnails.reset(this.currentOptions.startIndex);
    }
  }

  private select(index: number) {
    this.selectedIndex = index;

    this.onChange.emit({
      index,
      image: this.images[index]
    });
  }

  private checkFullWidth(): void {
    if (this.currentOptions && this.currentOptions.fullWidth) {
      this.width = document.body.clientWidth + 'px';
      this.left = (-(document.body.clientWidth -
        this.myElement.nativeElement.parentNode.innerWidth) / 2) + 'px';
    }
  }

  private setBreakpoint(): void {
    this.prevBreakpoint = this.breakpoint;
    let breakpoints;

    if (typeof window !== 'undefined') {
      breakpoints = this.options.filter((opt) => opt.breakpoint >= window.innerWidth)
        .map((opt) => opt.breakpoint);
    }

    if (breakpoints && breakpoints.length) {
      this.breakpoint = breakpoints.pop();
    } else {
      this.breakpoint = undefined;
    }
  }

  private setOptions(): void {
    this.currentOptions = new GalleryOptions({});

    this.options
      .filter((opt) => opt.breakpoint === undefined || opt.breakpoint >= this.breakpoint)
      .forEach((opt) => this.combineOptions(this.currentOptions, opt));

    this.width = this.currentOptions.width;
    this.height = this.currentOptions.height;
  }

  private combineOptions(first: GalleryOptions, second: GalleryOptions) {
    Object.keys(second).forEach((val) => first[val] = second[val] !== undefined ? second[val] : first[val]);
  }

  private changeOptionsProp(prop: string, newValue: any) {
    this.options = this.options.map(o => {
      o[prop] = newValue;
      return o;
    });
  }

  private toggleOptionsProp(prop: string) {
    this.options = this.options.map(o => {
      o[prop] = !o[prop];
      return o;
    });
  }

}

