import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ExpectedResponse } from './expectedResponse';

@Injectable()
export class ClienteService {

  // URL base para las operaciones con la entidad 'clientes'
private urlEndPoint:string = 'http://localhost:8080/api/clientes'

// Cabeceras HTTP para las solicitudes JSON
private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  // Método para obtener la lista de clientes
  getClientes(): Observable<Cliente[]> { 
    //return of(CLIENTES); /* No borrar */
    return this.http.get(this.urlEndPoint).pipe(
      tap(response => {
        let clientes = response as Cliente[];
        console.log('ClienteService: tap 1');
        clientes.forEach( cliente =>{
          console.log(cliente.nombre)
        }

        )
      }),
      map(response => {
        let clientes = response as Cliente[];
        return clientes.map(cliente =>{
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'es');
          return cliente;
        });
      }
      ),
      tap(response => {
        console.log('ClienteService: tap 2')
        response.forEach( cliente =>{
          console.log(cliente.nombre)
        }

        )
      })
    );
  }

  // Método para crear un nuevo cliente
  create(cliente: Cliente) : Observable<ExpectedResponse> {
    return this.http.post<ExpectedResponse>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      //map((response: any) => response.cliente as Cliente), /* No borrar */
      catchError(e => {

        // Manejo de errores específicos y notificación al usuario
        if(e.status==400){
          return throwError(() => new Error(e));
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    )
  }

  // Método para obtener un cliente por su ID
  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        // Redirección y notificación al usuario en caso de error
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(() => new Error(e));
      })
    );
  }

  // Método para actualizar un cliente existente
  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {

        // Manejo de errores específicos y notificación al usuario
        if(e.status==400){
          return throwError(() => new Error(e));
        }

        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    )
  }

  // Método para eliminar un cliente por su ID
  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
         // Manejo de errores específicos y notificación al usuario
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(() => new Error(e));
      })
    )
  }

}
