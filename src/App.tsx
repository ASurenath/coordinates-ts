import { useState } from "react";
import "./App.css";
import Game1 from "./components/Game1";
import Game2 from "./components/Game2";
import Game3 from "./components/Game3";

// const popover = (
//   <Popover data-bs-theme="dark">
//     <Popover.Header as="h3" className="text-white">How to play</Popover.Header>
//     <Popover.Body>
//       Select the game and follow the flags by entering their coordinates and
//       pressing Enter (or click on 'Go')
//     </Popover.Body>
//   </Popover>
// );
function App() {
  const [page, setPage] = useState("menu");
  const [transitType, setTransitType] = useState(1);
  const [isTimer, setIsTimer] = useState(false);
  const [timer, setTimer] = useState(60*1000);
  const [totalLaps, setTotalLaps] = useState(5);
  const [quadrant, setQuadrant] = useState("positive");
  // console.log(totalLaps,timer,isTimer);

  return (
    <div className="App bg-green-800 m-0 " style={{ minHeight: "100vh" }}>
      {page == "menu" && (
        <div
          className="flex flex-col justify-center items-center"
          style={{ minHeight: "100vh" }}
        >
          <h1 className="text-white text-5xl">
            Coordinate race <i className="fa-solid fa-car-side"></i>
          </h1>
          <button onClick={() => setPage("game1")} className="mt-5 btn btn-warning ">
            Learn
          </button>
          {/* <button variant="warning" onClick={() => setPage("game2")}>
            Play<br/><span className="fs-6">Follow the flags</span>
          </button> */}
          <button onClick={() => setPage("game3")} className="mt-5 btn btn-warning ">
            Play <br/><span className="text-sm">Follow the co-ordinates</span>
          </button>

          <div>
            <button onClick={() => setPage("settings")} className="mt-5 btn btn-info ">
              <i className="fa-solid fa-gear"></i>
            </button>
            {/* <OverlayTrigger trigger="click" placement="right" overlay={popover}>
              <button>
                <i className="fa-solid fa-question"></i>
              </button>
            </OverlayTrigger> */}
          </div>
        </div>
      )}
      {page=='game1' && quadrant == "positive" &&<Game1 X1={0} X2={10} Y1={0} Y2={10} setPage={setPage}/>}
      {page=='game1' && quadrant == "all" &&<Game1 X1={-5} X2={5} Y1={-5} Y2={5} setPage={setPage}/>}

      {page == "game2" && quadrant == "positive" &&(<Game2 X1={0} X2={10} Y1={0} Y2={10} transitType={transitType} setPage={setPage} isTimer={isTimer} timer={timer} totalLaps={totalLaps}/>)}
      {page == "game2" && quadrant == "all" && (<Game2 X1={-5} X2={5} Y1={-5} Y2={5} transitType={transitType} setPage={setPage} isTimer={isTimer} timer={timer} totalLaps={totalLaps} />)}

{page == "game3" && quadrant == "positive" && <Game3 X1={0} X2={10} Y1={0} Y2={10} transitType={transitType} setPage={setPage} isTimer={isTimer} timer={timer} totalLaps={totalLaps} />}
{page == "game3" && quadrant == "all" && <Game3 X1={-5} X2={5} Y1={-5} Y2={5} transitType={transitType} setPage={setPage} isTimer={isTimer} timer={timer} totalLaps={totalLaps} />}

      {page == "settings" &&
        <>
          <div
            className="flex flex-col justify-center items-center text-white"
            style={{ minHeight: "100vh" }}
          >
            <h1 className="text-white text-5xl pb-5">
              Settings <i className="fa-solid fa-gear"></i>
            </h1>

            <div className="flex flex-col sm:flex-row justify-center items-center mb-4">
              Select transit type:
              <label htmlFor="transitType1" onClick={() => setTransitType(1)} className={`flex flex-col justify-start items-center mx-2 p-1 ${transitType == 1 ? "border border-white" : ""}`}>
                <div className="btn btn-warning" >
                  <img src="type1.png" height={100} width={100} alt="Parallel to axes. Always starts from (0,0)" />
                </div>
                <input type="radio" name="transitType" value="1" id="transitType1" onChange={() => setTransitType(1)} checked={transitType == 1} />
                <p>Parallel to axes.<br /> Always starts from (0,0)</p>
              </label>

              <label htmlFor="transitType2" onClick={() => setTransitType(2)} className={`flex flex-col justify-start items-center mx-2 p-1 ${transitType == 2 ? "border border-white" : ""}`}>
                <div className="btn btn-warning" >
                  <img src="type2.png" height={100} width={100} alt="Straight and continous" />
                </div>
                <input type="radio" name="transitType" value="2" id="transitType2" onChange={() => setTransitType(2)} checked={transitType == 2} />
                <p>Straight and continous</p> <br />
              </label>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center mb-4">
              Select quadrants:
              <label htmlFor="positive-quadrant" onClick={() => setQuadrant("positive")} className={`flex flex-col justify-start items-center mx-2 p-1 ${quadrant == "positive" ? "border border-white" : ""}`}>
                <div className="btn btn-warning p-1 fs-6" >
Positive quadrant                </div>
                <input type="radio" name="quadrant" value="positive" id="positive-quadrant" onChange={() =>setQuadrant("positive")} checked={quadrant == "positive"} />
              </label>

              <label htmlFor="all-quadrants" onClick={() =>setQuadrant("all")} className={`flex flex-col justify-start items-center mx-2 p-1 ${quadrant == "all" ? "border border-white" : ""}`}>
                <div className="btn btn-warning p-1 fs-6" >
All quadrants 
                </div>
                <input type="radio" name="qudrant" value="all" id="all-quadrants" onChange={() => setQuadrant("all")} checked={quadrant == "all"} />
              </label>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="timer-switch" className="mx-2 flex">Set&nbsp;Timer (per&nbsp;round)
                <input 
                  type="checkbox"
                  id="timer-switch"
                  className="mx-2"
                  checked={isTimer}
                  onChange={(e) => setIsTimer(e.target.checked)}
                />:
              </label>

              <select onChange={(e) => setTimer(parseInt(e.target.value))} value={timer} disabled={!isTimer} className={`m-2 text-black p-2 rounded ${isTimer ? "" : "primary"}}`}>
              <option value={10*1000}>10 sec</option>
              <option value={20*1000}>20 sec</option>
              <option value={30*1000}>30 sec</option>
                <option value={1*60*1000}>1 min</option>
                <option value={2*60*1000}>2 min</option>
                <option value={3*60*1000}>3 min</option>
                <option value={4*60*1000}>4 min</option>
                <option value={5*60*1000}>5 min</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="rounds-per-game" className="mx-2 flex">Rounds&nbsp;per&nbsp;game&nbsp;:&nbsp;</label>
              <select onChange={(e) => setTotalLaps(parseInt(e.target.value))} value={totalLaps} className="m-2 text-black p-2 rounded">
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
                <option value={13}>13</option>
                <option value={14}>14</option>
                <option value={15}>15</option>
              </select>
              </div>
              <button onClick={() => setPage("menu")} className="btn btn-primary">
Back 
              </button>
        
            
          </div>
          </>}
        </div>
      );
}

      export default App;
