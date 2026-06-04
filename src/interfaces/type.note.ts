export type INoteList = {
  _id: string;
  title: string;
  content: string;
  isPinned:boolean;
  createdAt:Date;

};
export type INote = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  isPinned: boolean;
  isTrashed: boolean;
  isArchived: boolean;
  color: string;
  createdAt: Date;
};


export type IUser={
  email:string,
  username:string,
  password:string,
}



export type ErrorType={
  response:{
    data:{
      success:boolean;
      message:string;
    }
  }
}



export type ApiCustomerError={
   success:boolean,
   message:string,
   code?:string    
}






