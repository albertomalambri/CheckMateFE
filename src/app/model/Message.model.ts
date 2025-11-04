export interface MessageModel
{
  id?:number;
  usernameSender:string;
  usernameReceiver:string;
  archiviato?:boolean;
  timeStamp?:Date;
  read: boolean;
  title:string;
  content:string;
}
