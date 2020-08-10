import React, { useCallback, useRef, useEffect } from 'react';
import css from 'styled-jsx/css';
import { colors } from '@/theme';
import TextArea from 'react-textarea-autosize';
import clsx from 'clsx';
import { usePostForm } from './logic';

const fileSelectorStyles = css`
  .file-selector {
    position: absolute;
    top: 12px;
    right: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    cursor: pointer;
  }
  i {
    color: ${colors.accent};
    font-size: 1.1em;
  }
  .file-selector.disabled {
    cursor: not-allowed;
  }
  .disabled > i {
    color: ${colors.caption};
  }
  input {
    display: none;
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
const FileSelector: React.FC<
  { uploading?: boolean; disabled?: boolean } & Pick<JSX.IntrinsicElements['input'], 'onChange'>
> = (props) => (
  <label className={clsx('file-selector', props.disabled && 'disabled')} htmlFor="fileSelector">
    <style jsx>{fileSelectorStyles}</style>
    <i className={clsx('uil', props.uploading ? 'uil-polygon spin' : 'uil-image-v')} />
    <input type="file" id="fileSelector" disabled={props.disabled} onChange={props.onChange} />
  </label>
);

const postButtonStyles = css`
  .post-button {
    position: absolute;
    top: 12px;
    right: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 86px;
    height: 36px;
    background-color: ${colors.accent};
    color: #fff;
    cursor: pointer;
  }
  .disabled {
    background-color: ${colors.caption};
    cursor: not-allowed;
  }
  i {
    margin: 0 4px 0 0;
  }
  i:before {
    margin: 0;
  }
`;
const PostButton: React.FC<{ disabled?: boolean }> = (props) => (
  <button type="submit" className={clsx('post-button', props.disabled && 'disabled')} disabled={props.disabled}>
    <style jsx>{postButtonStyles}</style>
    <i className="uil uil-anchor" />
    Post
  </button>
);

const postFormStyles = css`
  .post-form-container {
    position: sticky;
    top: 0;
    border-bottom: 1px solid ${colors.border};
    background-color: ${colors.foreground};
    z-index: 1;
  }
  .post-form-container > :global(*) {
    background-color: rgba(${colors.textRaw}, 0.025);
  }
  .post-form {
    position: relative;
  }
  .post-form > :global(.text-area) {
    display: block;
    width: 100%;
    min-height: 60px;
    max-height: 50vh;
    padding: 12px 172px 12px 18px;
    appearance: none;
    transition: height 0.2s;
    resize: none;
  }
`;
export const SeaPostForm = () => {
  const { dispatch, text, disabled, pending, submit } = usePostForm();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    submit();
  };
  const handleKeyDown = (ev: React.KeyboardEvent) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') {
      submit();
    }
  };
  const handleTextChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => dispatch({ type: 'textUpdated', text: ev.target.value }),
    [dispatch]
  );
  useEffect(() => {
    const handleKeypress = (ev: KeyboardEvent) => {
      if (ev.key === 'n') {
        textAreaRef.current?.focus();
      }
    };
    window.addEventListener('keypress', handleKeypress, { passive: true });
    return () => window.removeEventListener('keypress', handleKeypress);
  }, []);

  return (
    <div className="post-form-container">
      <style jsx>{postFormStyles}</style>
      <form className="post-form" aria-disabled={disabled || pending} onSubmit={handleSubmit}>
        <TextArea
          ref={textAreaRef}
          className="text-area"
          placeholder="What's up Otaku?"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
        />
        <FileSelector disabled />
        <PostButton disabled={disabled || pending} />
      </form>
    </div>
  );
};
