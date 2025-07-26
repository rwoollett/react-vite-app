
/**
 * This function can be used anywhere in the app to greet the user
 * @param userName The user's first name
 * @returns A kind greeting message
 */

export const sayHello = (userName: string): string => {
  return 'Welcome ' + userName + '!'
}

export const sayFarewell = (userName: string): string => {
  return 'Have a great day ' + userName + '!'
}

export function baseAuthUrl() {
  return `${import.meta.env.VITE_AUTH_URL}`;
}



