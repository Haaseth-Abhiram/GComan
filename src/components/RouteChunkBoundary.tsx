import { Component, ReactNode } from 'react';
import { isChunkLoadError } from '@/lib/lazyRetry';
import { getPrerenderSnapshot } from '@/lib/prerenderSnapshot';

// Keeps the prerendered page on screen when the initial route chunk cannot be
// fetched at all.
//
// The snapshot fallback (prerenderSnapshot.ts) covers a SLOW chunk. A chunk that
// FAILS (lazyRetry's retries exhausted) throws instead, and the app-wide
// ErrorBoundary replaced the page with "Something went wrong". GSC live test
// 2026-10-18: Google's renderer failed to fetch LaboratoryChemicalsOman.tsx-*.js
// (the file served 200 to curl), got the error card, and rejected the indexing
// request as a Soft 404. Googlebot does not take lazyRetry's recovery reload, so
// the only content it can index is what stays in the DOM.
//
// Here: a chunk-load error while the prerendered snapshot still exists (the
// first route never committed) renders the snapshot, identical to the
// prerendered page. Anything else is rethrown to the ErrorBoundary.
interface State {
  error: Error | null;
}

export default class RouteChunkBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const html = isChunkLoadError(error) ? getPrerenderSnapshot() : null;
    if (!html) throw error; // not ours: the ErrorBoundary above handles it
    return <div data-prerender-snapshot dangerouslySetInnerHTML={{ __html: html }} />;
  }
}
