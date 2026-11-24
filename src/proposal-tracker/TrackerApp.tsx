import { Navigate, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TrackerAuthProvider } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { ProposalTrackerRoute } from '@/proposal-tracker/components/shell/ProposalTrackerRoute';
import ProposalTracker from '@/proposal-tracker/pages/ProposalTracker';
import TrackerLogin from '@/proposal-tracker/pages/TrackerLogin';

/** Internal proposal tracker, mounted at /proposal-tracker/*. Own demo login for now; never indexed. */
const TrackerApp = () => (
  <TrackerAuthProvider>
    <Helmet><meta name="robots" content="noindex, nofollow" /><title>Proposal Tracker | Global Chemicals</title></Helmet>
    <Routes>
      <Route path="login" element={<TrackerLogin />} />
      <Route path="*" element={<ProposalTrackerRoute><ProposalTracker /></ProposalTrackerRoute>} />
    </Routes>
  </TrackerAuthProvider>
);

export default TrackerApp;
