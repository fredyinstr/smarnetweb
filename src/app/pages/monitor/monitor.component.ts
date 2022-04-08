import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/UsuarioService';
import { timer} from 'rxjs';
import {takeWhile} from 'rxjs/operators';


@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})

export class MonitorComponent implements OnInit {
  private alive = true;
  MotoBomba = {
    estado: "ACTUALIZANDO",
    updated: ""
  }
  switchStatus = false;
  tag_id = '29';

  tags: any [] = [];

  options = {
    title: ''
  };
  max = 100;
  value = 0;

   // lineChart

    public lineChartLegend = true;
    public lineChartType = 'line';
    public lineChartData: Array<any> = [
    {
      data: [
      {x: 0, y: 0},
      {x: 5, y: 12},
      {x: 10, y: 1},
      {x: 15, y: 6},
      {x: 20, y: 18},
      {x: 25, y: 4},
      {x: 30, y: 25}
    ]}
  ];


  public lineChartOptions: any = {
    scales: {
            xAxes: [{
              time: {
                unit: 'minute'
                },
                type: 'time',
                distribution: 'series',
                position: 'bottom'
            }],
            yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
        },
        responsive: true,
        animation: false,
        legend: {
            display: false
          },
          elements: {
            line: {
              fill: false,
              tension: false
            },
          }

  };

  constructor( private _dataService: DataService,
              private router: Router, public _usuario: UsuarioService) { }

  monitor2() {
    this.router.navigate(['monitor2']);
  }

  hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
    );
}

retornaFecha( fecha ) {
  if (fecha === "")
    return "";
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const d = new Date(fecha);
  const hoy = new Date();

  const mes = meses[d.getMonth()];
  const dia = d.getDate();
  let mesdia = mes + ' ' + dia;
  if ((d.getMonth === hoy.getMonth) && (d.getDate() === hoy.getDate())) {
    mesdia = 'Hoy';
  }
  const minutes = d.getMinutes();
  return mesdia + ' ' + d.getHours() + ':' + String(minutes > 9 ? minutes : '0' + minutes);
}

retornaFecha1 ( fecha ) {
  const ahora = new Date().getTime();
  const diferencia = Math.ceil((ahora - new Date(fecha).getTime())/60000);
  return diferencia;

  if (fecha === "")
    return "";
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const d = new Date(fecha);
  const hoy = new Date();

  const mes = meses[d.getMonth()];
  const dia = d.getDate();
  let mesdia = mes + ' ' + dia;
  if ((d.getMonth === hoy.getMonth) && (d.getDate() === hoy.getDate())) {
    mesdia = 'Hoy';
  }
  const minutes = d.getMinutes();
  return mesdia + ' ' + d.getHours() + ':' + String(minutes > 9 ? minutes : '0' + minutes);
}

updateMotobomba(e) {
  console.log("update: ", e);
  this.MotoBomba.estado = "ACTUALIZANDO"
  this._dataService.onOffMotobomba(e?'1':'0')
    .subscribe((resp: any)=>{
      console.log("Respuesta update motobomba: ", resp);
      this.getEstadoBomba();
      
    })
  
}

  getEstadoBomba() {
    this._dataService.estadoBomba()
        .subscribe((status:any)=>{
          console.log("Respuesta estado bomba: ", status.estado.estado);
          this.MotoBomba.updated = status.estado.updatedAt;
          this.MotoBomba.estado = "ENCENDIDA";
          switch (status.estado.estado) {
            case "0":
              this.MotoBomba.estado = "APAGADA";
              this.switchStatus = false;
            break;
            case "1":
              this.MotoBomba.estado = "ENCENDIDA";
              this.switchStatus = true;
            break;
            default: 
              this.MotoBomba.estado = "ACTUALIZANDO";
              this.switchStatus = false;
            break;
          }
          
        })
  }
  ngOnInit() {
    // this.getEstadoBomba();
    // console.log("Iniciando monitor...");
    
    // this._dataService.tagsPorCliente(2)
    //   .subscribe((resp: any) => {
    //     console.log('Tags por cliente: ', resp.tags);
    //     this.tags = resp.tags;
    //   });

    if (this._usuario.tags.length === 0)
        this.router.navigate(['login']);
    this.tags = this._usuario.tags;
    console.log("Usuario: ", this._usuario.usuario);
    
    // console.log("tags: ", this.tags);
    // console.log("Cadena ecoded: ", this.hexToBase64("030101"));
    // console.log("Cadena ecoded: ", this.hexToBase64("030000"));
    // console.log("Cadena ecoded: ", this.hexToBase64("030001"));
    
    


      // console.log("Token: ", this._usuario.token);
      // console.log("cliente: ", this._usuario.cliente);
      // console.log("tags: ", this._usuario.tags);
      // console.log("perfil: ", this._usuario.usuario.usuario_perfil);

      timer(500, 60000).pipe(takeWhile(() => this.alive)).subscribe(() => {
        this.getEstadoBomba();

      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  
  

}
