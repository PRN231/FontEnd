import { useEffect, useReducer } from "react";
import { Card, List, Tag, Button } from "antd";
import { useSelector } from "react-redux";
import { Link, Router, useParams, useLocation } from "react-router-dom";
import Header from "../../components/header";
import { friendspage } from "../../functions/reducers";
import { getOffers, acceptOffer, rejectOffer } from "../../functions/user";
import { profileReducer } from "../../functions/reducers";
import {
  OFFER_STATUS_STRING,
  STATUS,
  COLOR_STATUS,
} from "../../data/constants";
import "./style.css";
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
    if (type === "requests") {
      dispatch({ type: "FRIENDS_REQUEST" });
      const data = await getOffers(user.token, user.id);
      if (data.status === "ok") {
        dispatch({ type: "FRIENDS_SUCCESS", payload: data.data });
      } else {
        dispatch({ type: "FRIENDS_ERROR", payload: data.data });
      }
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
            <Link
              to="/friends"
              className={`mmenu_item hover3 ${
                type === undefined && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="friends_home_icon "></i>
              </div>
              <span>Home</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
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
            </Link>
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
          </div>
        </div>
        <div className="friends_right">
          {(type === undefined || type === "requests") && (
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
          {(type === undefined || type === "sent") && (
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
                      <span>post</span>
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
          {(type === undefined || type === "all") && (
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
