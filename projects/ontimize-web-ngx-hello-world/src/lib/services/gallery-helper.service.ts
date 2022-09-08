import { Injectable, ElementRef, Renderer2 } from '@angular/core';

@Injectable()
export class GalleryHelperService {

  private swipeHandlers: Map<string, Function[]> = new Map<string, Function[]>();

  constructor(private renderer: Renderer2) { }

  manageSwipe(status: boolean, element: ElementRef, id: string, nextHandler: Function, prevHandler: Function): void {

    const handlers = this.getSwipeHandlers(id);

    // swipeleft and swiperight are available only if hammerjs is included
    try {
      if (status && !handlers) {
        this.swipeHandlers.set(id, [
          this.renderer.listen(element.nativeElement, 'swipeleft', () => nextHandler()),
          this.renderer.listen(element.nativeElement, 'swiperight', () => prevHandler())
        ]);
      } else if (!status && handlers) {
        handlers.forEach((handler) => handler());
        this.removeSwipeHandlers(id);
      }
    } catch (e) { }
  }

  validateUrl(url: string): string {
    if (url.replace) {
      return url.replace("/ /g", '%20')
        .replace("/\, g", '%27');
    } else {
      return url;
    }
  }

  getBackgroundUrl(image: string) {
    return 'url(\'' + this.validateUrl(image) + '\')';
  }

  private getSwipeHandlers(id: string): Function[] | undefined {
    return this.swipeHandlers.get(id);
  }

  private removeSwipeHandlers(id: string): void {
    this.swipeHandlers.delete(id);
  }

  getFileType(fileSource: string): string {
    if (fileSource.startsWith('data:')) {
      return fileSource.substring(5, Math.min(fileSource.indexOf(';'), fileSource.indexOf('/')) - 5);
    }
    try {
      const url = new URL(fileSource);
      if (url == undefined) {
        return 'unknown';
      }

      const fileName = url.pathname.split('/').pop();
      if (fileName == undefined || fileName.length == 0) {
        return 'unknown';
      }

      let fileExtension = fileName.split('.').pop().toLowerCase();
      if (!fileExtension
        || fileExtension === 'jpeg' || fileExtension === 'jpg'
        || fileExtension === 'png' || fileExtension === 'bmp'
        || fileExtension === 'gif') {
        return 'image';
      } else if (fileExtension === 'avi' || fileExtension === 'flv'
        || fileExtension === 'wmv' || fileExtension === 'mov'
        || fileExtension === 'mp4') {
        return 'video';
      }
    } catch (error) {
      console.warn("Impossible to parse file source url");
    }
    return 'unknown';
  }
}
