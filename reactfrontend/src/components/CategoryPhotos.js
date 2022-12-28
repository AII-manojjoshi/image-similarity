import { useState, useContext, useEffect, useRef } from 'react';
import DataContext from '../context/DataContext';
import '../css/homepage.css';
// import axios from 'axios';
import axios from '../api/posts';
import { useCookies } from 'react-cookie';
import { useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { Alert } from 'react-bootstrap';
import DeleteConfirmation from "./DeleteConfirmation";
import ImageUploading from "react-images-uploading";
import { Alert as Alert2, Button as Button2, ButtonGroup } from "reactstrap";

const CategoryPhotos = (props) => {

    const [errorMessage, setErrorMessage] = useState('');
    const [createMessage, setCreateMessage] = useState(null);
    const { categories } = useContext(DataContext);
    console.log(categories);
    const [photos, setPhotos ] = useState([]);
    const { id } = useParams();
    console.log(id);
    const category = categories.find(category => category.id === parseInt(id));
    console.log(category.id)

    const ref = useRef();

    const [deleteid, setDeleteId] = useState(null);
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [token, setToken, removeToken] = useCookies(['myToken']);

    const cookie = token['myToken'];

  let imageList2 = [];

  const {
    maxNumber = 10,
    acceptType = ["jpeg", "jpg", "png"],
    maxFileSize = 5000000
  } = props;

  const [images, setImages] = useState([]);
  
  Object.values(images).forEach(val => imageList2.push(val.file));
 
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const onError = () => {
    setImages([]);
  };


  const multipleUpload = async () =>{
    
  let allPhotos = [];
  let allConfirmations = [];
  let allErrors = [];
  setErrorMessage('');
  setCreateMessage('');

    for (let i = 0; i < imageList2.length; i++){
      console.log(imageList2[i]);

    try {
        let uploadData = new FormData();
        uploadData.append('category', title)
        uploadData.append('image', imageList2[i], imageList2[i].name)

        const response = await axios.post(`/image/add`, uploadData, { headers: { Authorization: `Token ${cookie}` }});
        allPhotos.push(response.data);
        
        allConfirmations.push(`\n ${imageList2[i].name}, `)
       
        if(i == images.length - 1){
          allConfirmations.push(`\n 画像のアップロードに成功しました.`)
          const allPhotos2 = [...photos, ...allPhotos];
          setPhotos(allPhotos2);
          setCreateMessage([...allConfirmations]);
          if (allErrors.length > 0){
            allErrors.push(`\n 画像のアップロードにエラーが発生しました. \n 画像を選択したことを確認する.`)
            setErrorMessage([...allErrors]);
          }
          setImages([]);
          document.getElementById("removeImages").click();
        }
        
        
    } catch (err) {
        console.log(`Error: ${err.message}`);
        
        allErrors.push(`\n ${imageList2[i].name}, `)
    }
  }

  }



  const showDeleteModal = (deleteid) => {
    setDeleteId(deleteid);
    setErrorMessage(null)
    setDeleteMessage('この画像を本当に削除しますか?');
    setDisplayConfirmationModal(true);
  };
 
  // Hide the modal
  const hideConfirmationModal = () => {
    setDisplayConfirmationModal(false);
  };

   
    const photoList1 = photos.filter(photo => photo.category === category.id);
    const [title, setTitle] = useState(id)
    // const [upImage, setUpImage] = useState()
    


    useEffect(() => {
        const fetchPhotos = async () => {
       
          try {
            const response = await axios.get('/image/add', { headers: { Authorization: `Token ${cookie}` }});
            console.log(response);
            setPhotos(response.data);
            setErrorMessage('');
            
          } catch (err) {
            setErrorMessage('画像の取得にエラーが発生しました.');
            if (err.response) {
              console.log(err.response.data);
              console.log(err.response.status);
              console.log(err.response.headers);
            } else {
              console.log(`Error: ${err.message}`);
            }
          }
        }
    
        fetchPhotos();
      }, [])

    
    // const uploadImage = async () => {
      
    //     try {
    //         let uploadData = new FormData();
    //         uploadData.append('category', title)
    //         uploadData.append('image', upImage, upImage.name)

    //         const response = await axios.post(`/image/add`, uploadData, { headers: { Authorization: `Token ${cookie}` }});
            
    //         setCreateMessage('画像のアップロードに成功しました.');
    //         setErrorMessage('');
    //         console.log(response);
    //         const allPhotos = [...photos, response.data];
    //         setPhotos(allPhotos);
    //         ref.current.value = "";
    //         setUpImage(null);
            
    //     } catch (err) {
    //         console.log(`Error: ${err.message}`);
    //         setCreateMessage('');
    //         setErrorMessage('画像のアップロードにエラーが発生しました. \n 画像を選択したことを確認する.');
    //     }

    // }

    const onDeletePhoto = async (deleteid) => {
        try {
            await axios.delete(`/image/image/${deleteid}`, { headers: { Authorization: `Token ${cookie}` }});
            const allPhotos2 = photos.filter(photo => photo.product_id !== deleteid);
            setPhotos(allPhotos2);
            setCreateMessage('画像の削除に成功しました.');
            setErrorMessage('');
            setDisplayConfirmationModal(false);
        } catch (err) {
            console.log(`Error: ${err.message}`);
            setCreateMessage('');
            setErrorMessage('画像の削除にエラーが発生しました.');
        }
      };
   

    return (
        <main>
           <div className="wrapper">
  <div className="container">
    <h1>{category.category_name}</h1>
    {createMessage && <Alert variant="success">{createMessage}</Alert>}
    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    <h3>画像アップロード</h3>
    <div >
       <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        onError={onError}
        maxNumber={maxNumber}
        acceptType={acceptType}
        maxFileSize={maxFileSize}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
          errors
        }) => (
            <>
            {errors && (
              <Alert2 color="danger text-start">
                <ul>
                  {errors.maxNumber && (
                    <li>Number of selected images exceed maxNumber</li>
                  )}
                  {errors.acceptType && (
                    <li>Your selected file type is not allow</li>
                  )}
                  {errors.maxFileSize && (
                    <li>Selected file size exceed maxFileSize</li>
                  )}
                </ul>
              </Alert2>
            )}
            <div className="upload__image-wrapper">
              <div
                className="upload-container-multiple"
                {...dragProps}
                onClick={onImageUpload}
                style={
                  isDragging
                    ? { backgroundColor: "#afafaf", color: "white" }
                    : undefined
                }
              >
                Choose a file or Drag it here
              </div>
              <div className="p-2" style={{ textAlign: "left" }}>
                {imageList.map((image, index) => (
                  <div
                    key={index}
                    className="image-item  "
                    style={{
                      width: "150px",
                      marginRight: "10px",
                      display: "inline-block"
                    }}
                  >
                    <img
                      src={image["data_url"]}
                      alt=""
                      style={{ width: "100%" }}
                    />
                    <div className="image-item__btn-wrapper mt-1">
                      <ButtonGroup size="sm" style={{ width: "100%" }}>
                        <Button2
                          color="primary"
                          onClick={() => onImageUpdate(index)}
                        >
                          Update
                        </Button2>
                        <Button2
                          color="danger"
                          onClick={() => onImageRemove(index)}
                        >
                          Remove
                        </Button2>
                      </ButtonGroup>
                    </div>
                  </div>
                ))}
              </div>
              {images.length > 0 && (
                <>
                  <hr />
                  <div className="text-start p-2">
                    <Button2 onClick={multipleUpload} color="success">
                      Upload
                    </Button2>{" "}
                    <Button2 id = "removeImages" onClick={onImageRemoveAll} color="danger">
                      Remove All Images
                    </Button2>
                  </div>
                  <pre className="text-start" id="jsonprint"></pre>
                </>
              )}
            </div>
          </>
        )}
      </ImageUploading>
    </div>
    {/* <div className="upload-container">
      <div className="border-container">
        <input ref={ref} onChange={(evt) => setUpImage(evt.target.files[0])} type="file" id="file-upload" name="testImage"/>
      </div>
    </div>
    <br />
    <button onClick={() => uploadImage()} className='btn btn-danger'>イメージを追加する</button> */}
  </div>
