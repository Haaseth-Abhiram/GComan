import { useLayoutEffect } from 'react';
import './portal-theme.css';

// Counts mounted users so moving between /portal and /admin keeps the theme on.
let users = 0;

/** Applies the signed-in area's look to <body> while the calling screen is shown. */
export const usePortalTheme = () => {
  useLayoutEffect(() => {
    users += 1;
    document.body.classList.add('portal-theme');
    return () => {
      users -= 1;
      if (!users) document.body.classList.remove('portal-theme');
    };
  }, []);
};
