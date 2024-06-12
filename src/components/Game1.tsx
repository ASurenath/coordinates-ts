import { useEffect, useRef, useState } from "react";
import Graph from "./Graph";

function Game1({
  X1,
  X2,
  Y1,
  Y2,
  setPage,
  }:{X1:number,X2:number,Y1:number,Y2:number,setPage:any}) {
  const [valid, setValid] = useState<boolean>(true);
  const [flagPos, setFlagPos] = useState<[number, number]|null>(null);
  const [inputX, setInputX] = useState<number>(0);
  const [inputY, setInputY] = useState<number>(0);
  const [isFlag, setIsFlag] = useState<boolean>(false);
  const xInput = useRef<HTMLInputElement>(null);
  const yInput = useRef<HTMLInputElement>(null);
  // // console.log(inputX,inputY);

  useEffect(() => {
    setInputX(flagPos?.[0]?flagPos[0]:0);
    setInputY(flagPos?.[1]?flagPos[1]:0);
  }, [flagPos]);
  const handleSetInput = (value:string, setValue:any, min:number, max:number) => {
    if(value=='-'){setValue('-');}
    else{setValue((value));}
    if (Number(value) > max ) {
      setValue(max);
    } else if (Number(value) < min) {
      setValue(min);
    } 
    if (parseInt(value)==Number(value) || value !== '') {
      setValid(true);
    } else {
      setValid(false);
    } 
  };
  const handleSubmit = async () => {
    setFlagPos([Math.round(inputX), Math.round(inputY)]);
    setIsFlag(true);
  };
  const handleOnKeyDownX = (e: any) => {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "Enter" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp"
    ) {
      // // console.log("key", e.key);
      e.preventDefault();
      if(yInput.current){yInput.current.focus();
      yInput.current.select();}
    }
  };
  const handleOnKeyDownY = (e: any) => {
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowDown"
    ) {
      // // console.log("key", e.key);
      e.preventDefault();
      if(xInput.current){xInput.current.focus();
      xInput.current.select();}
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <>
    
      <div className="flex flex-col lg:flex-row flex-wrap " style={{ minHeight: "100vh" }}> {/* Row* */}
        <div className="p-1 lg:px-5 flex justify-content-center align-items-center w-100 lg:w-4/6 ">{/* Col lg={8}*/}
          <div className=" my-3 w-full">
          <Graph
              x1={X1-1}
              x2={X2+1}
              y1={Y1-1}
              y2={Y2+1}
              flagType={"white"}
              flagX={flagPos&&flagPos[0]}
              flagY={flagPos&&flagPos[1]}
              setFlagX={(v:number)=>{setFlagPos((prev:any) => ({ ...prev, 0: v }))}}
              setFlagY={(v:number)=>{setFlagPos((prev:any) => ({ ...prev, 1: v }))}}
              isClickable={true}
              learnMode={true}

            ></Graph>
          </div>
        </div>
        <div className="w-100 lg:w-2/6"> {/*Col lg={4}*/}
          <div className="lg:pt-5 lg:mt-5">
            <div
              className="flex justify-center items-center xs:w-100"
            > {/* Col xs={12}*/}
              <button
                onClick={() => {
                  setPage("menu");
                }}
                className="text-sm btn btn-primary p-1 sm:p-2 sm:px-3"
              >
                Back to menu
              </button>
            </div>
            <div
              className="flex justify-center items-center xs:w-100" > {/* Col xs={12} */}
            <small className="text-white fs-6">(Click on the graph or enter coordinates)</small>

            </div>
 
            <div
              className="flex justify-center items-center mt-2 xs:w-1/3 lg:w-100"
            > {/* Col
            lg={12}
            xs={4} */}
              <h1 className="text-white">x</h1>
              <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
              <input
                type="number"
                className="form-control small-input"
                value={inputX}
                onChange={(e) =>
                  handleSetInput(e.target.value, setInputX,X1 , X2)
                }
                // onClick={(e) => {
                //   e.target.select(); // fix later
                // }}
                onKeyDown={handleOnKeyDownX}
                ref={xInput}
                min={X1}
                max={X2}
              />
            </div>
            <div
              className="flex justify-center items-center mt-2"
            >{/* Col lg={12}
            xs={4} */}
              <h1 className="text-white">y</h1>
              <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
              <input
                type="number"
                className="form-control small-input"
                value={inputY}
                onChange={(e) =>
                  handleSetInput(e.target.value, setInputY, Y1, Y2)
                }
                // onClick={(e) => {
                //   e.target.select(); // fix later
                // }}
                ref={yInput}
                onKeyDown={handleOnKeyDownY}
                min={Y1}
                max={Y2}
              />
            </div>
            <div 
              className="flex justify-center items-center mt-2"
            > {/* Col
            lg={12}
            xs={4} */}
              <button
                disabled={!valid}
                onClick={handleSubmit}
                className="text-sm p-1 sm:p-2 sm:px-3 btn btn-warning"
              >
                Set flag
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Game1;
