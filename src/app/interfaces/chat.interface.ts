import { User } from './user.interface';

export interface Chat {
  id: string;
  created_at: string;
  editable: boolean;
  sender: string;
  text: string;
  users: User;
}
