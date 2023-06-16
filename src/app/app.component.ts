import { Component, OnInit } from '@angular/core';
//Rxjs
import {pipe, of } from 'rxjs'; //Obs
import {Observable, Observer, fromEvent} from 'rxjs';
import {delay, filter, map, tap, scan, mergeMap} from 'rxjs/operators'; //Opers
import {ajax} from 'rxjs/ajax';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'my-project';

  /*******************[ 07 APIs Map - MergeMap ]*********************/

  //https://rickandmortyapi.com/documentation
  //https://rickandmortyapi.com/api/character/1

  API_URL = 'https://rickandmortyapi.com/api/character/1';
  API_URL_ID = 'https://rickandmortyapi.com/api/character/';

  //MAP: returna valor, remapea los datos.
  //MERGEMAP: Retorna un observer distinto para realizar un 2do llamado.

  //declare observable
  click$ = fromEvent(document, 'click');

  mypipe = this.click$
    .pipe(
      map(
        (data) => {
          if(data.isTrusted){
            return 3; //id=10
          }
          return 5;//id=5
        }
      ),
      mergeMap(
        (id:number) => ajax.getJSON(`${this.API_URL_ID}/${id}`)
        //() => ajax.getJSON(this.API_URL)
      ),
      map(
        (data: any) => {
          return `El nombre del personaje es : ${data.name}`
        }
      ),
    ).subscribe(console.log);

  ngOnInit(): void { }

}
