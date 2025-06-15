import { Component, ElementRef, HostListener, Input, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { Flight } from "src/app/core/models/flight.model";
import { arrivalDateValidator } from "../../validators/date.validators";
import { BreakpointsService } from "src/app/core/services/breakpoints.service";

/**
 * Modal para crear o editar un vuelo.
 * Permite seleccionar origen, destino, fechas y horas con validaciones personalizadas.
 */
@Component({
  selector: 'app-flight-modal',
  templateUrl: './flight-modal.component.html',
  styleUrls: ['./flight-modal.component.scss'],
})
export class FlightModalComponent implements OnInit {

  /** Vuelo a editar (opcional) */
  @Input() flight?: Flight;

  @ViewChild('departureWrapper') departureWrapper!: ElementRef;
  @ViewChild('arrivalWrapper') arrivalWrapper!: ElementRef;

  /** Formulario reactivo del vuelo */
  formGroup: FormGroup;

  /** Estado de visibilidad de selectores */
  toggleDepartureDateSelector = false;
  toggleArrivalDateSelector = false;
  toggleTimeSelector: 'departure' | 'arrival' | null = null;

  /** Campos separados de fecha y hora */
  departureDate: string | null = null;
  departureTime: string | null = null;
  arrivalDate: string | null = null;
  arrivalTime: string | null = null;

  /** Fechas mínimas válidas */
  minDepartureDate = new Date().toISOString();
  minArrivalDate = new Date(Date.now() + 40 * 60000).toISOString();

  /** Indica si el dispositivo es móvil */
  isMobile = false;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private breakpointsService: BreakpointsService
  ) {
    this.breakpointsService.isHandset$.subscribe(value => {
      this.isMobile = value;
    });

    this.formGroup = this.fb.group({
      origin: ['', [Validators.required, Validators.minLength(3)]],
      destination: ['', [Validators.required, Validators.minLength(3)]],
      departureDate: ['', [Validators.required]],
      arrivalDate: ['', [Validators.required]],
      seatPrice: [0, [Validators.required, Validators.min(15)]],
    }, { validators: arrivalDateValidator });
  }

  /**
   * Inicializa el componente y carga datos si se está editando un vuelo.
   */
  ngOnInit(): void {
    this.minDepartureDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] + 'T00:00:00.000Z';

    if (this.flight) {
      this.formGroup.patchValue(this.flight);
      const [depDate, depTime] = this.flight.departureDate.split('T');
      const [arrDate, arrTime] = this.flight.arrivalDate.split('T');
      this.departureDate = depDate;
      this.departureTime = depTime?.slice(0, 5) ?? null;
      this.arrivalDate = arrDate;
      this.arrivalTime = arrTime?.slice(0, 5) ?? null;
    }
  }

  /** Cierra el modal sin guardar cambios */
  dismiss(): void {
    this.modalCtrl.dismiss();
  }

  /** Confirma y envía el formulario */
  onSubmit(): void {
    this.modalCtrl.dismiss(this.formGroup.value);
  }

  /**
   * Maneja la selección de hora en el selector.
   * @param event Evento del componente
   * @param type Tipo de campo: 'departure' o 'arrival'
   */
  onTimePartSelected(event: CustomEvent, type: 'departure' | 'arrival'): void {
    const time = event.detail.value;
    if (type === 'departure') {
      this.departureTime = time;
      this.formGroup.get('departureDate')?.setValue(
        this.combineDateTime(this.departureDate!, time)
      );
    } else {
      this.arrivalTime = time;
      this.formGroup.get('arrivalDate')?.setValue(
        this.combineDateTime(this.arrivalDate!, time)
      );
    }
    this.toggleTimeSelector = null;
  }

  /**
   * Une una fecha y una hora en formato ISO.
   * @param dateStr Fecha en string
   * @param timeStr Hora en string
   * @returns Fecha completa en formato ISO
   */
  combineDateTime(dateStr: string, timeStr: string): string {
    return new Date(`${dateStr}T${timeStr}`).toISOString();
  }
}

