import { Component, Input, OnDestroy, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ActionSheetController, ModalController, Platform, PopoverController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { TranslationService } from 'src/app/core/services/translation.service'; // Ajusta la ruta si es necesario
import { PictureOptionsComponent } from '../picture-options/picture-options.component';

export const PICTURE_SELECTABLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PictureSelectableComponent),
  multi: true
};

/**
 * Componente para seleccionar y gestionar imágenes
 * Implementa ControlValueAccessor para integrarse con formularios reactivos de Angular
 */
@Component({
  selector: 'app-picture-selectable',
  templateUrl: './picture-selectable.component.html',
  styleUrls: ['./picture-selectable.component.scss'],
  providers:[PICTURE_SELECTABLE_VALUE_ACCESSOR]
})
export class PictureSelectableComponent  implements OnInit, ControlValueAccessor, OnDestroy {


  /** Subject que mantiene el valor actual de la imagen */
  private _picture = new BehaviorSubject("");
  /** Observable público para la imagen seleccionada */
  public picture$ = this._picture.asObservable();
  /** Indica si el componente está deshabilitado */
  isDisabled:boolean = false;
  /** Indica si hay una imagen seleccionada */
  hasValue:boolean = false;
  hasCameraFeature: boolean = false;

  constructor(
    private pictureModal:ModalController,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private translateService: TranslationService

  ) {
    this.checkCameraAvailabilty();
   }
  
  /** Limpia los recursos al destruir el componente */
  ngOnDestroy(): void {
    this._picture.complete();
  }

  ngOnInit() {
    console.log("Working picture-selectable");
    
  }

  /** Función que propaga los cambios al formulario padre */
  propagateChange = (obj: any) => {
  }

  /**
   * Establece el valor del componente desde el formulario
   * @param obj Valor a establecer (URL de la imagen)
   */
  writeValue(obj: any): void {
    if(obj){
      this.hasValue = true;
      this._picture.next(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Cambia la imagen actual y propaga el cambio
   * @param picture Nueva URL de la imagen
   */
  changePicture(picture:string){
    this.hasValue = picture!='';
    this._picture.next(picture);
    this.propagateChange(picture);
  }

  /**
   * Maneja el evento de cambio de imagen desde un input file
   * @param event Evento del DOM
   * @param fileLoader Elemento input file
   */
  onChangePicture(event:Event, fileLoader:HTMLInputElement){
    event.stopPropagation();
    fileLoader.onchange = ()=>{
      if(fileLoader.files && fileLoader.files?.length>0){
        var file = fileLoader.files[0];
        var reader = new FileReader();
        reader.onload = () => {
          this.changePicture(reader.result as string);
        };
        reader.onerror = (error) =>{
          console.log(error);
        }
        reader.readAsDataURL(file);
      }
    }
    fileLoader.click();
  }

  /**
   * Elimina la imagen actual
   * @param event Evento del DOM
   */
  onDeletePicture(event:Event){
    event.stopPropagation();
    this.changePicture('');
  }

  /** Cierra el modal de selección de imagen */
  close(){
    this.pictureModal?.dismiss();
  }

  private async checkCameraAvailabilty() {
    if ( this.platform.is('hybrid')){
      try {
        const permission = await Camera.checkPermissions();
        this.hasCameraFeature = permission.camera === 'granted'
      } catch {
        this.hasCameraFeature = false
      }
    } else {
      this.hasCameraFeature = !!(navigator?.mediaDevices?.getUserMedia);
    }
  }

  async takePicture(){
    try {
      if (this.platform.is('hybrid')) {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });
        
        if (image.dataUrl) {
          this.changePicture(image.dataUrl);
        }
      } else {
        // Para navegadores web
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          webUseInput: false // Esto fuerza el uso de la cámara web
        });
        
        if (image.dataUrl) {
          this.changePicture(image.dataUrl);
        }
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }
  

  async presentPictureOptions(event: Event, fileLoader: HTMLInputElement) {
    event.stopPropagation();
    
    if (this.hasCameraFeature) {
      const buttons = [
        {
          text: 'Take photo',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: "Select from gallery",
          icon: 'image',
          handler: () => {
            this.onChangePicture(event, fileLoader);
          }
        },
        {
          text: "Cancel",
          icon: 'close',
          role: 'cancel'
        }
      ];

      if (window.innerHeight < window.innerWidth) {  // Es landscape
        const popover = await this.popoverCtrl.create({
          component: PictureOptionsComponent,
          event: event,
          alignment: 'center',
          translucent: true,
          size: 'auto'
        });
        await popover.present();
        const { data } = await popover.onDidDismiss();
        
        if (data === 'camera') {
          this.takePicture();
        } else if (data === 'gallery') {
          this.onChangePicture(event, fileLoader);
        }
      } else {  // Es portrait
        const actionSheet = await this.actionSheetCtrl.create({
          buttons: buttons
        });
        await actionSheet.present();
      }
    } else {
      this.onChangePicture(event, fileLoader);
    }
  }

}

