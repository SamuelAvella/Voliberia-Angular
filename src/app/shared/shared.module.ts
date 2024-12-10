import { NgModule } from "@angular/core";
import { PictureSelectableComponent } from "./components/picture-selectable/picture-selectable.component";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component";

@NgModule({
    declarations:[
        PictureSelectableComponent,
        LanguageSelectorComponent
    ],
    imports:[
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forChild()
    ],
    exports:[
        PictureSelectableComponent,
        LanguageSelectorComponent
    ]
})
export class SharedModule{}