import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component";
import { FlightModalComponent } from "./components/flight-modal/flight-modal.component";
import { BookingModalComponent } from "./components/booking-modal/booking-modal.component";
import { TogglePasswordPipe } from "./pipes/toggle-password.pipe";

@NgModule({
    declarations:[
        LanguageSelectorComponent,
        FlightModalComponent,
        BookingModalComponent,
        TogglePasswordPipe
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
        TogglePasswordPipe
    ]
})
export class SharedModule{}