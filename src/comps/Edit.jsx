import React from "react";
import db from "../firebase/firebase";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  setDoc,
  doc,
  updateDoc,
  getDocs,
  collection,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

function Edit() {
  const [getUser, setGetUser] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "user"));
        const userList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setGetUser(userList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isUploading, setIsUploading] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    DOB: "",
    qualifications: [],
  });


  const [imgFile, setimgFile] = React.useState();
  const [resumeFile, setResumeFile] = React.useState();
  const [imgURL, setImgUrl] = React.useState();
  const [resumeUrl, setResumeUrl] = React.useState();
  const [isResumeUpdated, setIsResumeUpdated] = React.useState(false);

  React.useEffect(() => {
    setIsResumeUpdated(false);
  }, [resumeFile]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "user", id));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setImgUrl(userDoc.data().img);
          setResumeUrl(userDoc.data().resume);

        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [id]);

  const addField = (e) => {
    e.preventDefault();
    setUserData((prevData) => ({
      ...prevData,
      qualifications: [...prevData.qualifications, { qualification: "" }],
    }));
  };

  const removeField = (index, e) => {
    e.preventDefault();
    let updatedQualifications = [...userData.qualifications];
    updatedQualifications.splice(index, 1);
    setUserData((prevData) => ({
      ...prevData,
      qualifications: updatedQualifications,
    }));
  };

  const handleChangeDynamic = (index, event) => {
    const { name, value } = event.target;
    const updatedQualifications = [...userData.qualifications];
    updatedQualifications[index] = {
      ...updatedQualifications[index],
      [name]: value,
    };
    setUserData((prevData) => ({
      ...prevData,
      qualifications: updatedQualifications,
    }));
  };

  function handleChange(e) {
    if (e.target.name == "img" || e.target.name == "resume") {
      return;
    }
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  }
  const handleImageRemove = () => {
    setimgFile(null);
    setImgUrl('');
  };
  async function handelUpdate(e) {
    e.preventDefault();
    setIsUploading(true);

    try {
      let imageURL = imgURL;
      let resumeURL = resumeUrl;

      if (imgFile) {
        imageURL = await uploadFile("images", imgFile, id);
        setImgUrl(imageURL);
      }
      if (resumeFile) {
        resumeURL = await uploadFile("resumes", resumeFile, id);
        setResumeUrl(resumeURL);
      }

      setUserData((prev) => ({
        ...prev,
        img: imageURL,
        resume: resumeURL,
      }));

      const dataRef = doc(db, "user", id);

      await updateDoc(dataRef, {
        img: imageURL,
        resume: resumeURL,
        name: userData.name,
        address: userData.address,
        contact: userData.contact,
        email: userData.email,
        DOB: userData.DOB,
        qualifications: userData.qualifications,
      });

      console.log("document updated");
      window.alert("Updated the data");
      setIsUploading(false);
      navigate(`/view`);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }

  const uploadFile = async (folderName, file) => {
    const storageRef = ref(storage, `${folderName}/${id}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  };

  return (
    <>
      <div className="createHome">
        <form onSubmit={(e) => handelUpdate(e)}>
          <div className="create-outbox">
            <div className="inputFields">
              <div className="inputdiv">
                <label htmlFor="Name" className="createlabel">Name: </label>
                <input
                  className="createInput"
                  name="name"
                  type="text"
                  id="Name"
                  value={userData.name}
                  onChange={handleChange}
                  autoComplete="no"
                />
              </div>

              <div>
                <label htmlFor="Address" className="createlabel">Address: </label>
                <input
                  className="createInput"
                  name="address"
                  type="text"
                  id="Address"
                  value={userData.address}
                  onChange={handleChange}
                  autoComplete="no"
                />
              </div>

              <div>
                <label htmlFor="Contact" className="createlabel">Contact: </label>
                <input
                  className="createInput"
                  name="contact"
                  type="text"
                  id="Contact"
                  value={userData.contact}
                  onChange={handleChange}
                  autoComplete="no"
                />
              </div>

              <div>
                <label htmlFor="EmailId" className="createlabel">Email ID: </label>
                <input
                  className="createInput"
                  name="email"
                  type="text"
                  id="EmailId"
                  value={userData.email}
                  onChange={handleChange}
                  autoComplete="no"
                />
              </div>

              <div>
                <label htmlFor="Dob" className="createlabel">DOB: </label>
                <input
                  className="createInput"
                  name="DOB"
                  type="date"
                  id="Dob"
                  value={userData.DOB}
                  onChange={handleChange}
                  autoComplete="no"
                />
              </div>



              <div>
                <div>
                  <label htmlFor="qual" className="createlabel">Qualifications</label>
                </div>
                <div className="divbutton">

                  <button onClick={addField} id="qual" className="createQualBtn">Add</button>
                </div>
              </div>

              <div>
                {userData.qualifications.map((data, index) => (
                  <div key={index}>
                    <div className="divbutton">

                      <button
                        className="createQualBtn"
                        onClick={(e) => removeField(index, e)}
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      className="createInput"
                      type="text"
                      name="qualification"
                      value={data.qualification}
                      onChange={(event) => handleChangeDynamic(index, event)}
                      autoComplete="no"
                    />

                  </div>
                ))}
              </div>
              <div className="imagefile">
                <label htmlFor="imageup" className="labelimg">

                  {imgFile ? (
                    <img src={URL.createObjectURL(imgFile)} alt="" className="createImgUpload" />
                  ) : imgURL ? (
                    <img src={imgURL} alt="" className="createImgUpload" />
                  ) : (
                    <img src="/user.png" alt="" className="createImgUpload" />
                  )}
                  <input
                    id="imageup"
                    name="img"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setimgFile(e.target.files[0])}
                  />
                  <div className="resumeUpload">

                    Update Your Image
                  </div>
                </label>
                {imgFile || imgURL ? (
                  <button onClick={handleImageRemove} className="resumeUpload">Remove Image</button>
                ) : null}
                <div className="resumeinput">
                  <div className="resumedit">
                    <label htmlFor="resume" className="resumeUpload">
                      {isResumeUpdated || resumeFile ? 'Updated' : 'Update Resume'}
                    </label>
                    <input
                      name="resume"
                      id="resume"
                      type="file"
                      accept=".pdf, .doc, .docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                    />
                    <div className="resumeUpload">
                      {getUser.map((user) => (
                        <a href={`${user.resume}`} className="prebtn" key={user.id}>
                          View Previous Resume
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="save-delete">

                <button type="submit" className="buttoncreate saveButton" disabled={isUploading}>
                  Update
                </button>
                <Link className="buttoncreate HomeButtonnn" to="/">Home</Link>
                <Link className="buttoncreate HomeButtonnn" to="/view">View</Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Edit;
