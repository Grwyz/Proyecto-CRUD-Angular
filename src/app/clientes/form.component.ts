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

  create(): void {
    this.clienteService.create(this.cliente).subscribe((response) => {
      this.router.navigate(['/clientes'])
      console.log(response)
      Swal.fire(
        'Nuevo cliente',
        `Cliente ${response.cliente.nombre} creado con éxito!`,
        'success'
      )
    })
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe((response) => {
      this.router.navigate(['/clientes']);
      Swal.fire(
        'Cliente actualizado',
        `Cliente ${response.cliente.nombre} actualizado con éxito`,
        'success'
      );
    });
  }
}
