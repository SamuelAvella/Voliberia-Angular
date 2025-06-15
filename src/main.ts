import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { registerLicense} from '@syncfusion/ej2-base'


import { AppModule } from './app/app.module';

import { register } from 'swiper/element/bundle'

register();

registerLicense("ORg4AjUWIQA/Gnt2VVhhQlFac11JW3XNYVF2R2FJe1RzdF9DZkwg0X1dQ19hSXtTcEVhWndceXFdQmY=")

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  // Call the element loader after the platform has been bootstrapped
defineCustomElements(window);
