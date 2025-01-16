import { useEffect } from 'react';

export default function withLogging(WrappedComponent) {
  return function WithLoggingComponent(props) {
    useEffect(() => {
      console.log(`[${WrappedComponent.name}] mounted`);
      return () => {
        console.log(`[${WrappedComponent.name}] unmounted`);
      };
    }, []);

    useEffect(() => {
      console.log(`[${WrappedComponent.name}] props updated:`, props);
    }, [props]);

    return <WrappedComponent {...props} />;
  };
} 