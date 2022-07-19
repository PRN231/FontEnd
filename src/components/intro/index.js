import "./style.css";

export default function Intro({ detailss, visitor, setOthername }) {
  const overallGpa = () => {
    let gpa = 0;
    let count = 0;
    for (let i = 0; i < detailss?.gpas.length; i++) {
      if (detailss?.gpas[i] !== null) {
        gpa += detailss?.gpas[i].grade;
        count++;
      }
    }
    return (gpa / count).toFixed(2);
  };
  return (
    <>
      {/* Info section */}
      <div className="profile_card">
        <div>
          Roll number: <span>{detailss.rollNumber}</span>
        </div>
        <br />
        <div>
          Full name:
          <span>{`${detailss.lastName} ${detailss.firstName}`}</span>
        </div>
        <br />
        <div>
          Phone number: <span>{detailss.mobile}</span>
        </div>
        <br />
        <div>
          Email: <span>{detailss.email}</span>
        </div>
        <br />
        <div>
          Address: <span>{detailss.address}</span>
        </div>
        <br />
        <div>
          Current semester: <span>{detailss.currentSemester}/9</span>
        </div>
        <br />
      </div>

      {/* GPAs section */}
      <div className="profile_card">
        {detailss.gpas.map((g) => {
          return (
            <>
              <div key={g.id}>
                Subject: <span>{g.subject}</span> GPA: <span>{g.grade}</span>
              </div>
              <br />
            </>
          );
        })}
        <div>
          Overall: <span>{overallGpa()}</span>
        </div>
      </div>
    </>
  );
}
