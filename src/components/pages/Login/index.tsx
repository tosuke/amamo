import css from 'styled-jsx/css';
import { DefaultLayout } from '../_layout/DefaultLayout';
import { HeaderPlaceholder } from '@/components/Header/Placeholder';
import { useAuthorizeUrl } from '@/infra/sea';

const loginPageStyles = css`
  .landing {
    padding: 12px;
  }
`;
const Login = () => {
  const { url, handleClick } = useAuthorizeUrl();
  return (
    <DefaultLayout headerContent={<HeaderPlaceholder />}>
      <style jsx>{loginPageStyles}</style>
      <div className="landing">
        <h1>認証!!</h1>
        <h2>
          <a href={url} onClick={handleClick}>
            Auth with {new URL(process.env.AUTH_ROOT!).host}
          </a>
        </h2>
      </div>
    </DefaultLayout>
  );
};

export default Login;
