import React from 'react';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import {useEffect,useState} from 'react'
import{ fetchAllUser} from '../services/UserServices';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalEditUser from './ModalEditUser';
import _ from 'lodash'
import ModalConfirm from './ModalConfirm';
import './TableUsers.scss'
import {debounce} from "lodash"
import { CSVLink, CSVDownload } from "react-csv";
import { Toast } from 'bootstrap';
const  TableUsers = (props)=>{
    const [listUsers, setListUsers]= useState([])
    const [totalUsers, setTotalUsers]= useState(0);
    const [totalPages, setTotalPages]= useState(0);
    const [ isShowModalAddNew, setIsShowModalAddNew]= useState(false)
    const [ isShowModalEditNew, setIsShowModalEditNew]= useState(false)
    const [dataUserEdit, setDataUserEdit]= useState({})
    const [isShowModalDelete, setIsShowModalDelete]= useState(false)
    const [sortBy, setSortBy]= useState("asc");
    const [sortField, setSortField]= useState("id");
    const [keyword, setKeyword]= useState("")
    const [dataExport, setDataExport]= useState([])
    const handleSort =(sortBy, sortField)=>{
      setSortBy(sortBy);
      setSortField(sortField)

      let cloneListUsers= _.cloneDeep(listUsers);
      cloneListUsers=_.orderBy(cloneListUsers,[sortField],[sortBy])
      setListUsers(cloneListUsers)
      console.log(cloneListUsers)
    }

    const handleClose =()=>{
     setIsShowModalAddNew(false)
     setIsShowModalEditNew(false)
     setIsShowModalDelete(false)
  }

  const handleEditUser =(user)=>{
    setDataUserEdit(user);
    setIsShowModalEditNew(true)
  }

  const handleEditUserFromModal=(user)=>{

       let cloneListUsers =_.cloneDeep(listUsers);

        let index = listUsers.findIndex(item=> item.id===user.id)
        cloneListUsers[index].first_name= user.first_name
        setListUsers(cloneListUsers)
        
        
      }
  
    useEffect (()=>{
        getUsers(1)
    },[])

    

    const getUsers = async(page)=>{
        let res = await fetchAllUser(page)
         if(res&& res.data){
            setTotalUsers(res.total)
            setListUsers(res.data)
            setTotalPages(res.total_pages)
            
         }
    }

    const handlePageClick =(event)=>{
        getUsers(+event.selected+1)
    }
    const handleUpdateTable=(user)=>{
      setListUsers([user,...listUsers])

    }

    const handleSearch =debounce((event)=>{
       let term = event.target.value;
       console.log(term)
       if(term){
          let cloneListUsers =_.cloneDeep(listUsers);
          cloneListUsers= cloneListUsers.filter(item=> item.email.includes(term));
          setListUsers(cloneListUsers);
       } else {
        getUsers(1)
       }
    },100)

    const csvData = [
      ["firstname", "lastname", "email"],
      ["Ahmed", "Tomi", "ah@smthing.co.com"],
      ["Raed", "Labes", "rl@smthing.co.com"],
      ["Yezzi", "Min l3b", "ymin@cocococo.com"]
    ];

    const getUsersExport =(event,done)=>{
      let result = [];
      if(listUsers&& listUsers.length>0){
        result.push(["Id","Email","First Name","Last Name"])
        listUsers.map((item,index)=>{
         
           let arr =[];
           arr[0]=item.id;
           arr[1]= item.email;
           arr[2]= item.first_name;
           arr[3]= item.last_name;
        })

        setDataExport(result);
        done();
      }
    }

    const handleImportCSV=(e)=>{
    if(e.target&& e.target.files&& e.target.files[0]){
        let file = e.target.files[0];

        if(file.type=="text/csv"){
           return 
        }
    }
    }
   
  return (
    <>
    <div className="my-3 add-new">

          <div>
            <label htmlFor='test' className="btn btn-warning">
         <i className="fa-solid fa-file-import"> </i>
           Import </label>
           <input id="test" type="file" hidden/>
          <CSVLink 
            data={dataExport}
            asyncOnClick={true}
            filename={"user.csv"}
            className="btn btn-primary"
            onClick={getUsersExport}
          >Export</CSVLink>

          <CSVDownload
          
           data={dataExport} target="_blank" />
          </div>
          <Button variant="primary"
           onClick={()=> setIsShowModalAddNew(true)}
          >
             
           <i className="fa-solid fa-circle-plus"> </i>
            
            ADD NEW USER</Button>
          </div>

          <div className="col-6 my-3">
            <input 
            value={keyword}
            onChange={(event)=> handleSearch(event) }
            className="form-control" placeholder='Search user by email'/>
           
          </div>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th >
            ID
          <div className="sort-header">
          <span>
          <i class="fa-sharp fa-solid fa-sort-down"
            
             onClick={()=> handleSort("desc","id")}
            ></i>
          <i class="fa-sharp fa-solid fa-sort-up"
            onClick={()=> handleSort("asc","id")}
          ></i>
          </span>
          </div>
          </th>
          <th >Email</th>
          <th >
            First Name
            <div className="sort-header">
            <span>
            <i class="fa-sharp fa-solid fa-sort-down"
            onClick={()=> handleSort("desc","first_name")}
            ></i>
            <i class="fa-sharp fa-solid fa-sort-up"
            onClick={()=> handleSort("asc","first_name")}
            ></i>
            </span>
            </div>
            </th>
          <th >Last Name</th>
          <th >Action</th>
         
        </tr>
      </thead>
      <tbody>

        {
            listUsers&& listUsers.length>0 &&
            listUsers.map((item,index)=>{
                return (
                    <tr key={`user-${index}`}>
                        <td>{item.id}</td>
                        <td>{item.email}</td>
                        <td>{item.first_name}</td>
                        <td>{item.last_name}</td>
                        <td>
                          <Button className="btn btn-warning mx-3" onClick={()=>handleEditUser(item)}>Edit</Button>
                          <Button className="btn btn-danger" onClick={()=> setIsShowModalDelete(true)}>Delete</Button>
                        </td>
                    </tr>
                )
            })
            
        }
        
       
      </tbody>
    </Table>

    <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={totalPages}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        activeClassName={"page-item active"}
        activeLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        disabledClassName={"page-item disabled"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
      />

<ModalAddNew  
             show={isShowModalAddNew}
             handleClose={handleClose}
             handleUpdateTable={handleUpdateTable}
         />

  <ModalEditUser 
      show={isShowModalEditNew}
      handleClose={handleClose}
      handleEditUserFromModal={handleEditUserFromModal}
      dataUserEdit={dataUserEdit}
  >

  </ModalEditUser>

  <ModalConfirm
  show={isShowModalDelete}
   handleClose={handleClose}>
  </ModalConfirm>
</>
  );
}

export default TableUsers;