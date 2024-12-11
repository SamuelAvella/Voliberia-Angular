import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { UsersAppService } from "src/app/core/services/impl/usersApp.service"; // Servicio para usuarios
import { FlightsService } from "src/app/core/services/impl/flights.service"; // Servicio para vuelos

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss'],
})
export class BookingModalComponent implements OnInit {
  @Input() booking: any; // Si existe, es para editar. Si no, es para crear.
  formGroup: FormGroup;
  users: { id: string; name: string; surname: string; }[] = [];
  flights: { id: string; origin: string; destination: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private usersAppSvc: UsersAppService, // Servicio de UsersApp
    private flightsSvc: FlightsService // Servicio de vuelos
  ) {
    this.formGroup = this.fb.group({
      userAppId: ['', Validators.required], // Usuario asignado a la reserva
      flightId: ['', Validators.required], // Vuelo asignado (solo en creación)
    });
  }

  ngOnInit(): void {
    if (this.booking) {
      // Si es edición, cargamos los datos en el formulario
      this.formGroup.patchValue({
        userAppId: this.booking.userAppId,
      });
    }

    // Cargamos los usuarios y vuelos
    this.loadUsers();
    if (!this.booking) {
      // Solo cargamos vuelos si estamos creando una nueva reserva
      this.loadFlights();
    }
  }

  loadUsers(): void {
    this.usersAppSvc.getAll().subscribe({
      next: (users) => {
        this.users = users.map((user) => ({
          id: user.id,
          name: user.name,
          surname: user.surname,
        }));
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }
  
  

  loadFlights(): void {
    this.flightsSvc.getAll().subscribe({
      next: (flights) => {
        this.flights = flights.map((flight) => ({
          id: flight.id,
          origin: flight.origin,
          destination: flight.destination,
        }));
      },
      error: (err) => console.error('Error loading flights:', err),
    });
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.modalCtrl.dismiss(this.formGroup.value);
    }
  }

  dismiss(): void {
    this.modalCtrl.dismiss();
  }
}
