import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/sendVerification";
import Stories from "../../components/home/stories";
import Post from "../../components/post";
import "./style.css";
export default function Home({ setVisible, posts, loading, getAllPosts }) {
  const { user } = useSelector((state) => ({ ...state }));
  const middle = useRef(null);
  const [height, setHeight] = useState();
  useEffect(() => {
    console.log("useeffect home");
    console.log("posts ",posts);
    setHeight(middle.current.clientHeight);

  }, [loading, height]);
  useEffect(()=>{},[]);
  return (
    <div className="home" style={{ height: `${height + 150}px` }}>
      <Header page="home" getAllPosts={getAllPosts} />
      <div className="home_middle" ref={middle}>
        {user.verified === false && <SendVerification user={user} />}
        {user.role==3?<CreatePost user={user} setVisible={setVisible} />:null}
        {loading ? (
          <div className="sekelton_loader">
            <HashLoader color="#1876f2" />
          </div>
        ) : (
          <div className="posts">
            {posts.map((post, i) => (
              <Post key={i} post={post} status={post.item2?.status} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
