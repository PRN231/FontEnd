import { useEffect, useRef, useState } from "react";
import "./style.css";
import Picker from "emoji-picker-react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import AddToYourPost from "./AddToYourPost";
import ImagePreview from "./ImagePreview";
import useClickOutside from "../../helpers/clickOutside";
import { createPost } from "../../functions/post";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch } from "react-redux";
import PostError from "./PostError";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import { uploadImages } from "../../functions/uploadImages";
export default function CreatePostPopup({
  user,
  setVisible,
  posts,
  dispatch,
  profile,
}) {
  const popup = useRef(null);
  const [title,setTitle] = useState("");
  const [position,setPosition] = useState("");
  const [applicationQuantity,setApplicationQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");
  useClickOutside(popup, () => {
    setVisible(false);
  });
  const postSubmit = async () => {
      if (applicationQuantity<=0) {
        setError("Number must be positive");
        return}
      if (title.length==0||description.length==0||position.length==0)
      {
        setError("You must enter all fields");
        return
      }
      setLoading(true);
      const response = await createPost(
        title,
        position,
        applicationQuantity,
        description,
        user.token
      );
      setLoading(false);
      if (response.status === "ok") {
        dispatch({
          type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
          payload: [response.data, ...posts],
        });
        setBackground("");
        setDescription("");
        setVisible(false);
      } else {
        setError(response);
      }
  };
  return (
    <div className="blur">
      <div className="postBox" ref={popup}>
        {error && <PostError error={error} setError={setError} />}
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setVisible(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
             <h3> {user.username} </h3>
        </div>
        <div>
        <div style={{paddingLeft:'15px', fontWeight:'600'}}>
        <p>Title:</p>
          </div>
        <input
          maxLength="250"
          value={title}
          placeholder={`Input title here...`}
          className={`post_input input2`}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div style={{paddingLeft:'15px', fontWeight:'600'}}>
        <p>Position:</p>
          </div>
        <input
          maxLength="250"
          value={position}
          placeholder={`Input position here...`}
          className={`post_input input2`}
          onChange={(e) => setPosition(e.target.value)}
        />
        <div style={{paddingLeft:'15px', fontWeight:'600'}}>
        <p>Offer Number:</p>
          </div>
         <input
          type="number"
          value={applicationQuantity}
          placeholder={`Number of offer`}
          className={`post_input input2`}
          onChange={(e) => setApplicationQuantity(e.target.value)}
        />
        <div style={{paddingLeft:'15px', fontWeight:'600'}}>
        <p>Description:</p>
          </div>
        <textarea
          maxLength="250"
          value={description}
          placeholder={`Input description here...`}
          className={`post_input input2`}
          onChange={(e) => setDescription(e.target.value)}
    
        ></textarea>
      </div>
        <button
          className="post_submit"
          onClick={() => {
            postSubmit();
          }}
          disabled={loading}
        >
          {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
        </button>
      </div>
    </div>
  );
}
