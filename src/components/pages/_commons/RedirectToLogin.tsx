import { Redirect } from '@/middlewares/router';

export const RedirectToLogin: React.FC = (props) => <Redirect href="/login">{props.children}</Redirect>;
