import { Navigate } from 'react-router-dom';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';

export const ProposalTrackerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/proposal-tracker/login" replace />;
  return <>{children}</>;
};
