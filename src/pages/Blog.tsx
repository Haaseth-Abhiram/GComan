import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Blog content has been consolidated into the Resources page
const Blog = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Resources page with articles tab
    navigate('/resources', { replace: true });
  }, [navigate]);

  return null;
};

export default Blog;
