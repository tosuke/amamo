import React from 'react';
import css from 'styled-jsx/css';
import { colors } from '@/theme';
import clsx from 'clsx';

const searchFormStyles = css`
  /* post-form-container と同じなので頑張って統一する */
  .search-form-container {
    position: sticky;
    top: 0;
    border-bottom: 1px solid ${colors.border};
    background-color: ${colors.foreground};
    z-index: 1;
  }
  .search-form {
    padding: 12px 18px;
    background-color: rgba(${colors.textRaw}, 0.025);
  }
  label {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  i {
    color: ${colors.accent};
    font-size: 1.1em;
  }
  input {
    margin-left: 4px;
    padding: 4px;
    border-radius: 3px;
    border: 1px solid ${colors.border};
  }
  .spin {
    animation: spin 1.5s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export type SearchFormProps = Readonly<{
  value: string;
  onChange: (query: string) => void;
  pending?: boolean;
}>;
export const SearchForm = ({ value, onChange, pending }: SearchFormProps) => {
  return (
    <div className="search-form-container">
      <style jsx>{searchFormStyles}</style>
      <div className="search-form">
        <label>
          <i className={clsx('uil', pending ? ['uil-polygon', 'spin'] : 'uil-search')} />
          <input type="text" value={value} placeholder="%クエリ%" onChange={(ev) => onChange(ev.target.value)} />
        </label>
      </div>
    </div>
  );
};
