import React, { useEffect, useState } from "react";

function Buttons({isLoading}){
  const [showSpinner, setshowSpinner]= useState(false)

  useEffect(() => {
    setshowSpinner(isLoading)
  }, [isLoading])
  
  return (
    <React.Fragment>
      <button type="submit" className="btn btn-success mt-3 w-100" disabled={showSpinner ? true : false}>
        {showSpinner ? 
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          : 
          'Submit' 
          } 
      </button>
    </React.Fragment>
  );
}

export default Buttons;
