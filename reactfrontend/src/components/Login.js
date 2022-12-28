import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {useCookies} from 'react-cookie';
// import axios from 'axios';
import axios from '../api/posts';
import ailogo from '../ailogo.png';
import DataContext from '../context/DataContext';
import { Alert, Modal, Button, Form } from 'react-bootstrap';
import '../css/login.css'

const Login = () => {
  const { users, setUsers, setIsAuthenticated } = useContext(DataContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [isadmin, setIsadmin] = useState(true);

  const [cPassword, setCPassword] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [cPasswordClass, setCPasswordClass] = useState('form-control');
  const [isCPasswordDirty, setIsCPasswordDirty] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [token, setToken, removeToken] = useCookies(['myToken']);
  const [userid, setUserid, removeSetUserid] = useCookies(['myUsername']);
  const [loginerror, setLoginerror] = useState('');
  const [regerror, setRegerror] = useState('');
  const [show, setShow] = useState(false);
  const [passEmail, setPassEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
 
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);  
  };
  const handleShow = () => {
    setShow(true);
    setErrorMessage(null)
    
  };


  useEffect(() => {
    if (token['myToken']){
        navigate('/');
    }
  }, [token]);

  useEffect(() => {
    if (isCPasswordDirty) {
        if (password === cPassword) {
            setShowErrorMessage(false);
            setCPasswordClass('form-control is-valid')
        } else {
            setShowErrorMessage(true)
            setCPasswordClass('form-control is-invalid')
        }
    }
}, [cPassword])

const handleCPassword = (e) => {
    setCPassword(e.target.value);
    setIsCPasswordDirty(true);
}

  const handleSubmit = async (e) => {
      e.preventDefault();
      // setIsAuthenticated(false);
      
      const newUser = { username: username, first_name:firstname, last_name:lastname, email: email, is_admin: isadmin, company_name:company, password:password };
      try {
          const response = await axios.post('/image/signup', newUser);
          const allUsers = [...users, response.data];
          setUsers(allUsers); 
          setUsername(response.data.username)
          setPassword(response.data.password)
          const user = {username: username, password: password}
          const response2 = await axios.post('/auth/', user);
          setToken('myToken', response2.data.token);
          setUserid('myUsername', user.username);
          setIsAuthenticated(true);
          navigate('/');   
      } catch (err) {
          console.log(`Error: ${err.message}`);
          setRegerror('ユーザー登録にエラーが発生しました. \n ユーザー名がすでに存在する. 入力内容が正しいかどうか、ご確認ください。.')
          setLoginerror('')
      }
  }
  const handleLogin = async (e) => {
      e.preventDefault();
      const user = { username: username, password:password };
     
      try {
          const response = await axios.post('/auth/', user);
          setToken('myToken', response.data.token);
          setUserid('myUsername', user.username);
          setIsAuthenticated(true);
          navigate('/');
      } catch (err) {
          console.log(`Error: ${err.message}`);
          setLoginerror('ユーザー名またはパスワードが無効です')
          setRegerror('')
      }
  }

  const submitForm = async () => { 
    const passForm = new FormData();
    passForm.append('email', passEmail)

    try {
        const response = await axios.post('/api/password_reset/', passForm);
        if(response.data.status === 'OK') {
          setSuccessMessage('パスワードの変更をメールで確認する!')
        }else{
          setErrorMessage('無効なメール!')
        }
        
        
    } catch (err) {
        console.log(`Error: ${err.message}`);
      
    }
  }


  return (
    <div id="bodydiv">
  <div className="col-lg-12 col-md-12 col-sm-12 mx-auto my-auto">
    <div className="row justify-content-center">
    <div className="col-12 col-sm-10 col-md-10 col-lg-6" style={{transform: "scale(0.8)"}}>
        <div className="login_card" style={{borderRadius: "25px"}}>
        {loginerror && <Alert variant="danger">{loginerror}</Alert>}
        {regerror && <Alert variant="danger">{regerror}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <img src={ailogo} alt="company logo"
                style={{height: "100%", width: "100%", objectFit: "contain", transform: "scale(0.9)"}}/>
            <div id="titlename">
                <h2>Image Similarity</h2>
            </div>
            <div id="loginname">
                <h1>ログイン</h1>
            </div>


            <div style={{padding: "15px", fontSize: "15px"}}>
            <form onSubmit={isLogin ? handleLogin : handleSubmit}>
                    {isLogin && <>
                        <div className="form-group">
              <label htmlFor="username">ユーザー名:</label>
                <input
                    id="username"
                    type="text"
                    className="form-control form-control-sm"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>
                 <div className="form-group">
                <label htmlFor="pasword">パスワード:</label>
                <input
                    id="password"
                    type="password"
                    className="form-control form-control-sm"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                </>}

                {!isLogin && <>
                    <div className="form-group">
                  <label htmlFor="username">ユーザー名:</label>
                <input
                    id="username"
                    type="text"
                    className="form-control form-control-sm"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>
                <div className="form-group">
                <label htmlFor="email">メール:</label>
                <input
                    id="email"
                    type="email"
                    className="form-control form-control-sm"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                <div className="form-group">

                <label htmlFor="first_name">名前:</label>
                <input
                    id="first_name"
                    type="text"
                    className="form-control form-control-sm"
                    required
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                />
                </div>
                <div className="form-group">
                <label htmlFor="last_name">姓:</label>
                <input
                    id="last_name"
                    type="text"
                    className="form-control form-control-sm"
                    required
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                />
                </div>
                <div className="form-group">
                <label htmlFor="company_name">会社:</label>
                <input
                    id="company_name"
                    type="text"
                    className="form-control form-control-sm"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                />
                </div>
                <div className="form-group">
                <label htmlFor="pasword">パスワード:</label>
                <input
                    id="password"
                    type="password"
                    className="form-control form-control-sm"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <div className="form-group">
                <label htmlFor="confirmPasword">パスワードの確認:</label>
                <input
                    id="confirmPassword"
                    type="password"
                    className="form-control form-control-sm"
                    required
                    value={cPassword}
                    onChange={handleCPassword}
                />
                </div>
                {showErrorMessage && isCPasswordDirty ? <div> パスワードが一致しない </div> : ''}
                
                </>}
                {isLogin && loginerror && <> <p><small className="text-muted" style={{color:"red"}}>{loginerror}</small></p> </>}
                {!isLogin && regerror && <> <p><small className="text-muted" style={{color:"red"}}>{regerror}</small></p> </>}
                <br />
                       
                        <div className="form-group" >
                        
                        <button className="button-new">{isLogin ? 'ログイン' : 'サインアップ'}</button>&nbsp;&nbsp;&nbsp;
                           <br /> 
                           <br /> 
                           <br /> 
                        {isLogin ? <p><small className="text-muted">アカウントを作成 <button className="button-new" onClick={() => setIsLogin(false)}>サインアップ</button></small></p> : 
                        <p><small className="text-muted">アカウントを持つ <button className="button-new" onClick={() => setIsLogin(true)}>ログイン</button></small></p>} 

                        {isLogin ? <p onClick={handleShow} style={{cursor:"pointer"}}><small className="text-danger">パスワードをお忘れる?</small></p>: null}
                        </div>
   
                </form>
                </div>

            </div>
        </div>
        
    </div>
    
    </div>
    <Modal show={show} onHide={handleClose} centered>
            <Form 
              onSubmit={(e) => {
                e.preventDefault();
                submitForm()
              }}
            >
              <Modal.Header closeButton>
              
                  <Modal.Title>メールアドレスを記入する</Modal.Title>
              
              </Modal.Header>
              
              <Modal.Body>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>メール</Form.Label>
                  <Form.Control
                  required
                    type="email"
                    value={passEmail}
                    onChange={(e) =>
                      setPassEmail(e.target.value)
                    }
                    placeholder="Enter Email"
                  />
                </Form.Group>
                
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                閉じる
                </Button>
              
                  <Button variant="primary" type="submit" onClick={handleClose}>
                  送信
                  </Button>
                
              </Modal.Footer>
            </Form>
          </Modal>
    </div>
    

  )
}

export default Login