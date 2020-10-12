import { useEffect } from 'react';
import { useHistory } from '@/middlewares/router';
import { DefaultLayout } from './_layout/DefaultLayout';
import { HeaderPlaceholder } from '../Header/Placeholder';
import { handleAuthCallback } from '@/infra/sea';

const AuthCallback = () => {
  const history = useHistory();
  useEffect(() => {
    const failure = (err: unknown) => {
      console.error(err);
      history.push('/login');
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
  return <DefaultLayout headerContent={<HeaderPlaceholder />}>Login...</DefaultLayout>;
};

export default AuthCallback;
