import { useState, useContext, useRef } from 'react';
import DataContext from '../context/DataContext';
import '../css/homepage.css';
// import axios from 'axios';
import axios from '../api/posts';
import { useCookies } from 'react-cookie';
import { AreaSelector } from '@bmunozg/react-image-area';
import {Button, Modal} from "react-bootstrap";
import { Alert } from 'react-bootstrap';
import useWindowSize from '../hooks/useWindowSize';
import { Select, CaretIcon, ModalCloseButton } from 'react-responsive-select';
import 'react-responsive-select/dist/react-responsive-select.css';
import Resizer from "react-image-file-resizer";


const Home = () => {
    const [token, setToken, removeToken] = useCookies(['myToken']);
    const { width } = useWindowSize();
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);
    const [areas, setAreas] = useState([]);
    let imgwidth = (width >= 995 ? 500 : width < 995 && width >=495 ? 450 : width < 495 ? 300 : null)
    let imgheight = (width >= 995 ? 500 : width < 995 && width >=495 ? 450 : width < 495 ? 300 : null)

    let cookie = token['myToken'];

    // useEffect(() => {
    //   if (!token['myToken']){
    //       navigate('login');
    //   }
    // }, [token]);

const resizeFile = (file) =>
  new Promise((resolve) => {
    console.log('large')
    Resizer.imageFileResizer(
      file,
      imgwidth,
      imgheight,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
    "blob"
    );
  });


    const onChangeHandler = (areas) => {
            setAreas(areas);
        
    }

    
    const handleClose = () => {
        setShow(false);   
      };

      const handleShow = () => {
        setShow(true);
       }
     
    
    const { myData } = useContext(DataContext);
    const [file, setFile] = useState();
    const [results, setResults] = useState([])
    const [title, setTitle] = useState(0)
    const [upImage, setUpImage] = useState()
    const [imgName, setImgName] = useState('')
    const [search, setSearch] = useState(false)
    const ref = useRef();
    let maxareas = 1;

    const handleChange = (newvalue) => {
        setErrorMessage('');
        setTitle(newvalue.value);
    };

    const handleChangeImg = async (event) => {
        try {
          const file = event.target.files[0];
          console.log(file);
          let name = ((file.name).split('.'))[0];
          console.log(name);
          setImgName(name);
          const image = await resizeFile(file)
        setErrorMessage('');
        setFile(URL.createObjectURL(image));
        setUpImage(image);
        setSearch(false);

        } catch (err) {
          console.log(err);
        }
      };


    const searchSimilarity = async () => {
        try {
        let uploadData = new FormData();
        uploadData.append('category_id', title)
        uploadData.append('image', upImage, `${imgName}.jpg`)
        if (areas.length > 0){
            const {x: x, y: y, height: height, width: width} = areas[0]
            const x1 = x + width;
            const y1 = y + height;
            const region = `${x},${x1},${y},${y1}`
            console.log(region)
            uploadData.append('region', region)
        } 
       
        else {
            uploadData.append('region', null)
        }
        

        
            setErrorMessage('');
            const response = await axios.post(`/image/search`, uploadData, { headers: { Authorization: `Token ${cookie}` }});
            console.log(response);
            setResults(response.data);
            setAreas([]);
            setSearch(true);
            
        } catch (err) {
            console.log(`Error: ${err.message}`);
            setErrorMessage('検索にエラーが発生しました. 画像を選択し、検索カテゴリーを選択したことをご確認ください。');
            ref.current.value = "";
            setUpImage(null);
            setFile(null);
            setAreas([]);
        }

    }
   

    return (
        <main>
           <div className="wrapper">
  <div className="container">
    <h1>類似画像検索</h1>
    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    <div className="upload-container">
      <div className="border-container">
        <div style={width >= 768 ? {display: "flex", flexDirection: "row", justifyContent:"center"}: {display: "flex", flexDirection: "column", justifyContent:"center"}}>
        <input ref={ref} onChange={handleChangeImg} type="file" id="file-upload" name="testImage"/>
        { width <= 768 ? <br/>: null} 
        
     {myData.length > 0 ? <Select
      modalCloseButton={<ModalCloseButton />}
      options={[{ value: 0, text: 'カテゴリー' },...myData]}
      caretIcon={<CaretIcon />}
        onChange={newvalue => handleChange(newvalue)}
    /> : 
    // <Select
    
    //   modalCloseButton={<ModalCloseButton />}
    //   options={[{ value: 0, text: 'カテゴリー' }]}
    //   caretIcon={<CaretIcon />}
   
    // />
    null
    }
      </div>
       </div>
    </div>
    <br />
    <button onClick={() => searchSimilarity()} className='btn btn-danger'>探索 </button>
  </div>
</div>
{file && !errorMessage ?
<div className="galleryresults" >
<div className="results_container" >
    <div>
 <h4>アップロードされた画像</h4>
 <br /> 
           
            <img src={file} style={{objectFit: "contain", margin: "0 auto"}} alt="search"/>
  
        </div>
        <br />
        <br />
        <div>
        <Button
                      variant="danger"
                      onClick={handleShow}
                      title="Add User"
                    >
                        機能を選択
                    
                    </Button>

        <Modal size="lg" show={show} onHide={handleClose} centered >
            
           
              <Modal.Header closeButton>
                
                  <Modal.Title>機能を選択</Modal.Title>
               
              </Modal.Header>
              <Modal.Body>
              <AreaSelector
            maxAreas={maxareas}  
            areas={areas}
            onChange={onChangeHandler}
        >
            <img src={file} alt='search'/>
           
        </AreaSelector>
       
                
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                閉じる
                </Button>
               
              </Modal.Footer>
           
          </Modal>
          </div>
          </div>
        </div>: null} 
       

                <div id="title">
                {file && results.length > 0 ? <h2>検索結果</h2> : null}
                
                    
                </div>
                 <div className="gallery">

                   {file && results.length > 0 && !errorMessage ? results.map(result => (
                    <div className="results_container" id="portfolio" >
                        <img src={result.link} style={{objectFit: "contain"}}/>
                        <div className="image_desc">
                            <h5 className="gallery-title">類比点: {(result.score*100).toFixed(2)} %</h5>
                            {/* <a href="#item-1" className="results_button" role="button">More info</a> */}
                            
                        </div>
                    </div>
                   )): null}

                 {search && file && results.length === 0 && !errorMessage ? 
                            <h2>選択された画像またはフィーチャーの類似性結果がない。</h2>
                   : null}
                    
                    
                </div> 
               
                 <div className="gallery_lightboxes">
                  
                 <div id="item-1" className="lightbox">
                        <div className="lightbox_content">
                            {/* <a href="#!" className="close"></a> */}
                            {/* <img className="lightbox-image" src="https://raw.githubusercontent.com/suongfiori/project-gallery-calathea/main/images/calathea-bachemiana-large.jpg" alt=""/> */}
                            <h3 className="lightbox-title">Last, First Name</h3>
                            <p className="text"><b>Age</b>: &nbsp;&nbsp;35</p>
                            <p className="text"><b>Birth Date:</b> &nbsp;&nbsp;May 15 1987</p>
                            <p className="text"><b>Astrological Sign:</b> &nbsp;&nbsp;Gemini</p>
                            <p className="text"><b>Employment status:</b> &nbsp;&nbsp;Employed</p>
                            <p className="text"><b>Company:</b> &nbsp;&nbsp;XYZ Limited</p>
                            <p className="text"><b>Job Field:</b> &nbsp;&nbsp;Software Engineer</p>                           
                            <p className="text"><b>Hobbies:</b> &nbsp;&nbsp;Tennis, Swimming, Hiking</p>
                            {/* <p className="text">Dislikes: </p> */}
                            <p className="text"><b>Preferences:</b> &nbsp;&nbsp;Preferences</p>
                            
                        </div>
                    </div>
                   
                 </div> 
                 
                 {file && results.length > 0 ? <div className="return" role="button" style={{marginBottom: "40px"}}><a href="#top">ページの先頭へ戻る</a></div> : null}
                 
          
        </main>
    )
}

export default Home