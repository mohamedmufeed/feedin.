export interface UserRegistration  {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  email: string;
  password: string;
  confirmPassword: string;
  preferences: string[]; 
};


 export interface UserLoginData{
  email:string;
  password:string
 }

  export type ProfileForm = {
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   profileImage: string;
   dateOfBirth: string;
 };