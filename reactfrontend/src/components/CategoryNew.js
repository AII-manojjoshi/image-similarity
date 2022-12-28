import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
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
import { FaPencilAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import DataContext from '../context/DataContext';
// import axios from 'axios';
import axios from '../api/posts';
import { useCookies } from 'react-cookie';
import DeleteConfirmation from "./DeleteConfirmation";

const CategoryNew = () => {
    const navigate = useNavigate();
    const { categories, setCategories, myData, setMyData } = useContext(DataContext);  
    const [token, setToken, removeToken] = useCookies(['myToken']);
    const [deleteid, setDeleteId] = useState(null);
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [changeMessage, setChangeMessage] = useState(null);
    const [updateMessage, setUpdateMessage] = useState(null);
    const [createMessage, setCreateMessage] = useState(null);
    const [categoryMessage, setCategoryMessage] = useState(null);
    const [validated, setValidated] = useState(false);
    const [showCreateBtn, setShowCreateBtn] = useState(true);
    const [editing, setEdit] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);

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
      setCategoryMessage(null);
      setErrorMessage(null)
      setDeleteMessage(`'${categories.find((x) => x.id === deleteid).category_name}' を本当に削除してよろしいですか? \n このカテゴリに関連する画像も削除されます.`);
      setDisplayConfirmationModal(true);
    };
   
    // Hide the modal
    const hideConfirmationModal = () => {
      setDisplayConfirmationModal(false);
    };

    

    


  const initCategory = {
    category_name: "",
    category_description: ""
  };

  
  const [newCategory, setNewCategory] = useState(initCategory);
  

  const handleClose = () => {
    setShow(false);  
  };

  const handleClose2 = () => {
    setShow(false); 
    setEdit(false);  
  };

  const handleShow = () => {
    setEdit(false);
    setShow(true);
    setErrorMessage(null)
    if(editing === false) {
      setNewCategory(initCategory);
    }
    setChangeMessage('change');
  };

  const handleShow2 = () => {
    setShow(true);
    setErrorMessage(null)
    if(editing === false) {
      setNewCategory(initCategory);
    }
    setChangeMessage('change');
  };

  const onFormSubmit = async (newCategory) => {
    newCategory = { ...newCategory}
   
    try {
        const response = await axios.post(`/image/category`, newCategory,  { headers: { Authorization: `Token ${cookie}` }});
        console.log(response.data)
        setCreateMessage(`'${newCategory.category_name}' は正常に作成されました.`);
        setUpdateMessage(null)
        setCategoryMessage(null)
        setErrorMessage(null)
        setMyData([{value: response.data.id, text: response.data.category_name}, ...myData])
        const allCategories = [...categories, response.data];
        setCategories(allCategories);
        
    } catch (err) {
        console.log(`Error: ${err.message}`);
        setErrorMessage('カテゴリの作成にエラーが発生しました. \n 入力内容が正しいかどうか、ご確認ください.');
        setUpdateMessage(null)
        setCategoryMessage(null)
        setCreateMessage(null)
    }
  };

  const onEdit = (newCategory) => {
    setEdit(true);
    if(editing === true) {
      setNewCategory({ ...newCategory, newCategory });
      handleShow2();
    }
    
  };

  const onSubmit = (newCategory) => {
    if (editing === true) {
      onUpdateCategory(newCategory);
    } else {
      onFormSubmit(newCategory);
    }
  };


  const onUpdateCategory = async (newCategory) => {
    let id = newCategory.id;
    try {
        const response = await axios.patch(`/image/categorydetail/${id}`, newCategory,  { headers: { Authorization: `Token ${cookie}` }});
        setUpdateMessage(`'${newCategory.category_name}' は正常に更新されました.`);
        setCategoryMessage(null)
        setCreateMessage(null)
        setErrorMessage(null)
        setCategories(categories.map(category => category.id === id ? { ...response.data } : category));
        setEdit(false);
      
    } catch (err) {
        console.log(`Error: ${err.message}`);
        setErrorMessage('カテゴリの更新にエラーが発生しました. \n 入力内容が正しいかどうか、ご確認ください.');
        setCreateMessage(null)
        setCategoryMessage(null)
        setUpdateMessage(null)
        setEdit(false);
    }
  };


  const onDeleteCategory = async (deleteid) => {
    try {
        await axios.delete(`/image/categorydetail/${deleteid}`, { headers: { Authorization: `Token ${cookie}` }});
        setCategoryMessage(`'${categories.find((x) => x.id === deleteid).category_name}' は正常に削除されました.`);
        setUpdateMessage(null)
        setCreateMessage(null)
        setErrorMessage(null)
        const categoryList = categories.filter(category => category.id !== deleteid);
        setCategories(categoryList);
        setDisplayConfirmationModal(false);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        setErrorMessage('カテゴリの削除にエラーが発生しました. もう一度お試しください.');
        setCreateMessage(null)
        setUpdateMessage(null)
        setCategoryMessage(null)
    }
  };

  const handleRowClick = (cate) => {
    navigate(`categoryphotos/${parseInt(cate.id)}`);
} 

  return (
    <Container fluid="sm">
      <Row>
        <Col>
          <Card className="customCard">
            <Card.Body>
            {deleteMessage && categoryMessage && <Alert variant="success">{categoryMessage}</Alert>}
            {changeMessage && updateMessage && <Alert variant="success">{updateMessage}</Alert>}
            {changeMessage && createMessage && <Alert variant="success">{createMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <div className="d-flex justify-content-between customCardBody">
                <div>
                  <Card.Title>カテゴリリスト</Card.Title>
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
                      title="Add Category"
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
                    <th>名前</th>
                    <th>記述</th>
                    <th>アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <tr key={index}>
                        <td style={{cursor:'pointer'}} onClick={()=> handleRowClick(category)}>{category.category_name}</td>
                        <td>{category.category_description}</td>
                        <td>
                          <Button
                            variant="info"
                            title="Edit Category Details"
                            onClick={() => onEdit(category)}
                          >
                            <FaPencilAlt />
                          </Button>{" "}
                          <Button
                            variant="danger"
                            title="Delete Category"
                            onClick={() => showDeleteModal(category.id)}
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                      カテゴリがありません.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Modal size="lg" show={show} onHide={handleClose} centered >
            <Form 
            noValidate 
            validated={validated}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e)
                onSubmit(newCategory);
              }}
            >
              <Modal.Header closeButton>
                {
                  editing === true 
                  ? <Modal.Title>カテゴリー情報の編集</Modal.Title>
                  : <Modal.Title>カテゴリーを追加する</Modal.Title>
                }
              </Modal.Header>
              
              <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>名前</Form.Label>
                  <Form.Control
                  required
                    type="text"
                    value={newCategory.category_name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, category_name: e.target.value })
                    }
                    placeholder="Enter Category Name"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>記述</Form.Label>
                  <Form.Control
                  required
                    type="text"
                    value={newCategory.category_description}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, category_description: e.target.value })
                    }
                    placeholder="Enter Category Description"
                  />
                </Form.Group>
                
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose2}>
                閉じる
                </Button>
                {editing === true ? (
                  <Button variant="primary" type="submit" onClick={handleClose}>
                    更新する
                  </Button>
                ) : (
                  <Button variant="primary" disabled={!newCategory.category_name} type="submit" onClick={handleClose}>
                    送信
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>
      <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={onDeleteCategory} hideModal={hideConfirmationModal} deleteid={deleteid} message={deleteMessage}  />
    </Container>
  );
};

export default CategoryNew;