import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TranslateModule } from "@ngx-translate/core";

//Components
import { BookingModalComponent } from "./components/booking-modal/booking-modal.component";
import { FlightModalComponent } from "./components/flight-modal/flight-modal.component";
import { FlightSelectableComponent } from "./components/flight-selectable/flight-selectable.component";
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component";
import { PictureOptionsComponent } from "./components/picture-options/picture-options.component";
import { PictureSelectableComponent } from "./components/picture-selectable/picture-selectable.component";

//Pipes
import { LocalizedCurrencyPipe } from "./pipes/localized-currency-pipe";
import { LocalizedDatePipe } from "./pipes/localized-date.pipe";
import { TogglePasswordPipe } from "./pipes/toggle-password.pipe";

//Directives
import { BookingStatusDirective } from "./directives/booking-status.directive";

@NgModule({
    declarations:[
        BookingModalComponent,
        BookingStatusDirective,
        FlightModalComponent,
        FlightSelectableComponent,
        LanguageSelectorComponent,
        LocalizedCurrencyPipe,
        LocalizedDatePipe,
        PictureOptionsComponent,
        PictureSelectableComponent,
        TogglePasswordPipe,
    ],
    imports:[
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forChild()
    ],
    exports:[
        BookingModalComponent,
        BookingStatusDirective,
        FlightModalComponent,
        LanguageSelectorComponent,
        LocalizedCurrencyPipe,
        LocalizedDatePipe,
        PictureSelectableComponent,
        TogglePasswordPipe,
    ]
})
export class SharedModule{}