import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table, Alert,
} from "react-bootstrap";
import { Toggle } from "rsuite";
import "../App.css";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import DataContext from '../context/DataContext';
// import axios from 'axios';
import axios from '../api/posts';
import { useCookies } from 'react-cookie';
import DeleteConfirmation from "./DeleteConfirmation";
import useWindowSize from '../hooks/useWindowSize';

const UsersNew = () => {
  const { users, setUsers } = useContext(DataContext);
  const [token, setToken, removeToken] = useCookies(['myToken']);
  const [deleteid, setDeleteId] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [changeMessage, setChangeMessage] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [createMessage, setCreateMessage] = useState(null);
  const [userMessage, setUserMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const { width } = useWindowSize();
  
  const [showCreateBtn, setShowCreateBtn] = useState(true);
  const [editing, setEdit] = useState(false);
  const [cnewpassword, setCnewpassword] = useState('');
  const [shownewerrorMessage, setShownewerrorMessage] = useState(false);
  const [cnewpasswordClass, setCnewpasswordClass] = useState('form-control');
  const [isCnewpasswordDirty, setIsCnewpasswordDirty] = useState(false);

  let cookie = token['myToken'];

    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      setValidated(true);
    };

  const showDeleteModal = (deleteid) => {
    setDeleteId(deleteid);
    setUserMessage(null);
    setErrorMessage(null)
    setDeleteMessage(`'${users.find((x) => x.id === deleteid).username}' ??????????????????????????????????????????????`);
    setDisplayConfirmationModal(true);
  };
 
  // Hide the modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };


  const initCurrentUser = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    is_admin: false,
    company_name: "",
    password: ""
  };

  const [newUser, setNewUser] = useState(initCurrentUser);

  

    useEffect(() => {
        if (isCnewpasswordDirty) {
            if (newUser.password === cnewpassword) {
                setShownewerrorMessage(false);
                setCnewpasswordClass('form-control is-valid')
            } else {
                setShownewerrorMessage(true)
                setCnewpasswordClass('form-control is-invalid')
            }
        }
    }, [cnewpassword])
    
    const handleCPassword = (e) => {
        setCnewpassword(e.target.value);
        setIsCnewpasswordDirty(true);
    }

  const handleClose = () => {
    setShow(false); 
  };

  const handleClose2 = () => {
    setShow(false); 
    setEdit(false); 
  };

  const handleShow = () => {
    setEdit(false);
    setErrorMessage(null)
    setShow(true);
    if(editing === false) {
      setNewUser(initCurrentUser);
    }
    setChangeMessage('change');

  };

  const handleShow2 = () => {
    setErrorMessage(null)
    setShow(true);
    if(editing === false) {
      setNewUser(initCurrentUser);
    }
    setChangeMessage('change');

  };

  const onFormSubmit = async (newUser) => {
    try {
      const response = await axios.post('/image/user', newUser, { headers: { Authorization: `Token ${cookie}` }});
      setCreateMessage(`'${newUser.username}' ????????????????????????????????????`);
      setUpdateMessage(null)
      setUserMessage(null)
      setErrorMessage(null) 
      const allUsers = [...users, response.data];
      setUsers(allUsers);
      // navigate('users');   
  } catch (err) {
      console.log(`Error: ${err.message}`);
      setErrorMessage('????????????????????????????????????????????????????????? \n ???????????????????????????????????????????????????????????????');
      setUpdateMessage(null)
      setUserMessage(null)
      setCreateMessage(null)
  }
  };

  const onEdit = (newUser) => {
    setEdit(true);
    if(editing === true) {
      setNewUser({ ...newUser, newUser });
      handleShow2();
    }
    
  };

  const onSubmit = (newUser) => {
    if (editing === true) {
      onUpdateUser(newUser);
    } else {
      onFormSubmit(newUser);
    }
  };


  const onUpdateUser = async (newUser) => {
    setEdit(false);
    let id = newUser.id;
    try {
      const response = await axios.patch(`/image/update/${(id).toString()}`, newUser, { headers: { Authorization: `Token ${cookie}` }});
      setUpdateMessage(`'${newUser.username}' ????????????????????????????????????`);
      setUserMessage(null)
      setCreateMessage(null)
      setErrorMessage(null)
      setUsers(users.map(user => user.id === id ? { ...response.data } : user));
     
  } catch (err) {
      console.log(`Error: ${err.message}`);
      setErrorMessage('????????????????????????????????????????????????????????? \n ???????????????????????????????????????????????????????????????');
      setUserMessage(null)
      setCreateMessage(null)
      setUpdateMessage(null)
  }
  };


  const onDeleteUser = async (deleteid) => {
    try {
      await axios.delete(`/image/update/${(deleteid).toString()}`, { headers: { Authorization: `Token ${cookie}` }});
      const usersList = users.filter(user => user.id !== deleteid);
      setUserMessage(`'${users.find((x) => x.id === deleteid).username}' ????????????????????????????????????`);
      setUpdateMessage(null)
      setCreateMessage(null)
      setErrorMessage(null)
      setUsers(usersList);
      setDisplayConfirmationModal(false);
  } catch (err) {
      console.log(`Error: ${err.message}`);
      setErrorMessage('?????????????????????????????????????????????????????????????????????????????????????????????');
      setUpdateMessage(null)
      setCreateMessage(null)
      setUserMessage(null)
  }
  };

  return (
    <Container fluid="sm">
      <Row>
        <Col>
          <Card className="customCard">
            <Card.Body>
            {deleteMessage && userMessage && <Alert variant="success">{userMessage}</Alert>}
            {changeMessage && updateMessage && <Alert variant="success">{updateMessage}</Alert>}
            {changeMessage && createMessage && <Alert variant="success">{createMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <div className="d-flex justify-content-between customCardBody">
                <div>
                  <Card.Title>?????????????????????</Card.Title>
                </div>
                <div className="d-flex">
                  <Toggle
                    className="userToggleBtn"
                    checked={showCreateBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCreateBtn(!showCreateBtn);
                    }}
                  />
                  {showCreateBtn ? (
                    <Button
                      variant="primary"
                      onClick={handleShow}
                      title="Add User"
                    >
                      <FaPlus />
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <Table striped bordered hover variant="light" responsive="sm">
                <thead>
                  <tr>
                    <th>???????????????</th>
                    <th>??????</th>
                    <th>???</th>
                    <th>?????????</th>
                    <th>?????????</th>
                    <th>???????????????</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.username}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.email}</td>
                        <td>{(user.is_admin).toString()}</td>
                        <td>
                          <Button
                            variant="danger"
                            title="Delete user"
                            onClick={() => showDeleteModal(user.id)}
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                      ??????????????????????????????.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Modal size="lg" show={show} onHide={handleClose} centered>
            <Form
            noValidate 
            validated={validated}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e)
                onSubmit(newUser);
              }}
            >
              <Modal.Header closeButton style={width > 850 ?{marginTop: "20px"} : {marginTop: "50px"}}>
                {
                  editing === true 
                  ? <Modal.Title>???????????????????????????</Modal.Title>
                  : <Modal.Title>???????????????????????????</Modal.Title>
                }
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>???????????????</Form.Label>
                  <Form.Control
                  required
                    type="text"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    placeholder="Enter Username"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>?????????</Form.Label>
                  <Form.Control
                  required
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="Enter Email"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicFirstName">
                  <Form.Label>??????</Form.Label>
                  <Form.Control
                  required
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, first_name: e.target.value })
                    }
                    placeholder="Enter First Name"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLastName">
                  <Form.Label>???</Form.Label>
                  <Form.Control
                  required
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, last_name: e.target.value })
                    }
                    placeholder="Enter Last Name"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicComanyName">
                  <Form.Label>??????</Form.Label>
                  <Form.Control
                  required
                    type="text"
                    value={newUser.company_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, company_name: e.target.value })
                    }
                    placeholder="Enter Last Name"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>???????????????</Form.Label>
                  <Form.Control
                  required
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    placeholder="Enter Password"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                  <Form.Label>????????????????????????</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    value={cnewpassword}
                    onChange={handleCPassword}
                    placeholder="Confirm Password"
                  />
                </Form.Group>
        
                {shownewerrorMessage && isCnewpasswordDirty ? <div> ????????????????????????????????? </div> : ''}
                
               
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose2}>
                ?????????
                </Button>
                {editing === true ? (
                  <Button variant="primary" type="submit" onClick={handleClose}>
                    ????????????
                  </Button>
                ) : (
                  <Button variant="primary" type="submit" onClick={handleClose}>
                    ??????
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>
      <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={onDeleteUser} hideModal={hideConfirmationModal} deleteid={deleteid} message={deleteMessage}  />
    </Container>
  );
};

export default UsersNew;