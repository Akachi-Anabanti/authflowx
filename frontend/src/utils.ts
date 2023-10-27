export const getLocalToken = () => localStorage.getItem('token');

// cookie.ts
export const getCookieToken = (): string | null => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === 'hanko') {
        // Decode the cookie value to handle special characters
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  };

export const saveLocalToken = (token: string) => localStorage.setItem('token', token);

export const removeLocalToken = () => localStorage.removeItem('token');
