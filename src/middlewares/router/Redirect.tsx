import React, { useEffect } from 'react';
import { useHistory } from './hooks';

export const Redirect: React.FC<{ href: string }> = ({ href, children }) => {
  const history = useHistory();
  useEffect(() => {
    history.push(href);
  }, [href]);
  return <>{children}</>;
};
