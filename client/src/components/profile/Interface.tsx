export interface data {
    nickname: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    coins: number;
    // picture: event.target.picture.value,
}


export interface statObj {
    valid: boolean;
    touched: boolean;
}

export interface validFunc {
    (e:React.FocusEvent<HTMLInputElement, Element>) : void;
  }
  