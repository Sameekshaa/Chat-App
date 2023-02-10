export interface SignupUsers {
  name:string;
  email:string;
  password:string;
  picture:string;
}

export interface LoginUsers {
  email: string;
  password: string;
}

export interface LogoutUsers {
  id:string;
}