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
  
  public cliente: Cliente = new Cliente();
  public titulo: string = 'Crear Cliente';

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarCliente();
  }

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

  /* Suscribir el resultado del método (Se hace de forma diferente
     en el método update, pero ambas formas son válidas) */
  create(): void {
    this.clienteService.create(this.cliente).subscribe((response) => {
      this.router.navigate(['/clientes'])
      console.log(response)
      Swal.fire(
        'Nuevo cliente',
        `${response.mensaje} - ${response.cliente.nombre}`,
        'success'
      )
    })
  }

  /* Suscribir el resultado del método (Se hace de forma diferente
     en el método create, pero ambas formas son válidas) */
  update(): void {
    this.clienteService.update(this.cliente).subscribe((cliente) => {
      this.router.navigate(['/clientes']);
      Swal.fire(
        'Cliente actualizado',
        `El cliente ${cliente.nombre} ha sido actualizado con éxito!`,
        'success'
      );
    });
  }
}