</div>
<br />

                <div id="title">
                {photoList1.length > 0 ? <><h2>カテゴリー画像</h2> <br /> <h4>画像数: {photoList1.length}</h4> </> : null}
                </div>
                 <div className="gallery">
                 {photoList1.map(catphoto => (
                    <div key={catphoto.image_name} className="results_container" id="portfolio">
                        <img src={catphoto.image} style={{objectFit: "contain"}} alt="category photo"/>
                        <div className="image_desc">
                            <h3 className="gallery-title">{catphoto.image_name}</h3>
                            {/* <a href="#item-1" className="results_button" role="button">More info</a> */}
                            &nbsp;&nbsp;&nbsp;
                            <Button
                            variant="danger"
                            title="Delete user"
                            onClick={() => showDeleteModal(catphoto.product_id)}
                          >
                            <FaTrashAlt />
                          </Button>
                        </div>
                    </div>
                 ))}
                    
                    
                </div> 
               
                 <div className="gallery_lightboxes">
                  
                    <div id="item-1" className="lightbox">
                        <div className="lightbox_content">
                            <a href="#!" className="close"></a>
                            {/* <img className="lightbox-image" src="https://raw.githubusercontent.com/suongfiori/project-gallery-calathea/main/images/calathea-bachemiana-large.jpg" alt=""/> */}
                            <h3 className="lightbox-title">Last, First Name</h3>
                            <p className="text"><b>Age</b>: &nbsp;&nbsp;35</p>
                            <p className="text"><b>Birth Date:</b> &nbsp;&nbsp;May 15 1987</p>
                            <p className="text"><b>Astrological Sign:</b> &nbsp;&nbsp;Gemini</p>
                            <p className="text"><b>Employment status:</b> &nbsp;&nbsp;Employed</p>
                            <p className="text"><b>Company:</b> &nbsp;&nbsp;XYZ Limited</p>
                            <p className="text"><b>Job Field:</b> &nbsp;&nbsp;Software Engineer</p>                           
                            <p className="text"><b>Hobbies:</b> &nbsp;&nbsp;Tennis, Swimming, Hiking</p>
                            <p className="text"><b>Preferences:</b> &nbsp;&nbsp;Preferences</p>
                            
                        </div>
                    </div>
                    
                  
                 </div>
                 {photoList1.length > 0 ? <div className="return" role="button" style={{marginBottom: "40px"}}><a href="#top">ページの先頭へ戻る</a></div> : null}
                 <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={onDeletePhoto} hideModal={hideConfirmationModal} deleteid={deleteid} message={deleteMessage}  />
        </main>
    )
}

export default CategoryPhotos