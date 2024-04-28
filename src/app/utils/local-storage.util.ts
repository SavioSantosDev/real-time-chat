import { User } from '@supabase/supabase-js';

export class LocalStorageUtil {
  private static readonly KEY = {
    USER_SESSION: 'USER_SESSION'
  };

  static clear(): void {
    localStorage.clear();
  }

  static setUserSession(user: User) {
    localStorage.setItem(this.KEY.USER_SESSION, JSON.stringify(user));
  }

  static getUserSession(): User {
    const userSession = localStorage.getItem(this.KEY.USER_SESSION);
    return userSession ? JSON.parse(userSession) : null;
  }
}
