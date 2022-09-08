import { GalleryActionComponent } from './components/gallery-action/o-gallery-action.component';
import { GalleryArrowsComponent } from './components/gallery-arrows/o-gallery-arrows.component';
import { GalleryBulletsComponent } from './components/gallery-bullets/o-gallery-bullets.component';
import { GalleryImageComponent } from './components/gallery-image/o-gallery-image.component';
import { GalleryImageDirective } from './components/gallery-image/o-gallery-image.directive';
import { GalleryPreviewComponent } from './components/gallery-preview/o-gallery-preview.component';
import { GalleryThumbnailsComponent } from './components/gallery-thumbnails/o-gallery-thumbnails.component';
import { GalleryComponent } from './components/gallery/o-gallery.component';

export * from './components/gallery-action/o-gallery-action.component';
export * from './components/gallery-arrows/o-gallery-arrows.component';
export * from './components/gallery-bullets/o-gallery-bullets.component';
export * from './components/gallery-image/o-gallery-image.component';
export * from './components/gallery-preview/o-gallery-preview.component';
export * from './components/gallery-thumbnails/o-gallery-thumbnails.component';
export * from './components/gallery/o-gallery.component';

export const OGALLERY_DIRECTIVES: any[] = [
  GalleryActionComponent,
  GalleryArrowsComponent,
  GalleryBulletsComponent,
  GalleryImageComponent,
  GalleryImageDirective,
  GalleryThumbnailsComponent,
  GalleryPreviewComponent,
  GalleryComponent
];
