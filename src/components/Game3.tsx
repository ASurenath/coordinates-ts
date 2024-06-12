import { useEffect, useRef, useState } from "react";
import Graph from "./Graph";

function Game3({ X1, X2, Y1, Y2, setPage,transitType,isTimer,timer,totalLaps }:{X1:number,X2:number,Y1:number,Y2:number,setPage:any,transitType:number,isTimer:boolean,timer:number,totalLaps:number}) {
  const [step, setStep] = useState<number>(0);
  const [carAngle, setCarAngle] = useState<number>(0);
  const [carX, setCarX] = useState<number>(0);
  const [carY, setCarY] = useState<number>(0);
  const [lap, setLap] = useState<number>(0);
  const [isFlag, setIsFlag] = useState<boolean>(false);

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
    let x2:number|null = flagPos?.[0]||null;
    let y2:number|null = flagPos?.[1]||null;
    setSubmitted(true);
    if(x2!=null && y2!=null){if(transitType==1){
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
        // swal("Correct answer", "", "success", {
        //   button: false,
        //   timer: 1000,
        // }); // fix later
        setLap(lap + 1);
        handleSetTargetPos();
      }
      setLap(lap + 1);
    } else {
      // swal("Wrong answer", "Try again", "error", {
      //   button: false,
      //   timer: 1000,
      // }); // fix later
    }
    
    setSubmitted(false);
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
      <div> 
        {/* Row */}
        <div className="p-1 px-lg-5 d-flex justify-content-center align-items-center">
          {/* Col  lg={8} */}
          <div className="w-75 ms-md-auto mx-auto my-3 bg-success">
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
        <div>
          {/* Col lg={4} */}
          <div className="pt-lg-5 "> 
          {/* Row */}
            <div
              className="d-flex justify-content-center align-items-center mb-lg-5"
            > 
            {/*Col lg={12}
              xs={4} */}
              <button
                onClick={() => {
                  setPage("menu");
                }}
                className="fs-6 p-1 p-sm-2 px-sm-3"

              >
                Back to menu
              </button>
            </div>
            <div
              className="d-flex justify-content-center align-items-center"
            >
              {/* Col lg={12}
              xs={4} */}
              <h1 className="text-white">
                <i className="fa-regular fa-clock"></i>
              </h1>
              <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
              <h1 className="text-white"> {isTimer?Math.floor(countDown/1000):Math.floor(step / 10)} s</h1>
            </div>
            <div
              className="d-flex justify-content-center align-items-center"
            >
              {/* Col
              lg={12}
              xs={4} */}
              <img src="flag.png" alt="flag" height={40} />
              <h2 className="text-white">&nbsp;&nbsp;:&nbsp;&nbsp;</h2>
              <h1 className="text-white">
                {" "}
                {lap}/{totalLaps}
              </h1>
            </div>
            <div
              className="d-flex justify-content-center align-items-center " >
                {/* Col xs={12} */}
            <small className="text-white fs-6">(Place the flag and hit Go!)</small>

            </div>
                    
            <div
              className="d-flex justify-content-center align-items-center mt-2"
            >
              {/* Col
              xs={12} */}
              <p className="text-white fs-1">Go to ({targetPos?.[0]}, {targetPos?.[1]})</p>
              <button
                disabled={submitted || !valid}
                onClick={handleSubmit}
                className="fs-6 p-1 p-sm-2 px-sm-3"

              >
                Go!
              </button>
            </div>
            <div
              className="d-flex justify-content-center align-items-center mt-2"
            >
              {/* Col
              lg={12}
              sm={6} */}
              <button
                disabled={submitted || !valid}
                onClick={() => setShowPaths(!showPaths)}
                className="fs-6 p-1"

              >
                {showPaths?'Hide paths':'Show paths'}
              </button>
              <button
                onClick={() => setPaths([])}
                className="fs-6 p-1"
                disabled={paths.length===0}
              >
                Clear paths
              </button>
            </div>
            <div
              className="d-flex justify-content-center align-items-center mt-2"
            >
              {/* Col
              lg={12}
              sm={6} */}
              <button
                disabled={submitted || !valid}
                onClick={() => setShowCoordinates(!showCoordinates)}
                className="fs-6 p-1"

              >
                {showCoordinates?<>Hide<br/>coordinates</>:<>Show<br/>coordinates</>}
              </button>
              <button
                onClick={() => setCoordinates([])}
                className="fs-6 p-1"
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
        className="rounded-5"
      >
        <div
          className="p-5 text-center bg-dark rounded-5 text-light"
          style={{ backgroundImage: "url('celebrate.gif')" }}
        >
          <h1>You won!</h1>
          <h3>You took {Math.floor(winTime / 10)} seconds</h3>
          <div className="d-flex justify-content-evenly">
            <button className="fs-2" onClick={() => setPage("menu")}>
              Back to menu
            </button>
            <button className="fs-2" onClick={handleReset}>
              Play again
            </button>
          </div>
        </div>
      </div>}
      {isTimeUp && <div
        // onHide={handleReset}
        // backdrop="static"
        // keyboard={false}
        
        data-bs-theme="dark"
        className="rounded-5"
      >
        <div
          className="p-5 text-center bg-dark rounded-5 text-light"
        >
          <h1 className="text-danger">Time up!</h1>
          <h3>You cleared {lap} out of {totalLaps} rounds</h3>
          <h3>Don't worry, you can try again</h3>
          <div className="d-flex justify-content-evenly">
            <button className="fs-2" onClick={() => setPage("menu")}>
              Back to menu
            </button>
            <button className="fs-2" onClick={handleReset}>
              Play again
            </button>
          </div>
        </div>
      </div>}
    </>
  );
}

export default Game3;
