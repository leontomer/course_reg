import React, { useState } from "react";
import axios from "axios";
import picture1 from "../../photos/p1.PNG";
import picture2 from "../../photos/pic2.PNG";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ReCAPTCHA from "react-google-recaptcha";
import "./HomePage.css";
import CitySearchInput from "../PlacesSearch/CitySearchInput";
import AddressSearchInput from "../PlacesSearch/AddressSearchInput";
import CircularProgress from "@material-ui/core/CircularProgress";

function HomePage() {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [acode, setAcode] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [checked1, setChecked1] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = React.useState("");
  const [readTerms, setReadTerms] = React.useState(false);
  const [readSyllabus, setReadSyllabus] = React.useState(false);
  const [readConditions, setReadConditions] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [severity, setSeverity] = React.useState("error");
  const [captchaOpen, setCaptchaOpen] = React.useState(false);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClickedSyllabus = () => {
    setOpenModal(true);
    setReadSyllabus(true);
  };

  const handleClickedTerms = () => {
    setOpenModal(true);
    setReadTerms(true);
  };

  const handleClickedConditions = () => {
    setOpenModal(true);
    setReadConditions(true);
  };

  const initState = () => {
    setChecked1(false);
    setChecked2(false);
    setReadConditions(false);
    setReadSyllabus(false);
    setReadTerms(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setAcode("");
    setPhoneNumber("");
    global.city = "";
    global.address = "";
  };

  const sendDataToServer = async () => {
    setCaptchaOpen(false);

    let fullNumber = acode + phoneNumber;

    const body = {
      firstName: firstName,
      lastName: lastName,
      fullNumber: fullNumber,
      email: email,
      city: global.city,
      address: global.address,
    };
    setIsLoading(true);
    const res = await axios.post("/actions/saveDetails", body);
    setIsLoading(false);

    initState();

    if (res.data == "ok") {
      setSeverity("success");
      setMsg("נשלח בהצלחה");
      setOpen(true);
    } else if (res.data == "user already registered") {
      setSeverity("error");
      setMsg("!כבר נרשמת");
      setOpen(true);
    } else {
      setSeverity("error");
      setMsg("קרתה שגיאה כלשהי. נסה שוב מאוחר יותר");
      setOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleCloseModal = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenModal(false);
    setCaptchaOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName.length < 2 || firstName.length > 16) {
      setMsg("השם הפרטי חייב להיות בין 2 ל16 תווים");
      setSeverity("error");
      setOpen(true);
      return;
    }

    if (/[^a-zA-Zא-ת` \"\-"]/.test(firstName)) {
      setMsg("השם הפרטי שהזנת מכיל תווים לא חוקיים");
      setSeverity("error");
      setOpen(true);
      return;
    }
    if (lastName.length < 2 || lastName.length > 16) {
      setMsg("השם משפחה חייב להיות בין 2 ל16 תווים");
      setSeverity("error");

      setOpen(true);
      return;
    }

    if (/[^a-zA-Zא-ת` \"\-"]/.test(lastName)) {
      setMsg("השם משפחה שהזנת מכיל תווים לא חוקיים");
      setSeverity("error");
      setOpen(true);
      return;
    }

    if (
      acode != "050" &&
      acode != "052" &&
      acode != "054" &&
      acode != "053" &&
      (acode != "055") & (acode != "058")
    ) {
      setMsg("הקידומת שהזנת אינה נתמכת");
      setSeverity("error");
      setOpen(true);
      return;
    }

    if (phoneNumber.length != 7 || /[^0-9"]/.test(phoneNumber)) {
      setMsg("מספר הטלפון שהזנת אינו חוקי. המספר חייב להיות בן 7 ספרות");
      setSeverity("error");
      setOpen(true);
      return;
    }

    if (email.length == 0) {
      setMsg("האימייל שהזנת לא חוקי");
      setSeverity("error");
      setOpen(true);
      return;
    }

    if (global.address === "") {
      setMsg("לא מילאת את שדה הכתובת");
      setSeverity("error");
      setOpen(true);
      return;
    }

    if (global.city === "") {
      setMsg("לא מילאת את השדה עיר");
      setSeverity("error");
      setOpen(true);
      return;
    }

    if (!checked1) {
      setMsg("חובה לאשר את תנאי השימוש");
      setSeverity("error");
      setOpen(true);
      return;
    }

    if (!checked2) {
      setMsg("חובה לאשר את הסילבוס");
      setSeverity("error");
      setOpen(true);
      return;
    }
    setCaptchaOpen(true);
  };

  return (
    <div className="firstDiv">
      <Modal
        onClose={handleCloseModal}
        className="captchaModal"
        open={captchaOpen}
      >
        <ReCAPTCHA
          sitekey="6Ld4fRccAAAAAJYUARp0W-mlnwYXA7opebrbuK8C"
          onChange={sendDataToServer}
        />
      </Modal>

      {isLoading ? (
        <div className="progress">
          <CircularProgress />
        </div>
      ) : (
        <div className="mainDivStyle">
          <img width="100%" src={picture1}></img>
          <div className="videoDivStyle">
            <iframe
              width="500"
              height="200"
              src={`https://www.youtube.com/embed/E7wJTI-1dvQ`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
          <div className="formDivStyle">
            <div className="textDivStyle">
              <h1 className="textColor">הרשמו לקורס שלנו</h1>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="formContainer">
                <div className="textFields">
                  <div className="textFieldDiv">
                    <TextField
                      className="textFieldStyle"
                      label="שם משפחה"
                      size="small"
                      type="text"
                      variant="outlined"
                      onChange={(lname) => setLastName(lname.target.value)}
                    />
                  </div>

                  <div className="textFieldDiv">
                    <TextField
                      className="textFieldStyle"
                      label="דואר אלקטרוני"
                      type="email"
                      size="small"
                      variant="outlined"
                      onChange={(em) =>
                        setEmail(em.target.value.toLocaleLowerCase())
                      }
                    />
                  </div>
                  <div className="textFieldDiv">
                    <CitySearchInput />{" "}
                  </div>
                </div>

                <div className="textFields2">
                  <div className="textField2Div">
                    <TextField
                      className="textFieldStyle"
                      label="שם פרטי"
                      type="text"
                      size="small"
                      variant="outlined"
                      onChange={(fname) => setFirstName(fname.target.value)}
                    />
                  </div>

                  <div className="phoneDiv">
                    <TextField
                      className="acTextField"
                      label="קידומת"
                      type="tel"
                      size="small"
                      variant="outlined"
                      onChange={(acod) => setAcode(acod.target.value)}
                    />
                    <div className="phone">
                      <TextField
                        className="textFieldStyle"
                        label="טלפון"
                        type="tel"
                        size="small"
                        variant="outlined"
                        onChange={(tel) => setPhoneNumber(tel.target.value)}
                      />
                    </div>
                  </div>
                  <div className="textField2Div">
                    <AddressSearchInput />{" "}
                  </div>
                </div>
              </div>
              <div className="firstCheckBox">
                <Typography variant="subtitle1" gutterBottom>
                  אני מאשר את&nbsp;
                  <span className="span" onClick={handleClickedTerms}>
                    התקנון
                  </span>
                  &nbsp;ו
                  <span className="span" onClick={handleClickedConditions}>
                    תנאי ההרשמה
                  </span>
                  &nbsp; של הקורס
                  <input
                    type="checkbox"
                    id="box1"
                    name="box1"
                    onChange={() => setChecked1(!checked1)}
                    disabled={!readConditions || !readTerms}
                  />
                </Typography>
              </div>
              <div className="secondCheckBox">
                <Typography variant="subtitle1" gutterBottom>
                  ראיתי את ה
                  <span className="span" onClick={handleClickedSyllabus}>
                    סילבוס
                  </span>
                  &nbsp;של הקורס
                  <input
                    type="checkbox"
                    id="box2"
                    name="box2"
                    onChange={() => setChecked2(!checked2)}
                    disabled={!readSyllabus}
                  />
                  <Modal
                    className="pdfModal"
                    onClose={handleCloseModal}
                    open={openModal}
                  >
                    <iframe
                      width="70%"
                      height="80%"
                      src={
                        "https://mayafiles.tase.co.il/RPdf/428001-429000/P428236-00.pdf"
                      }
                    />
                  </Modal>
                </Typography>
              </div>
              <div>
                <Button
                  style={{
                    backgroundColor: "#21b6ae",
                    color: "#FFFFFF",
                    marginLeft: "29%",
                  }}
                  variant="contained"
                  type="submit"
                >
                  שליחה
                </Button>
              </div>
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
              >
                <Alert onClose={handleCloseSnackbar} severity={severity}>
                  {msg}
                </Alert>
              </Snackbar>
            </form>
          </div>
          <img width="100%" src={picture2}></img>
          <iframe
            width="99%"
            height="350"
            loading="lazy"
            allowfullscreen
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB7VuIN-JQB0vRCbp0TRki857dv8jN4Dtk&q=Space+Needle,Seattle+WA"
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default HomePage;
