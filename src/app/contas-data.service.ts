import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ContasDataService {

  constructor(public http: Http) { }

  getTiposContaData(): Observable <any> {
    return this.http.get('assets/tipos-conta.txt')
    .map((response: Response) => response.text());
  }

  getTiposClienteData(): Observable <any> {
    return this.http.get('assets/tipos-cliente.txt')
    .map((response: Response) => response.text());
  }


  getContasData() {
    return this.http.get('assets/contas.txt')
    .map((response: Response) => response.text());
  }

  getClientesDetails() {
    return this.http.get('assets/clientes.txt')
    .map((response: Response) => response.text()).map((response) => {
      const clientes = [];
      const list = response.split(/\r?\n/);
      list.map((element) => {
        const aux = element.split('|');
        if (aux[0]) {
          clientes.push({id: aux[0], tipoId: aux[1]});
        }
      });

      return clientes;
    });
  }

  getCambiosData() {
    return this.http.get('assets/cambios.txt')
    .map((response: Response) => response.text()).map((response) => {
      const cambios = [];
      const list = response.split(/\r?\n/);
      list.map((element) => {
        const aux = element.split('|');
        if (aux[0]) {
          cambios.push({id: aux[0], abreviatura: aux[1], valor: Number.parseFloat(aux[2])});
        }
      });

      return cambios;
    });
  }

}
