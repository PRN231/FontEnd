import { useEffect, useReducer } from "react";
import { Card, List, Tag, Button } from "antd";
import { useSelector } from "react-redux";
import { Link, Router, useParams, useLocation } from "react-router-dom";
import Header from "../../components/header";
import { friendspage } from "../../functions/reducers";
import { getOffers, acceptOffer, rejectOffer, getApplications, acceptApplication, rejectApplication } from "../../functions/user";
import { profileReducer } from "../../functions/reducers";
import {
  OFFER_STATUS_STRING,
  STATUS,
  COLOR_STATUS,
} from "../../data/constants";
import "./style.css";
import { number } from "yup";
export default function Friends() {
  const { user } = useSelector((state) => ({ ...state }));
  const { type } = useParams();

  const [{ profile }] = useReducer(profileReducer, {
    profile: {},
  });

  const [{ loading, error, data }, dispatch] = useReducer(friendspage, {
    loading: false,
    data: {},
    error: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    console.log("get data")
    console.log("user",user)
      dispatch({ type: "FRIENDS_REQUEST" });
      let data = {data:[]};
      if (user.role==1) data = await getOffers(user.token, user.id);
      if (user.role==3) data= await getApplications(user.id);
      console.log(data)
      if (data.status === "ok") {
        dispatch({ type: "FRIENDS_SUCCESS", payload: data.data });
      } else {
        dispatch({ type: "FRIENDS_ERROR", payload: data.data });
      }
  };

  const _onAcceptOffer = async (id) => {
    await acceptOffer(id, user.token);
    await getData();
  };

  const _onRejectOffer = async (id) => {
    await rejectOffer(id, user.token);
    await getData();
  };

  const _onAcceptApplication = async (id,title="",description="",allowance=0) => {
    console.log(title,description,allowance)
    if (title?.length==0||description?.length==0||allowance<=0) {console.log("error"); alert("You must enter valid info");return;}
    await acceptApplication(id, user.token,title,description,allowance);
    await getData();
  };

  const _onRejectApplication = async (id) => {
    await rejectApplication(id, user.token);
    await getData();
  };

  console.log("friendsPAge", user);

  return (
    <>
      <Header page="friends" />
      <div className="friends">
        <div className="friends_left">
          <div className="friends_left_header">
            <h3>Friends</h3>
            <div className="small_circle">
              <i className="settings_filled_icon"></i>
            </div>
          </div>
          <div className="friends_left_wrap">
            {user.role!=1?null:
            <Link
              to="/friends/requests"
              className={`mmenu_item hover3 ${
                type === "requests" && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="friends_requests_icon"></i>
              </div>
              <span>View Offers</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>}
            {user.role!=3?null:
            <Link
              to="/friends/sent"
              className={`mmenu_item hover3 ${
                type === "sent" && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="friends_requests_icon"></i>
              </div>
              <span>View Applicants</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            }
            {
              user.role!=2?null:
            <Link
              to="/friends/all"
              className={`mmenu_item hover3 ${
                type === "all" && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="all_friends_icon"></i>
              </div>
              <span>View Company Representative Account</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
          }
          </div>
        </div>
        <div className="friends_right">
          {(type === undefined || type === "requests") &&user.role==1 && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>View Offers</h3>
                {type === undefined && (
                  <Link to="/friends/requests" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {type === "requests" && data && data && data.length > 0 && (
                  <List
                    grid={{
                      gutter: 16,
                    }}
                    dataSource={data}
                    renderItem={(item) => (
                      <List.Item>
                        <Card title={item.title}>
                          <p>Description: {item.description}</p>
                          <p>Allowance: {item.allowance} VND/month</p>
                          <p>Start date: {item.startDate}</p>
                          <p>End date: {item.endDate}</p>
                          <p>Expired date: {item.expiredDate}</p>
                          <p>
                            Status:{" "}
                            <Tag color={COLOR_STATUS[item.status]}>
                              {OFFER_STATUS_STRING[item.status]}
                            </Tag>
                          </p>
                          {item.status === STATUS.PENDING && (
                            <>
                              <Button
                                type="primary"
                                onClick={() => _onAcceptOffer(item.id)}
                              >
                                Accept
                              </Button>
                              <Button
                                type="secondary"
                                onClick={() => _onRejectOffer(item.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </Card>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </div>
          )}
          {(type === undefined || type === "sent") && user.role==3 && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>View Applicants</h3>
                {type === undefined && (
                  <Link to="/friends/sent" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {type === "sent" && data && data && data.length > 0 && (
                  <List
                  grid={{
                    gutter: 16,
                  }}
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item>
                      <Card title={item.title}>
                        <h3>Application info:</h3>
                        <p>Post title: {item?.post?.title}</p>
                        <p>Job Position: {item?.post?.position}</p>
                        <p>Student name: {item?.student?.firstName} {item?.student?.lastName}</p>
                        <p>Student email: {item?.student?.email}</p>
                        <p>Student phone: {item?.student?.phone}</p>
                        <p>Student Address: {item?.student?.address}</p>
                        {item?.status!=0?null:
                        <><h3>Give offer:</h3>
                        <p>Title:</p>
                        <input
                            maxLength="250"
                            style={{width:'250px'}}
                            placeholder={`Input title here...`}
                            className={`post_input input2`}
                            onChange={(e) => {item.title=e.target.value}}
                          />
                          <p>Description:</p>
                          <input
                            maxLength="250"
                            style={{width:'250px'}}

                            placeholder={`Input description here...`}
                            className={`post_input input2`}
                            onChange={(e) => {item.description=e.target.value}}
                          />
                            <p>Allowance:</p>
                          <input
                          step={0.01}
                          type={number}
                          style={{width:'250px'}}

                            placeholder={`Input allowance here...`}
                            className={`post_input input2`}
                            onChange={(e) => {item.allowance=e.target.value}}
                          />
                          <p>{item.error}</p>
                          </>
                  }
                        <p>
                          Status:{" "}
                          <Tag color={COLOR_STATUS[item?.status]}>
                            {OFFER_STATUS_STRING[item?.status]}
                          </Tag>
                        </p>
                        {item.status === STATUS.PENDING && (
                          <>
                            <Button
                              type="primary"
                              onClick={() => {_onAcceptApplication(item.id,item.title,item.description,item.allowance)}}
                            >
                              Accept
                            </Button>
                            <Button
                              type="secondary"
                              onClick={() => _onRejectApplication(item.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </Card>
                    </List.Item>
                  )}
                />
                )}
              </div>
            </div>
          )}
          {(type === undefined || type === "all") && user.role==2 && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>View Company Representative Account</h3>
                {type === undefined && (
                  <Link to="/friends/all" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
