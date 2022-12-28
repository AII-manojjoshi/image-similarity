import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import { FaRegEdit } from 'react-icons/fa';
import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  Modal,
  Alert,
} from "react-bootstrap";
import avatar from '../avatar.jpg';
import '../css/profilepage.css'

import DataContext from '../context/DataContext';
// import axios from 'axios';
import axios from '../api/posts';
import { useCookies } from 'react-cookie';
import DeleteConfirmation from "./DeleteConfirmation";
import useWindowSize from '../hooks/useWindowSize';


export default function ProfilePageNew() {
  const { width } = useWindowSize();
  const [deleteid, setDeleteId] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [userMessage, setUserMessage] = useState(null);
  const [token, setToken, removeToken] = useCookies(['myToken']);
  const [userid, setUserid, removeSetUserid] = useCookies(['myUsername']);
  const [show2, setShow2] = useState(false);
  
  const { users, setUsers } = useContext(DataContext);
  const [cnewpassword, setCnewpassword] = useState('');
  const [shownewerrorMessage, setShownewerrorMessage] = useState(false);
  const [cnewpasswordClass, setCnewpasswordClass] = useState('form-control');
  const [isCnewpasswordDirty, setIsCnewpasswordDirty] = useState(false);
  const navigate = useNavigate();

  const currentusername = token['myUsername'];
  const currentuser = users.find(user => user.username === currentusername);

  let cookie = token['myToken'];

  const showDeleteModal = (deleteid) => {
    setDeleteId(deleteid);
    setUserMessage(null);
    setErrorMessage(null)
    setDeleteMessage('本当にアカウントを削除しますか？');
    setDisplayConfirmationModal(true);
  };
 
  // Hide the modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

  
  const initCurrentUser2 = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  };

  const [newUser2, setNewUser2] = useState(initCurrentUser2);

  const handleClose2 = () => {
    setShow2(false);   
  };
  const handleShow2 = () => {
    setShow2(true);
      setNewUser2(initCurrentUser2);
  
  };


  const onEdit2 = (newUser2) => {
      setNewUser2({ ...newUser2, newUser2 });
      handleShow2();
    
  };

  const onSubmit2 = (newUser2) => {
      onUpdateUser2(newUser2);
  
  };


  const onUpdateUser2 = async (newUser2) => {
    let id = currentuser.id;
    try {
      const response = await axios.patch(`/image/update/${(id).toString()}`, newUser2, { headers: { Authorization: `Token ${cookie}` }});
      console.log(response);
      setUsers(users.map(user => user.id === id ? { ...response.data } : user));
      if (response.data.username !== currentuser.username){
        removeToken(['myToken']);
        removeSetUserid(['myUsername']);
        navigate('/login');
        
      }
      setUserMessage(`'${users.find((x) => x.id === id).username}' は正常に更新されました。`);
      setErrorMessage(null);
      
     
  } catch (err) {
      console.log(`Error: ${err.message}`);
      setErrorMessage('ユーザーの更新にエラーが発生しました. \n 記入内容に間違いがないかご確認ください.')
      setUserMessage(null);
  }
  };

  

    useEffect(() => {
        if (isCnewpasswordDirty) {
            if (newUser2.password === cnewpassword) {
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

    
  const onDeleteUser = async (deleteid) => {
    try {
      await axios.delete(`/image/update/${(deleteid).toString()}`, { headers: { Authorization: `Token ${cookie}` }});
      const usersList = users.filter(user => user.id !== deleteid);
      setUserMessage(`'${users.find((x) => x.id === deleteid).username}' は正常に削除されました.`);
      setErrorMessage(null)
      setUsers(usersList);
      setDisplayConfirmationModal(false);
      removeToken(['myToken']);
      removeSetUserid(['myUsername']);
      navigate('/login');
  } catch (err) {
      console.log(`Error: ${err.message}`);
      setErrorMessage('ユーザーの削除にエラーが発生しました。もう一度お試しください。');
      setUserMessage(null);
  }
  };


  return (
    <section className="vh-100" >
      
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {userMessage && <Alert variant="success">{userMessage}</Alert>}
          <MDBCol lg="8" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
              <MDBRow className="g-0">
                <MDBCol md="4" className="gradient-custom text-center text-white"
                  style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                  <MDBCardImage src={avatar}
                    alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                  <MDBTypography tag="h5">{currentuser.first_name}&nbsp;{currentuser.last_name}</MDBTypography>
                  <MDBCardText>{currentuser.username}</MDBCardText>
                  <FaRegEdit onClick={() => onEdit2(currentuser)} style={{width: "50px", marginBottom: "10px", marginTop: "20px", cursor: "pointer"}}/>
                 
                  <br />
                  <br />
                  
                  {
                    width > 767 ?
                    <Button 
                  variant="danger" 
                  type="submit" 
                  onClick={() => showDeleteModal(currentuser.id)}
                  >
                    アカウント削除
                  </Button> : null
                  }

                  
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <MDBTypography tag="h6">ユーザー情報</MDBTypography>
                    <hr className="mt-0 mb-4" style={{borderTop: "1px solid black"}}/>
                    <MDBRow className="pt-1">
                      <MDBCol size="12" className="mb-3">
                        <MDBTypography tag="h6">ユーザー名</MDBTypography>
                        <MDBCardText className="text-muted">{currentuser.username}</MDBCardText>
                        <hr className="mt-0 mb-4" />
                        <MDBTypography tag="h6">メール</MDBTypography>
                        <MDBCardText className="text-muted">{currentuser.email}</MDBCardText>
                        <hr className="mt-0 mb-4" />
                        <MDBTypography tag="h6">名前</MDBTypography>
                        <MDBCardText className="text-muted">{currentuser.first_name}</MDBCardText>
                        <hr className="mt-0 mb-4" />
                        <MDBTypography tag="h6">姓</MDBTypography>
                        <MDBCardText className="text-muted">{currentuser.last_name}</MDBCardText>
                        <hr className="mt-0 mb-4" />
                        <MDBTypography tag="h6">会社</MDBTypography>
                        <MDBCardText className="text-muted">{currentuser.company_name}</MDBCardText>
                        <hr className="mt-0 mb-4" />
                        <MDBTypography tag="h6">管理者</MDBTypography>
                        <MDBCardText className="text-muted">{(currentuser.is_admin).toString()}</MDBCardText>
                        <hr className="mt-0 mb-4" />
                      </MDBCol>
                      {
                    width < 767 ?
                    <Button 
                  variant="danger" 
                  type="submit" 
                  onClick={() => showDeleteModal(currentuser.id)}
                  >
                    アカウント削除
                  </Button> : null
                  }
                      
                    </MDBRow>

                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
            <Modal size="lg" show={show2} onHide={handleClose2} centered>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit2(newUser2);
              }}
            >
              <Modal.Header closeButton style={width > 850 ?{marginTop: "20px"} : {marginTop: "50px"}}>
              <Modal.Title>ユーザー情報の編集</Modal.Title>
                  </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>ユーザー名</Form.Label>
                  <Form.Control
                  required
                    type="text"
                    value={newUser2.username}
                    onChange={(e) =>
                      setNewUser2({ ...newUser2, username: e.target.value })
                    }
                    placeholder="Enter Username"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>メール</Form.Label>
                  <Form.Control
                  required
                    type="email"
                    value={newUser2.email}
                    onChange={(e) =>
                      setNewUser2({ ...newUser2, email: e.target.value })
                    }
                    placeholder="Enter Email"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicFirstName">
                  <Form.Label>名前</Form.Label>
                  <Form.Control
                  required
                    type="text"
                    value={newUser2.first_name}
                    onChange={(e) =>
                      setNewUser2({ ...newUser2, first_name: e.target.value })
                    }
                    placeholder="Enter First Name"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLastName">
                  <Form.Label>姓</Form.Label>
                  <Form.Control
                  required
                    type="text"
                    value={newUser2.last_name}
                    onChange={(e) =>
                      setNewUser2({ ...newUser2, last_name: e.target.value })
                    }
                    placeholder="Enter Last Name"
                  />
                </Form.Group>
                <br />
                <h4>確認のためパスワードを入力</h4>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>パスワード</Form.Label>
                  <Form.Control
                  required
                    type="password"
                    value={newUser2.password}
                    onChange={(e) =>
                      setNewUser2({ ...newUser2, password: e.target.value })
                    }
                    placeholder="Enter Password"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                  <Form.Label>パスワードの確認</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    value={cnewpassword}
                    onChange={handleCPassword}
                    placeholder="Confirm Password"
                  />
                </Form.Group>
        
                {shownewerrorMessage && isCnewpasswordDirty ? <div> パスワードが一致しない </div> : ''}
                
               
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose2}>
                閉じる
                </Button>
                <Button variant="primary" type="submit" onClick={handleClose2}>
                更新する
                  </Button>
                </Modal.Footer>
            </Form>
          </Modal>
          </MDBCol>
        </MDBRow>
        <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={onDeleteUser} hideModal={hideConfirmationModal} deleteid={deleteid} message={deleteMessage} />
      </MDBContainer>
    </section>
  );
}