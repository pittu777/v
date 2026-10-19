
import { useEffect } from "react";



function useEventListener<K extends keyof WindowEventMap>(eventName:K, handler:(event: WindowEventMap[K]) => void) {
  useEffect(() => {
    window.addEventListener(eventName, handler);

    return () => {
      window.removeEventListener(eventName, handler);
    };
  }, [eventName, handler]);
}

export default useEventListener;


useEventListener("resize", ()=>{
    console.log("resizing");
})
