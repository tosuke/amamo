import React, { useEffect, useState } from 'react';
import { useHistory } from '@/middlewares/router';
import { DefaultLayout } from './_layout/DefaultLayout';
import { HeaderPlaceholder } from '../Header';
import { handleAuthCallback } from '@/infra/sea';

const AuthCallback = () => {
  const history = useHistory();
  const [error, setError] = useState<unknown>();
  useEffect(() => {
    const failure = (err: unknown) => {
      console.error(err);
      // history.push('/login');
      setError(err);
    };
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (code == null) {
      failure('code is required');
      return;
    }
    if (state == null) {
      failure('state is required');
      return;
    }
    handleAuthCallback(state, code)
      .then(() => {
        location.href = '/';
      })
      .catch((err) => {
        failure(err);
      });
  }, []);
  return (
    <DefaultLayout headerContent={<HeaderPlaceholder />}>
      Login...{error instanceof Error ? error.message : error}
    </DefaultLayout>
  );
};

export default AuthCallback;
