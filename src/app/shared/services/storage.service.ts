import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

/**
 * Provide services with localstorage
 */
export class StorageService {
  /* persist key token */
  ACCESS_TOKEN_KEY = 'access_token';
  ID_TOKEN_KEY = 'id_token';
  TOKEN_EXPIRED_KEY = 'token_expired';
  REFRESH_TOKEN_KEY = 'refresh_token';

  /**
   * Set data to localstorage
   * @param key: data of date
   * @param value: must be string, object, ...
   */
  public setToLocal(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Set data to sessionStorage
   * @param key: data of date
   * @param value: must be string, object, ...
   */
  public setToSession(key: string, value: any): boolean {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get data localstorage by key
   * @param key: key of data in localstorage
   */
  public getFromLocal(key: string): any | null {
    try {
      const val: string | null = window.localStorage.getItem(key);
      if (val) {
        return JSON.parse(val);
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
  /**
   * Get data sessionStorage by key
   * @param key: key of data in localstorage
   */
  public getFromSession(key: string): any | null {
    try {
      const val: string | null = sessionStorage.getItem(key);
      if (val) {
        return JSON.parse(val);
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

  /**
   * Remove data localstorage by key
   * @param key: key of data in localstorage
   */
  public removeFromLocal(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove data sessionStorage by key
   * @param key: key of data in sessionStorage
   */
  public removeFromSession(key: string): boolean {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove token data
   */
  public removeTokenData(): void {
    this.removeFromLocal(this.ACCESS_TOKEN_KEY);
    this.removeFromLocal(this.ID_TOKEN_KEY);
    this.removeFromLocal(this.TOKEN_EXPIRED_KEY);
    this.removeFromLocal(this.REFRESH_TOKEN_KEY);
    this.removeFromSession(this.ACCESS_TOKEN_KEY);
    this.removeFromSession(this.TOKEN_EXPIRED_KEY);
    this.removeFromSession(this.REFRESH_TOKEN_KEY);
    this.removeFromSession(this.ID_TOKEN_KEY);
  }
}
