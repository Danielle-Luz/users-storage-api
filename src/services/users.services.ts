import { iUser } from './../interfaces/users.interfaces';

const userModel: iUser = {
  id: 0,
  name: "",
  email: "",
  password: "",
  admin: false,
  active: false
}

const userModelKeys: string[] = Object.keys(userModel);