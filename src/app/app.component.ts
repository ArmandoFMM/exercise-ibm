import { Component, OnInit } from '@angular/core';
import { ContasDataService } from './contas-data.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public tiposConta: any[];
  public tiposCliente: any[];
  public clientes: any[];
  public cambios: any[];
  public totais: any[];

  constructor(public contasService: ContasDataService) {}

  ngOnInit() {

    this.getTiposConta();
    this.getTiposCliente();
    this.getClientes();
    this.getCambios();
  }

  getTiposConta() {
    this.contasService.getTiposContaData().subscribe((data) => {
      this.tiposConta = [];
      const list = data.split(/\r?\n/);
      list.map((element) => {
        const aux = element.split('|');
        if (aux[0]) {
          this.tiposConta.push({id: aux[0], descricao: aux[1]});
        }
        // this.tiposConta = this.ordenarPorKey(this.tiposConta, 'id');
      })
      console.log(this.tiposConta);

    });
  }

  getTiposCliente() {
    this.contasService.getTiposClienteData().subscribe((data) => {
      // console.log(data);
      this.tiposCliente = []
      const list = data.split(/\r?\n/);
      list.map((element) => {
        const aux = element.split('|');
        if (aux[0]) {
          this.tiposCliente.push({id: aux[0], descricao: aux[1]});
        }
        // this.tiposCliente = this.ordenarPorKey(this.tiposCliente, 'id');
      });

      console.log(this.tiposCliente);
    });
  }

  getCambios() {
    this.contasService.getCambiosData().subscribe((cambios) => {
      this.cambios = cambios
        this.cambios = this.ordenarPorKey(this.cambios, 'id');

      console.log(this.cambios);
    });
  }

  getClientes() {

    this.contasService.getClientesDetails().subscribe((clientes) => {

      this.contasService.getContasData().subscribe((accounts) => {
        this.clientes = []
        const list = accounts.split(/\r?\n/);
        list.map((element, i) => {
          const aux = element.split('|');
          if (aux[0]) {
            if (this.searchPorId(aux[0], this.clientes)) {
              let cliente = this.searchPorId(aux[0], this.clientes);
              cliente['contas'].push({
                  tipo: aux[2],
                  saldo: Number.parseFloat(aux[3]),
                  moeda: Number.parseInt(aux[4])
                });

              // cliente['contas'] = this.ordenarPorKey(cliente['contas'], 'tipo');

              cliente = this.checkColaterizado(cliente);

              this.clientes[this.clientes.indexOf(cliente)] = cliente;

            } else {

              let cliente = {
                id: aux[0],
                tipoCliente: {
                  id: this.searchPorId(aux[0], clientes)['tipoId'],
                  descricao: this.searchPorId(this.searchPorId(aux[0], clientes)['tipoId'], this.tiposCliente)['descricao']
                },
                contas: [ {
                  tipo: aux[2],
                  saldo: Number.parseFloat(aux[3]),
                  moeda: Number.parseInt(aux[4])
                }]
              }

              cliente = this.checkColaterizado(cliente);

              this.clientes.push(cliente);

            }
          }
        this.clientes = this.ordenarPorKey(this.clientes, 'id');
        });

        console.log(this.clientes);

        this.totais = this.getTotais(this.tiposCliente, this.tiposConta, this.clientes);

      });

    });

  }

  ordenarPorKey(array, key) {

    return array.sort((a, b) => {
        const x = Number.parseInt(a[key]);
        const y = Number.parseInt(b[key]);

        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

searchPorId(id, array): object {

  for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
          return array[i];
      }
  }
}


checkColaterizado(cliente) {

    let colateral = 1;
    let emprestimo = 1;
      cliente.contas.forEach((conta) => {
        if (Number.parseInt(conta.tipo) === 90) {
          colateral += conta.saldo * this.cambios[conta.moeda - 1].valor;
        } else if (Number.parseInt(conta.tipo) === 50) {
          emprestimo += conta.saldo * this.cambios[conta.moeda - 1].valor;
        }
      });

      if (colateral >= emprestimo) {
        cliente['colaterizado'] = 'S';
      } else {
        cliente['colaterizado'] = 'N';
      }

      return cliente;

  }

  somaSaldoTipo(contas, tipoId) {
    let saldo = 0;
    contas.forEach((conta) => {
      if (Number.parseInt(conta.tipo) === Number.parseInt(tipoId)) {
        saldo += conta.saldo * this.cambios[conta.moeda - 1].valor;
      }
    });

    return saldo;

  }

  getTotais(tiposCliente, tiposConta, clientes) {
    const totais = [];

    tiposCliente.forEach(tipoCliente => {
      tiposConta.forEach(tipoConta => {
        let total = 0;
        clientes.forEach(cliente => {
          if (cliente.tipoCliente.id === tipoCliente.id) {
            total +=  this.somaSaldoTipo(cliente.contas, tipoConta.id);
          }
        });
        totais.push(total);
      });
    });

    return totais;

  }

}
