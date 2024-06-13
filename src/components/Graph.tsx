import React, { useEffect, useRef, useState } from "react";

const renderRipple = (x: number, y: number) => {
  return (
    <>
      <circle r="0.1" cx={x} cy={y} opacity={0.5} fill="#fff" >
        <animate
          attributeName="r"
          begin="0s"
          dur="1.5s"
          from="0.05"
          to="2"
          repeatCount="indefinite" />
        <animate
          attributeName="opacity"
          begin="0s"
          dur="1.5s"
          from="1"
          to="0"
          repeatCount="indefinite" />
      </circle>
    </>
  )
}

function Graph({ x1, x2, y1, y2, carX, carY, carAngle, flagType, flagX, flagY, coordinates, paths, isClickable, setFlagX, setFlagY, learnMode }
  :{x1:number,x2:number,y1:number,y2:number, carX?:number|null, carY?:number|null, carAngle?:number|null, flagType:string, flagX:number|null, flagY:number|null, coordinates?:{x:number,y:number,color:string}[]|null, paths?:{x1:number,y1:number,x2:number,y2:number,color:string}[]|null, isClickable:boolean, setFlagX:any, setFlagY:any, learnMode:boolean}) {

  const [isMouseOver, setIsMouseOver] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<[number, number] | null>(null);

  const graphBox = useRef<HTMLDivElement>(null);
  const findXPosPercent = (x: number) => {
    return ((x - x1) / (x2 - x1)) * 100
  };
  const findYPosPercent = (y: number) => {
    return ((y - y2) / (y1 - y2)) * 100
  };
  const findCarXPosPercent = (x: number) => {
    return `${(((x - x1 - 0.5) / (x2 - x1))) * 100}%`;
  };
  const findCarYPosPercent = (y: number) => {
    return `${(((y - y2 + 0.5) / (y1 - y2))) * 100}%`;
  }

  const renderXticks = () => {
    const ticks = [];
    for (let i = x1; i <= x2; i++) {
      i != x1 && i != x2 && ticks.push(

        <text
          x={((i - x1) / (x2 - x1)) * 100 + "%"}
          y={findYPosPercent(0)}
          fontSize={3}
          fill="white"
          key={`verticel-${i}`}
          dominantBaseline="text-before-edge"
          textAnchor="middle"
        >
          {i}
        </text>

      );
    }
    return ticks?.map((tick) => tick);
  };
  const renderYticks = () => {
    const ticks = [];
    for (let i = y1; i <= y2; i++) {
      i != y1 && i != y2 && i != 0 && ticks.push(
        (
          <text
            x={findXPosPercent(0)}
            y={((i - y2) / (y1 - y2)) * 100 + "%"}
            style={{
              fontSize: 3,
              fill: "white",
              textAlign: "right",
              marginRight: "5px",
            }}
            key={`verticel-${i}`}
            alignmentBaseline="middle"
            textAnchor="end"
          >
            {i}
          </text>
        )

      );
    }
    return ticks?.map((tick) => tick);
  };
  const renderVerticleLines = () => {
    const lines = [];
    for (let i = x1; i <= x2; i++) {
      i != x1 && i != x2 && lines.push(

        <line
          x1={((i - x1) / (x2 - x1)) * 100 + "%"}
          y1={"0%"}
          x2={((i - x1) / (x2 - x1)) * 100 + "%"}
          y2={"100%"}
          style={{
            stroke: "white",
            strokeWidth: i == 0 ? 0.2 : 0.1,
            strokeDasharray: i != 0 ? "0.3 0.5" : "none",
          }}

          key={`verticel-${i}`}
        />
      );
    }
    return lines?.map((line) => line);
  };
  const renderHorizentalLines = () => {
    const lines = [];
    for (let i = y1; i <= y2; i++) {
      i != y1 && i != y2 && lines.push(
        <line
          x1={"0%"}
          y1={((i - y2) / (y1 - y2)) * 100 + "%"}
          x2={"100%"}
          y2={((i - y2) / (y1 - y2)) * 100 + "%"}
          style={{
            stroke: "white",
            strokeWidth: i == 0 ? 0.2 : 0.1,
            strokeDasharray: i != 0 ? "0.3 0.5" : "none",

          }}
          key={`horizental-${i}`}
        />
      );
    }
    return lines?.map((line) => line);
  };
  const renderFlagDistance = () => {
    if(flagX!=null && flagY!=null){return (
      <>
        <line
          x1={findXPosPercent(flagX)}
          y1={findYPosPercent(0)}
          x2={findXPosPercent(flagX)}
          y2={findYPosPercent(flagY)}
          style={{ stroke: "yellow", strokeWidth: 0.4, strokeDasharray: ".4 .4" }}
        />
        
        <line
          x1={findXPosPercent(0)}
          y1={findYPosPercent(flagY)}
          x2={findXPosPercent(flagX)}
          y2={findYPosPercent(flagY)}
          style={{ stroke: "yellow", strokeWidth: 0.4, strokeDasharray: "0.4 0.4" }}
        />
        <text fill="yellow" x={findXPosPercent(flagX)} y={findYPosPercent(flagY)} fontSize={3} alignmentBaseline={flagY>=0?"before-edge":"after-edge"}  className="text-outline" textAnchor={flagX>=0?"start":"end"}>({flagX},{flagY})</text>
        <text fill="yellow" x={findXPosPercent(flagX/2)} y={findYPosPercent(flagY)} fontSize={3} alignmentBaseline="before-edge" textAnchor="middle" className="text-outline">←{flagX}→</text>
        <text fill="yellow" x={findXPosPercent(flagX)} y={findYPosPercent(flagY/2)} fontSize={3} alignmentBaseline="before-edge" textAnchor="middle" className="text-outline"
        style={{transform: "rotate(-90deg)",
        transformOrigin:findXPosPercent(flagX) + "% " + findYPosPercent(flagY/2)+ "%",
        }}
>←{flagY}→</text>


      </>
    );}
  };

  const handleMove = (e: any) => {
    if(graphBox.current){
      let rect = graphBox.current.getBoundingClientRect()
    let x = Math.round((e.clientX - rect.x) * (x2 - x1) / rect.width) + x1
    let y = Math.round((e.clientY - rect.height - rect.y) * (y1 - y2) / rect.height) + y1
    e = e.touches?.[0] || e;
    if (x > x1 && x < x2 && y > y1 && y < y2) { setHoveredPoint([x, y]); }
    else if (flagX!=null && flagY!=null) { setHoveredPoint([flagX, flagY]); }}
    else{
      setHoveredPoint(null);
    }
  }
  const handleClick = (e: any) => {
    if(hoveredPoint){setFlagX(hoveredPoint[0]);
    setFlagY(hoveredPoint[1]);}
  }

  return (
    <div
      id="graph-main"
      className="graph mx-auto w-100"
      style={{ aspectRatio: `${x2 - x1}/${y2 - y1}` }}
      ref={graphBox}
   >
      <svg
        height="100%"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 100 100`}
        onMouseMove={(e) => { isClickable && handleMove(e) }
        }
        onTouchMove={(e) => { isClickable && handleMove(e) }}
        onClick={(e) => { isClickable && handleClick(e) }
        }
        onTouchEnd={(e) => { isClickable && handleClick(e) }}
        style={{ cursor: isClickable ? "pointer" : "auto" }}
      >
        {renderVerticleLines()}
        {renderHorizentalLines()}
        {renderXticks()}
        {renderYticks()}


        {flagX !=null&& flagY!=null && <>
          <circle cx={findXPosPercent(flagX)} cy={findYPosPercent(flagY)} r="1" fill="white" />
          <image x={findXPosPercent(flagX)} y={findYPosPercent(flagY + 0.7)} height={0.7 / (x2 - x1) * 100 + "%"} href={flagType == "final" ? "finalflag.png" : "flag.png"} /></>
        }

        {paths?.map((path, id) => path && <line key={`(${path.x1},${path.y1})to(${path.x2},${path.y2})-${id}`} x1={findXPosPercent(path.x1)} y1={findYPosPercent(path.y1)} x2={findXPosPercent(path.x2)} y2={findYPosPercent(path.y2)} style={{ stroke: path.color, strokeWidth: 0.5 }} />
        )}

        {coordinates?.map((coordinate, id) => <React.Fragment key={`(${coordinate.x},${coordinate.y})-${id}`}>
          <circle cx={findXPosPercent(coordinate.x)} cy={findYPosPercent(coordinate.y)} r="1" fill={coordinate.color} />
          <text x={findXPosPercent(coordinate.x)} y={findYPosPercent(coordinate.y)} style={{ fontSize: 3 }} fill={coordinate.color} className="text-outline">({coordinate.x},{coordinate.y})</text>
        </React.Fragment>)}
        {carX!=null&&carY!=null&&carAngle!=null && <image
          x={findCarXPosPercent(carX)}
          y={findCarYPosPercent(carY)}
          height={1 / (x2 - x1) * 100 + "%"}
          href="car.png"
          style={{
            transform: `rotate(${-carAngle}deg)`,
            transformOrigin: `${findCarXPosPercent(carX + 0.5)} ${findCarYPosPercent(carY - 0.5)}`
          }}
        />}
        {isClickable&&hoveredPoint && renderRipple(findXPosPercent(hoveredPoint[0]), findYPosPercent(hoveredPoint[1]))}
        {learnMode && renderFlagDistance()}
      </svg>
    </div>
  );
}

export default Graph;
