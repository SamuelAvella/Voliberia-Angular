/**
 * Página de perfil de usuario.
 * Permite editar nombre, apellidos e imagen, y exportar todos los datos (vuelos, reservas, usuarios).
 */
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { lastValueFrom } from "rxjs";
import { UserApp } from "src/app/core/models/userApp.model";
import { BaseAuthenticationService } from "src/app/core/services/impl/base-authentication.service";
import { BaseMediaService } from "src/app/core/services/impl/base-media.service";
import { UsersAppService } from "src/app/core/services/impl/usersApp.service";

import { saveAs } from 'file-saver'
import { FlightsService } from 'src/app/core/services/impl/flights.service';
import { BookingsService } from 'src/app/core/services/impl/bookings.service';
import { Flight } from "src/app/core/models/flight.model";
import { Booking } from "src/app/core/models/booking.model";

export interface PagedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  pages: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  /** Formulario de edición del perfil */
  formGroup: FormGroup;

  /** Datos del usuario extendido */
  userApp?: UserApp | null;

  /** Si el usuario actual tiene rol de administrador */
  isAdmin: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usersAppSvc: UsersAppService,
    private authSvc: BaseAuthenticationService,
    private mediaSvc: BaseMediaService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private translateSvc: TranslateService,
    private flightsSvc: FlightsService,
    private bookingsSvc: BookingsService
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      picture: ['']
    });
  }

  /**
   * Inicializa el perfil cargando los datos del usuario actual.
   */
  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const user = await this.authSvc.getCurrentUser();
      if (user) {
        this.userApp = await lastValueFrom(this.usersAppSvc.getByUserId(user.id));

        if (this.userApp) {
          const updatedUserApp: any = {
            ...this.userApp,
            username: `${this.userApp.name} ${this.userApp.surname}`,
            email: user.email,
            userId: user.id,
            picture: typeof this.userApp.picture === 'object'
              ? this.userApp.picture.url
              : undefined
          };
          this.formGroup.patchValue(updatedUserApp);
        }

        this.isAdmin = this.userApp?.role === 'admin';
      }
    } catch (error) {
      const toast = await this.toastController.create({
        message: await lastValueFrom(this.translateSvc.get('COMMON.ERROR.LOAD')),
        duration: 3000,
        position: 'bottom',
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Guarda los cambios realizados en el perfil.
   */
  async onSubmit() {
    if (this.formGroup.valid && this.userApp) {
      const loading = await this.loadingController.create();
      await loading.present();

      try {
        const changedValues = {} as Record<keyof UserApp, any>;
        Object.keys(this.formGroup.controls).forEach((key) => {
          if (this.formGroup.get(key)?.dirty) {
            changedValues[key as keyof UserApp] = this.formGroup.get(key)?.value;
          }
        });

        if (changedValues.picture) {
          const base64Response = await fetch(changedValues.picture);
          const blob = await base64Response.blob();
          const uploadedBlob = await lastValueFrom(this.mediaSvc.upload(blob));
          changedValues.picture = uploadedBlob[0];
        }

        await lastValueFrom(this.usersAppSvc.update(this.userApp.id, changedValues));

        const toast = await this.toastController.create({
          message: await this.translateSvc.get('COMMON.SUCCESS.SAVE').toPromise(),
          duration: 3000,
          position: 'bottom',
        });
        await toast.present();
      } catch (error) {
        const toast = await this.toastController.create({
          message: await this.translateSvc.get('COMMON.ERROR.SAVE').toPromise(),
          duration: 3000,
          position: 'bottom',
        });
        await toast.present();
      } finally {
        await loading.dismiss();
      }
    }
  }

  /** Muestra advertencia al intentar modificar el email */
  async showEmailWarning() {
    const toast = await this.toastController.create({
      message: await this.translateSvc.get('PROFILE.ERRORS.EMAIL_CANNOT_BE_CHANGED').toPromise(),
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  /**
   * Exporta todos los datos del sistema en formato CSV.
   */
  async exportAllData() {
    const loading = await this.loadingController.create({ message: 'Exportando datos...' });
    await loading.present();

    try {
      const flightsPaged: any = await lastValueFrom(this.flightsSvc.getAll());
      const bookingsPaged: any = await lastValueFrom(this.bookingsSvc.getAll());
      const usersPaged: any = await lastValueFrom(this.usersAppSvc.getAll());

      this.exportToCsv('flights.csv', flightsPaged?.data ?? []);
      this.exportToCsv('bookings.csv', bookingsPaged?.data ?? []);
      this.exportToCsv('users.csv', usersPaged?.data ?? []);

      const toast = await this.toastController.create({
        message: 'Datos exportados correctamente.',
        duration: 3000,
        position: 'bottom',
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al exportar datos.',
        duration: 3000,
        position: 'bottom',
      });
      await toast.present();
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Exporta un array de objetos como archivo CSV.
   * @param filename Nombre del archivo
   * @param data Datos a exportar
   */
  private exportToCsv(filename: string, data: any[]): void {
    if (!data || data.length === 0) return;

    const keys = Object.keys(data[0] ?? {});
    const csvRows = [
      keys.join(','),
      ...data.map(item => keys.map(k => `"${(item[k] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ];

    const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  /** Getters de los campos del formulario */
  get name() { return this.formGroup.controls['name']; }
  get surname() { return this.formGroup.controls['surname']; }
  get email() { return this.formGroup.controls['email']; }
}
