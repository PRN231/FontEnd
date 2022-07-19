import axios from "axios";
import { useEffect, useReducer, useRef, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { HashLoader } from "react-spinners";
import Header from "../../components/header";
import Intro from "../../components/intro";
import Post from "../../components/post";
import { profileReducer } from "../../functions/reducers";
import GridPosts from "./GridPosts";
import "./style.css";
export default function Profile({ getAllPosts }) {
  const { user } = useSelector((state) => ({ ...state }));

  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: true,
    profile: {},
    error: "",
  });

  const getProfile = async () => {
    try {
      dispatch({
        type: "PROFILE_REQUEST",
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/Student/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const { data: gpasData } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/Gpa/student/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      let studentData = data.item1;
      studentData.applications = data.item2;
      studentData.gpas = gpasData;
      studentData.offers = studentData.applications.filter(
        (app) => app.offers[0]
      );

      if (studentData) {
        dispatch({
          type: "PROFILE_SUCCESS",
          payload: studentData,
        });
      }
    } catch (error) {
      dispatch({
        type: "PROFILE_ERROR",
        payload: error.response.data.message,
      });
    }
  };
  const profileTop = useRef(null);
  const leftSide = useRef(null);
  const [height, setHeight] = useState();
  const [leftHeight, setLeftHeight] = useState();
  const [scrollHeight, setScrollHeight] = useState();
  useEffect(() => {
    setHeight(profileTop.current.clientHeight + 300);
    setLeftHeight(leftSide.current.clientHeight);
    window.addEventListener("scroll", getScroll, { passive: true });
    return () => {
      window.addEventListener("scroll", getScroll, { passive: true });
    };
  }, [loading, scrollHeight]);
  const check = useMediaQuery({
    query: "(min-width:901px)",
  });
  const getScroll = () => {
    setScrollHeight(window.pageYOffset);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="profile">
      <Header page="profile" getAllPosts={getAllPosts} />
      <div className="profile_top" ref={profileTop}></div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            {/* <PplYouMayKnow /> */}
            <div
              className={`profile_grid scrollFixed showMore
              `}
            >
              <div className="profile_left" ref={leftSide}>
                {loading ? (
                  <>
                    <div className="profile_card">
                      <div className="profile_card_header">Intro</div>
                      <div className="sekelton_loader">
                        <HashLoader color="#1876f2" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Intro detailss={profile} />
                  </>
                )}
              </div>
              <div className="profile_right">
                {/* {!visitor && (
                  <CreatePost user={user} profile setVisible={setVisible} />
                )} */}
                <GridPosts />
                {loading ? (
                  <div className="sekelton_loader">
                    <HashLoader color="#1876f2" />
                  </div>
                ) : (
                  <div className="posts">
                    {profile.applications && profile.applications.length ? (
                      profile.applications.map((app) => (
                        <Post
                          post={app.post}
                          user={user}
                          key={app.post._id}
                          profile
                          isHideButtons={true}
                          status={app.status}
                          offers={app.offers}
                        />
                      ))
                    ) : (
                      <div className="no_posts">No posts available</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
