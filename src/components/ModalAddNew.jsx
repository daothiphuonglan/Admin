import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useState} from 'react'
import {postCreateUser,fetchAllUser} from '../services/UserServices'
import { ToastContainer, toast } from 'react-toastify';
const ModalAddNew= (props)=> {
    const {show,handleClose,handleUpdateTable} = props;
    const [name,setName]= useState("")
    const [job, setJob]= useState("")
    
    const handleSaveUser =async()=>{
        let res = await postCreateUser(name,job)
        console.log(res)
        if(res&& res.id){
          handleClose();
          setName("");
          setJob("")
          toast.success("Create user successfully");
          handleUpdateTable({
            first_name:name,
            id:res.id
          });

        }else{
          toast.error("failed to create user")
        }
       
        
    }
    
  return (
    <>
   

      <Modal 
      backdrop="static"
      keyboard={false}
      show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add new user</Modal.Title>
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
          <Button variant="primary" onClick={()=>handleSaveUser()}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
   
    </>
  );
}

export default ModalAddNew;