import React, {} from 'react';

import { commitAppSession, destroyAppSession, getAppSession } from './session.server';

interface ITempPassword {
  userId: string 
  hash: string
};

interface ITempUser {
  id: string 
  username: string 
  email?: string 
  password?: ITempPassword
  avatarUrl?: string 
};
interface ITempSession {
  userId: string 
  data: any
};

interface ITempSettings {
  theme: 'light' | 'dark' | string | null;
  scripts: boolean | null;
}
interface IAppService {
  user?: ITempUser | string | null;
  session?: ITempSession | string | null;
  settings?: ITempSettings | string | null;
}
/**
 * Only store id's for each, generate and return the data in methods
 */
export default class AppService implements IAppService {
  // request: Request;
  user?: ITempUser | string | null;
  session?: ITempSession | string | null;
  settings?: ITempSettings | string | null;
  cache: Map<string, any> = new Map();
  current_ts: string = new Date().toString();
  constructor(settings?: ITempSettings) {
      if (!settings) {settings = {theme: 'light', scripts: true}};
      this.settings = settings;
      // let session = getAppSession(this.request.headers.get("Cookie"));
      // this.session = session;
      // let theme = session.get("theme");
      // if (!theme || typeof theme !== 'string') session.set('theme', this.settings.theme);
      
    };
}