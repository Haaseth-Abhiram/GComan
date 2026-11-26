import { createContext, useContext } from 'react';

/**
 * URL prefix the tracker pages are mounted under. Defaults to the standalone
 * app (/proposal-tracker); the website admin mounts the admin modules under
 * /admin/proposal-tracker and provides that prefix instead, so in-page links
 * stay inside whichever shell is showing them.
 */
export const TrackerBaseContext = createContext('/proposal-tracker');
export const useTrackerBase = () => useContext(TrackerBaseContext);
