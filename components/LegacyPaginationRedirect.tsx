import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const LegacyPaginationRedirect: React.FC = () => {
  const params = useParams<{ primary?: string; secondary?: string; tertiary?: string; pageNumber?: string }>();
  const { pageNumber, primary, secondary, tertiary } = params;

  if (!pageNumber || !primary) {
    return <Navigate to="/" replace />;
  }

  const segments = [primary, secondary, tertiary].filter(Boolean).map((segment) => encodeURIComponent(segment!));
  const targetPath = `/${segments.join('/')}/עמוד/${pageNumber}`;

  return <Navigate to={targetPath} replace />;
};

export default LegacyPaginationRedirect;
