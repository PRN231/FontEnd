import { useEffect, useRef, useState } from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { POST_STATUS_STRING, STATUS, COLOR_STATUS } from "../../data/constants";
import { Dots, Public } from "../../svg";
import PostMenu from "./PostMenu";
import { apply, getReacts, reactPost } from "../../functions/post";
import "./style.css";
import { Tag } from "antd";
import { ClimbingBoxLoader } from "react-spinners";
export default function Post({
  post,
  user,
  profile,
  isHideButtons,
  status,
  offers,
}) {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reacts, setReacts] = useState();
  const [check, setCheck] = useState();
  const [status2, setStatus2] = useState(status)
  const [applied, setApplied] = useState(status!=null);
  const [total, setTotal] = useState(0);
  const [checkSaved, setCheckSaved] = useState();
  const [comments, setComments] = useState([]);
  useEffect(() => {
    getPostReacts();
    console.log("use effect");
  }, []);

  const getPostReacts = async () => {
    // const res = await getReacts(post._id, user.token);
    // setReacts(res.reacts);
    // setCheck(res.check);
    // setTotal(res.total);
    // setCheckSaved(res.checkSaved);
  };
  const applyHandle = async () => {
    var res = await apply(post.item1.id, user.token);
    console.log(res);
    if (res!=null) 
    {
      setApplied(true);
      setStatus2(res.status);
    }
  };
  const reactHandler = async (type) => {
    // reactPost(post._id, type, user.token);
    if (check == type) {
      setCheck();
      let index = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = --reacts[index].count)]);
        setTotal((prev) => --prev);
      }
    } else {
      setCheck(type);
      let index = reacts.findIndex((x) => x.react == type);
      let index1 = reacts.findIndex((x) => x.react == check);
      if (index !== -1) {
        setReacts([...reacts, (reacts[index].count = ++reacts[index].count)]);
        setTotal((prev) => ++prev);
        console.log(reacts);
      }
      if (index1 !== -1) {
        setReacts([...reacts, (reacts[index1].count = --reacts[index1].count)]);
        setTotal((prev) => --prev);
        console.log(reacts);
      }
    }
  };

  const postRef = useRef(null);

  const displayStatus = () => {
    
    return status2==null?null:<Tag color={COLOR_STATUS[status2]}>{POST_STATUS_STRING[status2]}</Tag>
  };
  return (
    <div
      className="post"
      style={{ width: `${profile && "100%"}` }}
      ref={postRef}
    >
      <div className="post_header">
        <Link to={`#`} className="post_header_left">
          <img src="../../../images/userlogo.png" alt="" />
          <div className="header_col">
            <div className="post_profile_name">
              {post?.item1?.representative?.corporate?.companyName ??
                post?.representative?.corporate?.companyName}
              <div className="updated_p">
                is hiring{" "}
                {post?.item1?.applicationQuantity ?? post?.applicationQuantity}{" "}
                {post?.item1?.position ?? post?.position}
              </div>
              {status2 !== undefined  && <div>{displayStatus()}</div>}
              {offers && offers.length > 0 && (
                <Tag color={"green"}>Offer provided</Tag>
              )}
            </div>
            <div className="post_profile_privacy_date">
              <Moment fromNow interval={30}>
                {post?.item1?.createdAt ?? post?.createdAt}
              </Moment>
              . &nbsp;
              <Public color="#828387" />
            </div>
          </div>
        </Link>
        <div
          className="post_header_right hover1"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <Dots color="#828387" />
        </div>
      </div>
      {post.background ? (
        <div
          className="post_bg"
          style={{ backgroundImage: `url(${post.background})` }}
        >
          <div className="post_bg_text">{post.item1.description}</div>
        </div>
      ) : post.type === null ? (
        <>
          <div className="post_text">{post.item1.description}</div>
          {post.images && post.images.length && (
            <div
              className={
                post.images.length === 1
                  ? "grid_1"
                  : post.images.length === 2
                  ? "grid_2"
                  : post.images.length === 3
                  ? "grid_3"
                  : post.images.length === 4
                  ? "grid_4"
                  : post.images.length >= 5 && "grid_5"
              }
            >
              {post.images.slice(0, 5).map((image, i) => (
                <img src={image.url} key={i} alt="" className={`img-${i}`} />
              ))}
              {post.images.length > 5 && (
                <div className="more-pics-shadow">
                  +{post.images.length - 5}
                </div>
              )}
            </div>
          )}
        </>
      ) : post.type === "profilePicture" ? (
        <div className="post_profile_wrap">
          <div className="post_updated_bg">
            {/* <img src={post.user.cover} alt="" /> */}
          </div>
          <img
            // src={post.images[0].url}
            alt=""
            className="post_updated_picture"
          />
        </div>
      ) : (
        <div className="post_text_wrap">
          {/* <img src={post.images[0].url} alt="" /> */}
          {post?.item1?.description ?? post?.description}
        </div>
      )}

      <div className="post_infos">
        <div className="reacts_count">
          <div className="reacts_count_imgs">
            {reacts &&
              reacts
                .sort((a, b) => {
                  return b.count - a.count;
                })
                .slice(0, 3)
                .map(
                  (react, i) =>
                    react.count > 0 && (
                      <img
                        src={`../../../reacts/${react.react}.svg`}
                        alt=""
                        key={i}
                      />
                    )
                )}
          </div>
          <div className="reacts_count_num">{total > 0 && total}</div>
        </div>
        <div className="to_right">
          <div className="share_count">
            Only {post?.item1?.applicationQuantity ?? post?.applicationQuantity}{" "}
            applications{" "}
          </div>
        </div>
      </div>
      {!isHideButtons && !applied &&user?.role==1 && (
        <div className="post_actions">
          <div className="post_action hover1" onClick={applyHandle}>
            <span>Apply</span>
          </div>
        </div>
      )}
      {showMenu && (
        <PostMenu
          userId={user.id}
          // postUserId={post.user._id}
          imagesLength={post?.images?.length}
          setShowMenu={setShowMenu}
          // postId={post._id}
          token={user.token}
          checkSaved={checkSaved}
          setCheckSaved={setCheckSaved}
          // images={post.images}
          postRef={postRef}
        />
      )}
    </div>
  );
}
