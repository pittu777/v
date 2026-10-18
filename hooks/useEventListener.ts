
import { useEffect } from "react";

type Handler = (event:Event) => void;

function useEventListener(eventName:string, handler:Handler) {
  useEffect(() => {
    window.addEventListener(eventName, handler);

    return () => {
      window.removeEventListener(eventName, handler);
    };
  }, [eventName, handler]);
}

export default useEventListener;
