import { useEffect, useState } from "react";
import Bio from "./Bio";
import "./style.css";
import axios from "axios";
import { useSelector } from "react-redux";
import EditDetails from "./EditDetails";
import { mockDetail } from "../../data/mockStudent";

export default function Intro({ detailss, visitor, setOthername }) {
  const { user } = useSelector((state) => ({ ...state }));
  const [details, setDetails] = useState();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setDetails(detailss);
    setInfos(detailss);
  }, [detailss]);
  const initial = {
    bio: details?.bio ? details.bio : "",
    otherName: details?.otherName ? details.otherName : "",
    job: details?.job ? details.job : "",
    workplace: details?.workplace ? details.workplace : "",
    highSchool: details?.highSchool ? details.highSchool : "",
    college: details?.college ? details.college : "",
    currentCity: details?.currentCity ? details.currentCity : "",
    hometown: details?.hometown ? details.hometown : "",
    relationship: details?.relationship ? details.relationship : "",
    instagram: details?.instagram ? details.instagram : "",
  };
  const [infos, setInfos] = useState(initial);
  const [showBio, setShowBio] = useState(false);
  const [max, setMax] = useState(infos?.bio ? 100 - infos?.bio.length : 100);

  const updateDetails = async () => {
    try {
      console.log("sent");
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/updateDetails`,
        {
          infos,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setShowBio(false);
      setDetails(data);
      setOthername(data.otherName);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfos({ ...infos, [name]: value });
    setMax(100 - e.target.value.length);
  };
  return (
    <div className="profile_card">
      <div>
        Roll number: <span>{mockDetail.rollNumber}</span>
      </div>
      <br />
      <div>
        Full name:
        <span>{`${mockDetail.lastName} ${mockDetail.firstName}`}</span>
      </div>
      <br />
      <div>
        Phone number: <span>{mockDetail.mobile}</span>
      </div>
      <br />
      <div>
        Email: <span>{mockDetail.email}</span>
      </div>
      <br />
      <div>
        Address: <span>{mockDetail.address}</span>
      </div>
      <br/>
      <div>
        Current semester: <span>{mockDetail.currentSemester}/9</span>
      </div>
      <br/>
      <div>
        GPA: <span>{mockDetail.gpas.find(g => g.id === mockDetail.gradeId).grade}</span>
      </div>
    </div>
  );
}
