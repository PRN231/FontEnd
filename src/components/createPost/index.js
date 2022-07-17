import { Feeling, LiveVideo, Photo } from "../../svg";
import UserMenu from "../header/userMenu";
import "./style.css";
export default function CreatePost({ user, setVisible, profile }) {
  return (
    <div className="createPost">
      <div className="createPost_header">
        <img src="../../../images/userlogo.png" alt="" />
        <div
          className="open_post hover2"
          onClick={() => {
            setVisible(true);
          }}
        >
          New post...
        </div>
      </div>
    </div>
  );
}
