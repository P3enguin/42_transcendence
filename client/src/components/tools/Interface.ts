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
    (e:React.ChangeEvent<HTMLInputElement>) : void;
  }
  

export interface handleKeyUp {
    handleKeyUp(field1: string, len: number, field2: string): () => void;
  }