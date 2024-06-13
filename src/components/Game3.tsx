import { useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import CustomAlert from "./CustomAlert";

function Game3({ X1, X2, Y1, Y2, setPage,transitType,isTimer,timer,totalLaps }:{X1:number,X2:number,Y1:number,Y2:number,setPage:any,transitType:number,isTimer:boolean,timer:number,totalLaps:number}) {
  const [step, setStep] = useState<number>(0);
  const [carAngle, setCarAngle] = useState<number>(0);
  const [carX, setCarX] = useState<number>(0);
  const [carY, setCarY] = useState<number>(0);
  const [lap, setLap] = useState<number>(0);
  const [alertType,setAlertType]=useState<string>("success");
  const [message,setMessage]=useState<string>("");
  const [showAlert,setShowAlert]=useState<boolean>(false);


  const [flagPos, setFlagPos] = useState<[number, number]|null>([0, 0]);
  // const [inputX, setInputX] = useState(0);
  // const [inputY, setInputY] = useState(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [targetPos, setTargetPos] = useState<[number, number]|null>(null);
  const [paths, setPaths] = useState<{x1:number,y1:number,x2:number,y2:number,color:string}[]>([]);
  const [coordinates, setCoordinates] = useState<{x:number,y:number,color:string}[]>([]);
  const [tempPath, setTempPath] = useState<{x1:number,y1:number,x2:number,y2:number,color:string}|null>(null); // ();
  // const xInput = useRef(null);
  // const yInput = useRef(null);
  const [won, setWon] = useState<boolean>(false);
  const [winTime, setWinTime] = useState<number>(0);
  const [valid, setValid] = useState<boolean>(true);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(timer);
  const [isCountDownPaused, setIsCountDownPaused] = useState<boolean>(false);
  const [showPaths, setShowPaths] = useState<boolean>(true);
  const [showCoordinates, setShowCoordinates] = useState<boolean>(true);

  // // // console.log("countDown",countDown);
  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      setStep(step + 1);
      if(!isCountDownPaused&&isTimer){setCountDown(countDown-100);}
      if(countDown<=0){
        setIsTimeUp(true);
        clearInterval(interval);
        setCountDown(0);
        setIsCountDownPaused(true);
      }
    }, 100);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    handleSetTargetPos();
  }, []);

  ///////////////////////////////////////////____PARAMETERS___/////
  // const totalLaps = 5;
  const rotateTime = 500;
  const transitTime = 1000;

  const handleSetTargetPos = () => {
    while (true) {
      let x = Math.floor(Math.random() * (X2 - X1) + X1);
      let y = Math.floor(Math.random() * (Y2 - Y1) + Y1);
      if (!coordinates.map((c) => [c.x, c.y]).includes([x, y])) {
        setTargetPos([x, y]);
        break;
      }
    }
    setCountDown(timer);
    setIsCountDownPaused(false);
  };
  const rotateCar = async (angle: number) => {
    let time = 0;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (time >= rotateTime) {
          clearInterval(interval);
          resolve(void 0);
        } else {
          setCarAngle((prevAngle) => prevAngle + (angle * 100) / rotateTime);
          time += 100;
        }
      }, 100);
    });
  };
  const translateCar1 = async (x: number, y: number) => {
    setIsCountDownPaused(true);
    let time = 0;
    let dispX = x - carX;
    let dispY = y - carY;
    let x1 = carX;
    let y1 = carY;
    setCarAngle(90-Math.sign(x-x1)*90);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (time >= 2 * transitTime) {
          setTempPath(null);
          setIsCountDownPaused(false);
          setCarX(0)
          setCarY(0)
          clearInterval(interval);
          resolve(void 0);
        }
        if (time < transitTime) {
          setCarX((oldCarX) => oldCarX + (dispX * 100) / transitTime);
          setTempPath({
            x1: x1,
            y1: y1,
            x2: x1 + (dispX * time) / transitTime,
            y2: y1,
            color: "yellow",
          });
          time += 100;
        } else {
          setCarY((oldCarY) => oldCarY + (dispY * 100) / transitTime);
          setTempPath({
            x1: x,
            y1: y1,
            x2: x,
            y2: y1 + (dispY * (time - transitTime)) / transitTime,
            color: "yellow",
          });
          if (time == transitTime) {
            setCarX(x);
            setCarAngle(Math.sign(y-y1)*90);
            if (targetPos&&x == targetPos[0]) {
              coordinates.push({ x: x, y: y1, color: "limegreen" });
              paths.push({ x1: x1, y1: y1, x2: x, y2: y1, color: "limegreen" });
            } else {
              coordinates.push({ x: x, y: y1, color: "yellow" });
              paths.push({ x1: x1, y1: y1, x2: x, y2: y1, color: "yellow" });
            }
          }
          if (time == 2 * transitTime) {
            setCarY(y);
            if (targetPos&&y == targetPos[1]) {
              coordinates.push({ x,y, color: "limegreen" });
              paths.push({ x1: x, y1: y1, x2: x, y2: y, color: "limegreen" });
            } else {
              coordinates.push({ x,y, color: "yellow" });
              paths.push({ x1: x, y1: y1, x2: x, y2: y, color: "yellow" });
            }
          }

          time += 100;
        }
      }, 100);
    });
  };
  const translateCar2 = async (x:number, y:number) => {
    setIsCountDownPaused(true);
    let time = 0;
    let dispX = x - carX;
    let dispY = y - carY;
    let x1=carX
    let y1=carY
    let angle = 0;
    switch (true) {
      case dispX === 0 && dispY > 0:
        angle = 90;
        break;
      case dispX === 0 && dispY < 0:
        angle = 270;
        break;
      case dispX > 0:
        angle = (Math.atan(dispY / dispX) * 180) / Math.PI;
        break;
      case dispX < 0 && dispY >= 0:
        angle = 180 + (Math.atan(dispY / dispX) * 180) / Math.PI;
        break;
      case dispX < 0 && dispY < 0:
        angle = -180 + (Math.atan(dispY / dispX) * 180) / Math.PI;
        break;
    }

    // // // console.log("x,y", x, y);
    await rotateCar(angle - carAngle);
    // // // console.log("carAngle", carAngle);
    setCarAngle(angle);
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (time >= transitTime) {
          setTempPath(null);
          setIsCountDownPaused(false);
          clearInterval(interval);
          resolve(void 0);
        } else {
          setCarX((oldCarX) => oldCarX + (dispX * 100) / transitTime);
          setCarY((oldCarY) => oldCarY + (dispY * 100) / transitTime);
          setTempPath({x1:x1,y1:y1,x2:x1+(dispX * time) / transitTime,y2:y1+ (dispY * time) / transitTime,color:"yellow"})
          time += 100;
        }
        if (time == transitTime) {
          setCarX(x);
          setCarY(y);
          // // console.log("x,y", x, y,carX,carY);

          if (targetPos&&x == targetPos[0]&& y == targetPos[1]) {
            coordinates.push({ x,y, color: "limegreen" });
            paths.push({ x1: x1, y1: y1, x2: x, y2: y, color: "limegreen" });
          } else {
            coordinates.push({ x,y ,color: "yellow" });
            paths.push({ x1: x1, y1: y1, x2: x, y2: y, color: "yellow" });
          }
        }
      }, 100);
    });
  };
  // const handleSetInput = (value, setValue, min, max) => {
  //   setValue(parseInt(value));
  //   if (value > max ) {
  //     setValue(max);
  //   } else if (value < min) {
  //     setValue(min);
  //   } else if (parseInt(value)==value || value !== '') {
  //     setValid(true);
  //   } else {
  //     setValid(false);
  //   } 
  // };
  const handleSubmit = async () => {
    setIsCountDownPaused(true);
    let x1 = carX;
    let y1 = carY;
    let x2:number|undefined = flagPos?.[0];
    let y2:number|undefined = flagPos?.[1]
    setSubmitted(true);
    if(x2!=undefined && y2!=undefined){if(transitType==1){
      await translateCar1(x2, y2)
      setCarX(0);
        setCarY(0);
        setCarAngle(0);
      ;}
      else{
        await translateCar2(x2, y2)  
        setCarX(x2);
        setCarY(y2);
      }}
      setTempPath(null)

    if ( targetPos && x2 == targetPos[0] && y2 == targetPos[1]) {
      setTempPath(null);
      if (lap == totalLaps - 1) {
        setWinTime(step);
        setWon(true);
        setIsCountDownPaused(true);
      } else {
        showMessage("Correct answer",1500,'success')
        setLap(lap + 1);
        handleSetTargetPos();
      }
      setLap(lap + 1);
    } else {
      showMessage("Try again",1500,'wrong')
    }
    
    setSubmitted(false);
  };

  const showMessage = (message:string, time:number, type:string) => {
    setAlertType(type);
    setMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, time);
  };
  const handleReset = () => {
    setCarX(0);
    setCarY(0);
    setCarAngle(0);
    setLap(0);
    setPaths([]);
    setStep(0);
    setTempPath(null);
    setCoordinates([]);
    setWon(false);
    setWinTime(0);
    handleSetTargetPos();
    setIsTimeUp(false);
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center" style={{ minHeight: "100vh" }}> 
        {/* Row */}
        <div className="p-1 lg:px-5 flex justify-center items-center w-100 lg:w-2/3">
          {/* Col  lg={8} */}
          <div className="w-full md:w-3/4 md:ms-auto mx-auto my-3 bg-green-800">
            <Graph
              x1={X1 - 1}
              x2={X2 + 1}
              y1={Y1 - 1}
              y2={Y2 + 1}
              carX={carX}
              carY={carY}
              carAngle={carAngle}
              // flag={targetPos ? true : false}           
              flagType={lap === totalLaps - 1 ? "final" : "white"}
              flagX={flagPos && flagPos[0]}
              flagY={flagPos && flagPos[1]}
              setFlagX={(v:number):any=>{setFlagPos((prev:any) => ({ ...prev, 0: v }))}}
              setFlagY={(v:number):any=>{setFlagPos((prev:any) => ({ ...prev, 1: v }))}}
              isClickable={true}
              coordinates={showCoordinates?coordinates:[]}
              paths={showPaths?tempPath?[...paths, tempPath]:paths:null}
              learnMode={false}

            ></Graph>
          </div>
        </div>
        <div className="w-100 lg:w-1/3">
          {/* Col lg={4} */}
          <div className="lg:pt-5 flex flex-row flex-wrap lg:flex-col "> 
          {/* Row */}
            <div
              className="flex w-1/3 lg:w-100 mx-auto justify-center items-center lg:mb-5"
            > 
            {/*Col lg={12}
              xs={4} */}
              <button
                onClick={() => {
                  setPage("menu");
                }}
                className="text-sm p-1 sm:p-2 sm:px-3 btn btn-primary"

              >
                Back&nbsp;to&nbsp;menu
              </button>
            </div>
            <div className="flex w-full sm:w-1/3 lg:w-full justify-center items-center"
            >
              {/* Col lg={12}
              xs={4} */}
              <p className="text-white text-3xl">
                <i className="fa-regular fa-clock"></i>
              :&nbsp;&nbsp;</p>
              <p className="text-white text-3xl"> {isTimer?Math.floor(countDown/1000):Math.floor(step / 10)} s</p>
            </div>
            <div className="flex w-full sm:w-1/3  lg:w-full  justify-center items-center"
            >
              {/* Col
              lg={12}
              xs={4} */}
              <img src="flag.png" alt="flag" className="w-5"/>
              <p className="text-white text-3xl">:&nbsp;&nbsp;</p>
              <p className="text-white text-3xl">
                {" "}
                {lap}/{totalLaps}
              </p>
            </div>
            <div className="flex  lg:w-full flex-col justify-center items-center w-full">

                      
              <div
                className="flex justify-center items-center mt-2 w-full "
              >
                {/* Col
                xs={12} */}
                <p className="text-white text-5xl">Go to ({targetPos?.[0]}, {targetPos?.[1]})</p>
                <button
                  disabled={submitted || !valid}
                  onClick={handleSubmit}
                  className="text-sm p-1 sm:p-2 sm:px-3 btn btn-warning"
  
                >
                  Go!
                </button>
              </div>
              <div
                className="flex w-full  justify-center items-center " >
                  {/* Col xs={12} */}
              <small className="text-white text-sm">(Click on the grid to place the flag and hit Go!)</small>
  
             </div>
            </div>
            <div
              className="flex justify-center items-center w-full sm:w-1/2 lg:w-full"
            >
              {/* Col
              lg={12}
              sm={6} */}
              <button
                disabled={submitted || !valid}
                onClick={() => setShowPaths(!showPaths)}
                className="text-xs p-1 btn btn-primary"

              >
                {showPaths?'Hide paths':'Show paths'}
              </button>
              <button
                onClick={() => setPaths([])}
                className="text-xs p-1 btn btn-primary"
                disabled={paths.length===0}
              >
                Clear paths
              </button>
            </div>
            <div
              className="flex justify-center items-center mt-2 w-full sm:w-1/2 lg:w-full"
            >
              {/* Col
              lg={12}
              sm={6} */}
              <button
                disabled={submitted || !valid}
                onClick={() => setShowCoordinates(!showCoordinates)}
                className="text-xs p-1 btn btn-primary"

              >
                {showCoordinates?<>Hide<br/>coordinates</>:<>Show<br/>coordinates</>}
              </button>
              <button
                onClick={() => setCoordinates([])}
                className="text-sm p-1 btn btn-primary"
                disabled={coordinates.length===0}
              >
                Clear<br/>coordinates
              </button>
            </div>
          </div>
        </div>
      </div>
     {won && <div
        // onHide={handleReset}
        // backdrop="static"
        // keyboard={false}
        // size="lg"
        data-bs-theme="dark"
        className="rounded-lg alert-container backdrop-blur-sm" style={{ backgroundImage: "url('celebrate.gif')" }}
      >
        <div
          className="p-5 text-center bg-black rounded-lg text-white alert-box"
          
        >
          <h1>You won!</h1>
          <h3>You took {Math.floor(winTime / 10)} seconds</h3>
          <div className="flex justify-evenly">
            <button className="text-xl  btn btn-primary" onClick={() => setPage("menu")}>
              Back to menu
            </button>
            <button className="text-xl  btn btn-warning" onClick={handleReset}>
              Play again
            </button>
          </div>
        </div>
      </div>}
      {isTimeUp && !won&& <div 
        // onHide={handleReset}
        // backdrop="static"
        // keyboard={false}
        
        data-bs-theme="dark"
        className="alert-container "
      >
        <div
          className="p-5 text-center bg-black rounded-lg text-white alert-box"
        >
          <p className="text-red-700 text-4xl">Time up!</p>
          <p className="text-xl">You cleared {lap} out of {totalLaps} rounds</p>
          <p text-xl>Don't worry, you can try again</p>
          <div className="flex justify-evenly">
            <button className="text-md  btn btn-primary" onClick={() => setPage("menu")}>
              Back to menu
            </button>
            <button className="text-md  btn btn-warning" onClick={handleReset}>
              Play again
            </button>
          </div>
        </div>
      </div>}
      {showAlert && <CustomAlert message={message} type={alertType} />}
    </>
  );
}

export default Game3;
