import { useReducer, useCallback } from 'react';
import { usePostToSea } from '@/features/SeaPosts';

type State = Readonly<{
  text: string;
}>;

type Actions = Readonly<
  | {
      type: 'textUpdated';
      text: string;
    }
  | {
      type: 'posted';
    }
>;

export type Dispatch = React.Dispatch<Actions>;

export function usePostForm() {
  const [state, dispatch] = useReducer(
    (prev: State, action: Actions) => {
      switch (action.type) {
        case 'textUpdated':
          return {
            ...prev,
            text: [...action.text].slice(0, 100).join(''),
          };
        case 'posted':
          return {
            ...prev,
            text: '',
          };
        default:
          return prev;
      }
    },
    { text: '' },
  );
  const disabled = state.text.length === 0;

  const { postToSea, pending } = usePostToSea();

  const submit = useCallback(() => {
    if (pending) return;
    postToSea({ text: state.text }).then(() => dispatch({ type: 'posted' }));
  }, [state, postToSea, pending]);

  return {
    dispatch,
    ...state,
    disabled,
    submit,
    pending,
  } as const;
}
