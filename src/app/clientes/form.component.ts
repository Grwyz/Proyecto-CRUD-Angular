import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit{
  
  // Instancia de la clase Cliente para el formulario
  public cliente: Cliente = new Cliente();

  // Título del formulario
  public titulo: string = 'Crear Cliente';

  // Array para almacenar mensajes de error
  public errores!: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.cargarCliente();
  }

  // Método para cargar los datos de un cliente en el formulario
  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe((cliente) => (this.cliente = cliente));
      }
    })
  }

  // Método para crear un nuevo cliente
  create(): void {
    this.clienteService.create(this.cliente).subscribe({
      next: (response) => {
        // Redirección y notificación al usuario en caso de éxito
        this.router.navigate(['/clientes']);
        Swal.fire(
          'Nuevo cliente',
          `${response.mensaje}: ${response.cliente.nombre}`,
          //`El cliente ${response.cliente.nombre} ha sido creado con éxito!`,
          'success'
        );
      },
      error: (error) => {
        // Solución actual al problema
        // Manejo de errores y notificación al usuario en caso de falla
        Swal.fire(
          'Error al crear el cliente',
          `Se produjo un error al crear el cliente. Verifique los datos ingresados e inténtelo de nuevo.`,
          'warning'
        )
        /*this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ', err.status);
        console.error(err.error.errors);*/
          
      },
    });
  }

  // Método para actualizar un cliente existente
  update(): void {
    this.clienteService.update(this.cliente).subscribe({
      next: (cliente) => {
      // Redirección y notificación al usuario en caso de éxito
      this.router.navigate(['/clientes']);
      Swal.fire(
        'Cliente actualizado',
        `El cliente ${cliente.nombre} ha sido actualizado con éxito!`,
        'success'
      );
    },
    error: err => {
      // Solución actual al problema
      // Manejo de errores y muestra de mensajes de error específicos
      Swal.fire(
        'Error al actualizar el cliente',
        `Se produjo un error al actualizar el cliente. Verifique los datos ingresados e inténtelo de nuevo.`,
        'warning'
      )
      /*this.errores = err.error.errors as string [];
      console.error('Código del error desde el backend: ', err.status);
      console.error(err.error.errors);*/
    }
  });
  }
}
