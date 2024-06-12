import React from "react";

function CustomAlert({ message, type,longMessage }:{message:string,type:string,longMessage:string}) {
  return (
    <div className={`alert-container custom-alert-${type}`}>
      <div className="alert-box bg-black rounded p-2 sm:px-5 flex flex-col items-center justify-center text-center mx-auto">
            <div className="animation-ctn">
              {type === "success" ? <div className="icon icon--order-success svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="154px"
                  height="154px"
                  className="mx-auto"
                >
                  <g fill="none" stroke="#22AE73" strokeWidth="2">
                    <circle
                      cx="77"
                      cy="77"
                      r="72"
                      style={{strokeDasharray:'480px, 480px ',strokeDashoffset: '960px'}}
                    ></circle>
                    <circle
                      id="colored"
                      fill="#22AE73"
                      cx="77"
                      cy="77"
                      r="72"
                      style={{strokeDasharray:'480px, 480px ',strokeDashoffset: '960px'}}
                    ></circle>
                    <polyline
                      className="st0"
                      stroke="#fff"
                      strokeWidth="10"
                      points="43.5,77.8 63.7,97.9 112.2,49.4 "
                      style={{strokeDasharray:'100px, 100px ',strokeDashoffset: '200px'}}
                    />
                  </g>
                </svg>
              </div>:
              <div className="icon icon--order-success svg">
              <svg xmlns="http://www.w3.org/2000/svg" width="154px" height="154px">  
                <g fill="none" stroke="#F44812" strokeWidth="2"> 
                  <circle cx="77" cy="77" r="72" style={{strokeDasharray:'480px, 480px ',strokeDashoffset: '960px'}}></circle>
                  <circle id="colored" fill="#F44812" cx="77" cy="77" r="72" style={{strokeDasharray:'480px, 480px ',strokeDashoffset: '960px'}}></circle>
                  <polyline className="st0" stroke="#fff" strokeWidth="10" points="43.5,77.8  112.2,77.8 " style={{strokeDasharray:'100px, 100px ',strokeDashoffset: '200px'}}/>   
                </g> 
              </svg>
            </div>
              }
            </div>

        <div className="message-box  rounded p-3 "><h1 className="text-white">{message}</h1>
        
        <p className="text-white">{longMessage}</p>
        </div>

      </div>
    </div>
  );
}

export default CustomAlert;
