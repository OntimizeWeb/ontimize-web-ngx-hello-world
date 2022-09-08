# Ontimize Web Gallery

An implementation of a gallery of images and videos.

* [Github repository](#github)
* [Installation](#installation)
* [Examples](#examples)

## Github
Ontimize Web Gallery Module is stored in [github](https://github.com/OntimizeWeb/ontimize-web-ngx-hello-world) where you can also see/add todos, bugs or feature requests in the [issues](https://github.com/OntimizeWeb/ontimize-web-ngx-hello-world/issues) section.

## Installation

```bash
  npm install ontimize-web-ngx-hello-world --save
```

## Examples
````ts
// app.module.ts
import { OGalleryModule } from 'ontimize-web-ngx-hello-world';
...
@NgModule({
    imports: [
        ...
        OGalleryModule
        ...
    ],
    ...
})
export class AppModule { }
````

````ts
// app.component.ts
import { Component, OnInit } from '@angular/core';

import { GalleryOptions, GalleryImage, GalleryAnimation } from 'ontimize-web-ngx-hello-world';
...

@Component({
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  galleryOptions: GalleryOptions[];
  galleryImages: GalleryImage[];

  ngOnInit(): void {
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: GalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.galleryImages = [
      {
        small: 'assets/1-small.jpg',
        medium: 'assets/1-medium.jpg',
        big: 'assets/1-big.jpg'
      },
      {
        small: 'assets/2-small.jpg',
        medium: 'assets/2-medium.jpg',
        big: 'assets/2-big.jpg'
      },
      {
        small: 'assets/3-small.jpg',
        medium: 'assets/3-medium.jpg',
        big: 'assets/3-big.jpg'
      }
    ];
  }
}
````

````html
// app.component.html
<o-gallery [gallery-options]="galleryOptions" [gallery-images]="galleryImages"></o-gallery>
````

### Styling
- Active thumbnail
```
::ng-deep .o-gallery-thumbnail.o-gallery-active {
    /* your styles */
}
```

- Arrow
```
o-gallery ::ng-deep .o-gallery-arrow {
    /* your styles */
}
```

- Arrow in particular element
```
o-gallery ::ng-deep o-gallery-image .o-gallery-arrow {
    /* your styles */
}
o-gallery ::ng-deep o-gallery-thumbnails .o-gallery-arrow {
    /* your styles */
}
o-gallery ::ng-deep o-gallery-preview .o-gallery-arrow {
    /* your styles */
}
```

You can play with gallery using http://try.imatia.com/ontimizeweb/playground/main/gallery/