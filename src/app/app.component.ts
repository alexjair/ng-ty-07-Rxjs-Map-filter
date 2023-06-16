import { Component, OnInit } from '@angular/core';
//Rxjs
import {pipe, of, interval, BehaviorSubject, ReplaySubject } from 'rxjs'; //Obs
import {Observable, Observer, fromEvent} from 'rxjs';
import {delay, filter, map, tap, scan, mergeMap, skipUntil, shareReplay, catchError} from 'rxjs/operators'; //Opers
import {ajax} from 'rxjs/ajax';
import * as internal from 'stream';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'my-project';

  ngOnInit(): void { }

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


  /*******************[ 08 operatiosn de "SkipUtil" y "ShareReplay" ]*********************/

  obsInterval$ = interval(2000);

  emitAfterClick = this.obsInterval$
  .pipe(
    //Si no hay cambios no emito.
    skipUntil(this.click$),
  )
  .subscribe(
    v => console.log(` emitAfterClick ${v}`)
  );


  emitAndShare = this.obsInterval$
    .pipe(
      //te voy a dar el ultimo dato emitido
      shareReplay()
    );

  funPrimer(){
      this.emitAndShare.subscribe(
        v => console.log(`emitAndShare No1 : ${v}`)
      );
  }

  funSegundo(){
    this.emitAndShare.subscribe(
      v => console.log(`emitAndShare No2 : ${v}`)
    );
  }

  /*******************[ 09 "CatchError Rxjs" ]*********************/

  //Errores en Rxjs

  obsErrores$ = of("Welcome Gente","Como estan?","Hola Gente");

  obsErroresPipe = this.obsErrores$.pipe(
    map(
      (v) => {
        if(v ==="Hola Gente"){
          throw "Saludo Incorrecto";
        }
        return v;
      }
    ),
    catchError(
      (err) => {
        throw "Error: "+ err;
      }
    ),
  );

  funErrorCatch(){
    this.obsErroresPipe.subscribe(
      (x) => console.log(`next: `+x),
      (err) => console.log(`err: `+err),
    );
  }

  /*******************[ 10 "BehaviorSubject y ReplaySubject" ]*********************/

  //Emite el ultimo valor a cada nueva de subscriptions
  obsSaludos$ = new BehaviorSubject("Primer Valor Welcome inicio");

  obsData$ = of(1,2,3,4,5,6,7,8,9,);

  funBehaviorSubject(){

    this.obsSaludos$.subscribe(
      (v) => {
        console.log(`1er Saludo: "${v}"`);
      }
    );

    this.obsData$.subscribe(
      (x) =>{
        this.obsSaludos$.next(`obsData dt: New ${x}`);
      }
    );

    this.obsSaludos$.subscribe(
      (v) => {
        console.log(`Ultimo Saludo:  "${v}"`);
      }
    );
  }

  //Te permite generar desde el incio hasta el final, para cada nueva subcriptions
  obsSaludosreplay$ = new ReplaySubject();

  funReplaySubject(){

    this.obsSaludosreplay$.subscribe(
      (v) => {
        console.log(`1er Saludo: "${v}"`);
      }
    );

    this.obsData$.subscribe(
      (x) =>{
        this.obsSaludosreplay$.next(`obsData dt: New ${x}`);
      }
    );

    this.obsSaludosreplay$.subscribe(
      (v) => {
        console.log(`Ultimo Saludo:  "${v}"`);
      }
    );
  }

  /*******************[ 11 "Testing" ]*********************/



}
