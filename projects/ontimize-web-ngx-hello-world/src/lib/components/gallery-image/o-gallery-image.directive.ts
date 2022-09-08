import { Directive, HostBinding, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';

import { GalleryHelperService } from '../../services';

@Directive({
  selector: '[oGalleryBackgroundImg]'
})
export class GalleryImageDirective {

  @Input('oGalleryBackgroundImg')
  set image(val: string | SafeResourceUrl) {
    this._image = val;
    this.src = this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(this._image as string));
  }
  get imgage(): string | SafeResourceUrl {
    return this._image;
  }
  private _image: string | SafeResourceUrl;

  @HostBinding('style.background-image')
  src: SafeStyle;

  constructor(
    public sanitization: DomSanitizer,
    private helperService: GalleryHelperService
  ) { }

}
