import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { OCustomMaterialModule } from 'ontimize-web-ngx';

import { OGALLERY_DIRECTIVES } from './components';

export * from './interfaces';
export * from './services';
export * from './models';
export * from './components';

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'pinch': { enable: false },
    'rotate': { enable: false }
  };
}

@NgModule({
  imports: [
    CommonModule,
    OCustomMaterialModule
  ],
  declarations: [OGALLERY_DIRECTIVES],
  exports: [OGALLERY_DIRECTIVES],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }]
})
export class OGalleryModule { }