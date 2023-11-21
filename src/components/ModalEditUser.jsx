import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useState, useEffect} from 'react'
import {postCreateUser,fetchAllUser,putUpdateUser} from '../services/UserServices'
import { ToastContainer, toast } from 'react-toastify';
const ModalEditUser= (props)=> {
    const {show,handleClose,dataUserEdit, handleEditUserFromModal} = props;
    const [name,setName]= useState("")
    const [job, setJob]= useState("")
    const handleEditUser =async()=>{
        let res = await putUpdateUser(name,job)
        console.log(res)
        if(res&&res.updatedAt){
                handleEditUserFromModal({
                  first_name:name,
                  id:dataUserEdit.id
                })

                handleClose();
                toast.success("Update user successfully")
        }
      }

   useEffect (()=>{
     if(show){
        setName(dataUserEdit.first_name)
     }
   },[dataUserEdit])
    
  return (
    <>
   

      <Modal show={show} onHide={handleClose}
       backdrop="static"
       keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit an user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="body-add-new">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text"
                     className="form-control"
                     onChange={(event)=> setName(event.target.value)}
                     value={name}/>

                </div>

                <div className="mb-3">
                 <label className="form-label">Job</label>
                 <input type="text" 
                 onChange={(event)=> setJob(event.target.value)}
                 value={job}
                 className="form-control"/>
                </div>

            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>handleEditUser()}>
          Confirm 
          </Button>
        </Modal.Footer>
      </Modal>
   
    </>
  );
}

export default ModalEditUser;