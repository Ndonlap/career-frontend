import React, {useEffect, useState} from 'react'
import axios from 'axios'


export default function useLoaderData() {
 const [data, setData] = useState({});
 const getConnectedUserDetail = async () => {
    try{
        let response = await axios(`http://localhost:5000/api/user/getUserDetail`,{
            headers: {
                'content-type': 'application/json',
                'accept': 'applicaion/json',
                'access-control-origin': '*',
                'Authorization': `Bearer ${localStorage.getItem('tonti_token')}`
            }
        })
        
        const data =  response.data;
        setData(data);
    }catch(error){
        throw Error(error);
    }
  }

  useEffect(()=>{
    getConnectedUserDetail();
  },[])

  return data;
}
