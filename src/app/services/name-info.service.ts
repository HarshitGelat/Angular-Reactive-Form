import { Injectable } from "@angular/core";
import { of, Observable } from "rxjs";

/**
 * This service returns an observable with a message, which varies depending on which name is provided.
 * We return an observable because this service might involve a server-call in the future.
 * You should debounce any calls to `getNameInfo` so that it doesn't call the server too much.
 */

@Injectable({
  providedIn: "root"
})
export class NameInfoService {
  constructor() {}

  public getNameInfo(name: string): Observable<string> {
    if (name == null || name === "") return of("No name entered yet.");
    const [firstName] = name.toLowerCase().split(" ");
    let number = firstName.length;
    return of(`Your lucky number is ${number}.`);
  }
}
