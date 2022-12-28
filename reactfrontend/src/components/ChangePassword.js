import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../api/posts';
import ailogo from '../ailogo.png';
import { Alert } from 'react-bootstrap';
import '../css/login.css'

const ChangePassword = () => {
  const { id } = useParams();
  const myArray = id.split("=");
  let passtoken = myArray[1];
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [cPasswordClass, setCPasswordClass] = useState('form-control');
  const [isCPasswordDirty, setIsCPasswordDirty] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


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


  const submitForm = async (e) => { 
    e.preventDefault();
    const passForm = new FormData();
    passForm.append('token', passtoken )
    passForm.append('password', password )

    try {
        const response = await axios.post(`/api/password_reset/confirm/`, passForm);
        if(response.data.status === 'OK') {
          setSuccessMessage('パスワードの変更に成功しました!')
        }else{
          setErrorMessage('エラーが発生しました。もう一度やり直してください!')
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
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <img src={ailogo} alt="company logo"
                style={{height: "100%", width: "100%", objectFit: "contain", transform: "scale(0.9)"}}/>
            <div id="titlename">
                <h2>Image Similarity</h2>
            </div>
            <div id="loginname">
                <h1>パスワードの変更</h1>
            </div>


            <div style={{padding: "15px", fontSize: "15px"}}>
            <form onSubmit={submitForm}>
                   
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
                <div className="form-group">
                </div>
                <br />
                <br />
                       
                        <div className="form-group" >
                        
                        <button className="button-new">送信</button>
                        </div>
                        <br />
                        <p style={{cursor:"pointer"}}><Link to='login'><small className="text-danger">ログイン</small></Link></p>
                           
                </form>
                </div>

            </div>
        </div>
        
    </div>
    
    </div>
    
    </div>
    

  )
}

export default ChangePassword