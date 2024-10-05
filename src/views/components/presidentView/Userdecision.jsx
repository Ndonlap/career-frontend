// page for create or join a tontine group
import React from "react";
import decide from "../../assets/decide.jpg";
import Button from "../../components/Buttons/Button";
import { useNavigate } from "react-router-dom";

const Userdecision = () => {
  const navigate = useNavigate();
  const backgroundImageStyle = {
    backgroundImage: `url(${decide})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="w-[100%] h-[100vh] bg-#fff content-center  ">
      <div style={backgroundImageStyle} className={`flex w-full h-full`}>
      <div className=" w-[100px] h-[100px] grid grid-cols-2 md:grid-cols-2 gap-6 text-9xl font-medium ">
          <div className=" row-start-1 col-start-2  ">
            WHICH
         </div>
         <div className="  justify-end m-auto w-[1500px] grid grid-col-1 gap-12 col-span-1 ">
          <div className=" row-start-1 row-end-2 col-start-12 col-end-18 ">
            ONE IS
          </div>
        </div>  
        </div>
        <div className=" w-[100px] h-[100px] grid grid-cols-3 md:grid-cols-3 gap-12 text-9xl font-medium ">
          <div className=" row-start-12 col-start-1  ">
            BEST
         </div>
         <div className=" row-start-10 col-start-10 mt-[-100px] ">
            YOU?
         </div>
         <div className=" row-start-12 col-start-12 ">
            FOR
         </div>
         </div>
        <div className=" w-[100px] h-[100px] grid grid-cols-2 md:grid-cols-2 gap-6 ">
          <div className=" mich row-start-9 col-start-1 ">
            <Button width="w-48" size="8" type="button" text={'CREATE A TONTINE?'} onClick={()=> navigate("/Creationform")}/>
         </div>
        </div>
        <div className="  justify-end m-auto w-[980px] grid grid-col-1 gap-12 col-span-1 ">
          <div className=" mich row-start-2  row-end-7 col-start-12 col-end-18 ">
            <Button className="ml-50" width="w-48" size="8" type="button" text={'JOIN A GROUP?'}/>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default Userdecision;
