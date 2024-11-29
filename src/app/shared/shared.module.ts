import { NgModule } from "@angular/core";
import { PictureSelectableComponent } from "./components/picture-selectable/picture-selectable.component";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations:[
        PictureSelectableComponent
    ],
    imports:[
        CommonModule,
        IonicModule,
        ReactiveFormsModule
    ],
    exports:[
        PictureSelectableComponent
    ]
})
export class SharedModule{}