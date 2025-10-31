export interface Message
{
  id?:number;
  usernameSender?:string;
  usernameReceiver?:string;
  archiviato?:boolean;
  timeStamp?: Date;
  title:string;
  content:string;
}
