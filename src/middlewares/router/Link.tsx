import { useContext, useCallback } from 'react';
import { RouterContext } from './RouterContext';

export const Link: React.FC<JSX.IntrinsicElements['a']> = (props) => {
  const { href } = props;
  const { history } = useContext(RouterContext)!;
  const handleClick = useCallback<NonNullable<typeof props.onClick>>(
    (ev) => {
      if (href != null) {
        ev.preventDefault();
        history.push(href);
      }
    },
    [history, href],
  );
  return <a onClick={handleClick} {...props} />;
};
