import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
const backendUrlSocketIo = environment.backendUrlSocketIo;

@Injectable({providedIn: 'root'})


export class WebSocketService {

  private socket = io(backendUrlSocketIo);

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  listen(eventName: string) {
    return new Observable<{message: any}>((response) => {
      this.socket.on(eventName, (data) => {
        response.next(data);
      });
    });
  }
}
