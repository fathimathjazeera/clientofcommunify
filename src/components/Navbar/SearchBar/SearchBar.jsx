
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Dropdown, Form ,Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {


    const [searchTerm, setSearchTerm] = useState('');
    const [allcommunities,setAllCommunities]=useState([])
    console.log(allcommunities,"all");
const nav=useNavigate()


const AllCommunities=async()=>{
    const token=localStorage.getItem('authToken')
   const response=await axios.get('https://communify-server.mrzera.in/api/users/allcommunities',{
  headers:{
  Authorization:`Bearer ${token}`
  }
  })
  
  const {status,message, data} = response.data
  console.log(data,"all");
  if(status=='success'){
  
  setAllCommunities(data)
  
  }
  }
useEffect(() => {
 AllCommunities()
}, [])


  return (


<div>

      <Dropdown >
        <Dropdown.Toggle variant="dark" id="dropdown-basic" style={{color:"white"}} className='search-btn'>
      <Form.Control
        type="search"
        placeholder="Search"
        className='search-nav' 
        aria-label="Search"
        id="dropdown-basic"
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
      />
          
        </Dropdown.Toggle>
  
        <Dropdown.Menu style={{marginLeft:"101.5px", backgroundColor:"rgb(242, 241, 241)", padding:"10px", width:"31.5%", borderRadius:"5px",marginTop:"-9px", borderTopLeftRadius:"1px", borderTopRightRadius:"none" }} >
          {allcommunities
            .filter((val) => {
             if (searchTerm === '') {
                return allcommunities
              } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return val;
              }
            })
            .map((val) => {
              return (
                <Dropdown.Item  key={val._id}  onClick={()=>{nav(`/r/${val.name}`)}} >
                  <div className="template"  >
               
                    <h3 style={{marginTop:"10px"}}>#  r/{val.name}</h3>
                    
                  </div>
                </Dropdown.Item>
              );
            })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
    
  )
}


export default SearchBar