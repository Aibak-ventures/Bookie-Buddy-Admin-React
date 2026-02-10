import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext } from 'react-router-dom';

function usePrompt(message, when) {
  const { navigator } = useContext(UNSAFE_NavigationContext);

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;

    navigator.push = (...args) => {
      const confirm = window.confirm(message);
      if (confirm) {
        navigator.push = push;
        push(...args);
      }
    };

    return () => {
      navigator.push = push;
    };
  }, [when, message, navigator]);
}

export default usePrompt