import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component";
import { FlightModalComponent } from "./components/flight-modal/flight-modal.component";
import { BookingModalComponent } from "./components/booking-modal/booking-modal.component";
import { TogglePasswordPipe } from "./pipes/toggle-password.pipe";
import { LocalizedDatePipe } from "./pipes/localized-date.pipe";
import { LocalizedCurrencyPipe } from "./pipes/localized-currency-pipe";
import { BookingStatusDirective } from "./directives/booking-status.directive";

@NgModule({
    declarations:[
        LanguageSelectorComponent,
        FlightModalComponent,
        BookingModalComponent,
        TogglePasswordPipe,
        LocalizedDatePipe,
        LocalizedCurrencyPipe,
        BookingStatusDirective
    ],
    imports:[
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forChild()
    ],
    exports:[
        LanguageSelectorComponent,
        FlightModalComponent,
        BookingModalComponent,
        TogglePasswordPipe,
        LocalizedDatePipe,
        LocalizedCurrencyPipe,
        BookingStatusDirective
    ]
})
export class SharedModule{}