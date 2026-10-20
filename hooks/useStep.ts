// import useStep from "./useStep";

import { useState } from "react"

const useStep = (steps=3)=>{
    
    const [step, setStep] = useState(steps);

    let count = steps;

    const goToNextStep=()=>{
        if(count != 0){
            setStep((prev) => prev+1);
            count = count - 1;
        }else{
            console.log("this is the end!");
            return;
        }
    }

    const goToPrevStep=()=>{
        if(count != steps){
            setStep((prev) => prev-1);
            count = count + 1;
        }else{
            console.log("this is the first!");
            return;
        }
    }

    const reset=()=>{
        setStep(steps);
    }

    return{
        step,
        setStep,
        goToNextStep,
        goToPrevStep,
        reset,

    }
}