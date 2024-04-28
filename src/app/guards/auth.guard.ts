import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageUtil } from '@utils/local-storage.util';

export const isAuthenticatedGuard: CanActivateFn = () => {
  if (!!LocalStorageUtil.getUserSession()) {
    return true;
  }

  inject(Router).navigate(['login']);
  return false;
};

export const notAuthenticatedGuard: CanActivateFn = () => {
  if (!LocalStorageUtil.getUserSession()) {
    return true;
  }

  inject(Router).navigate(['chat']);
  return false;
};
