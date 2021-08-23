import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import "./MailConfirmation.css";
import ParticlesBg from "particles-bg";
import Typography from "@material-ui/core/Typography";

export default function MailConfirmation() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [severity, setSeverity] = React.useState("error");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleConfirmation = async () => {
    setSeverity("error");
    const body = { token: window.location.pathname.split("confirmation/")[1] };
    setIsLoading(true);
    const res = await axios.post("/actions/confirmation", body);
    setIsLoading(false);
    setMsg(res.data);
    if (res.data == "Confirmation completed!") {
      setSeverity("success");
    } else if (res.data == "you already confirmed your registration!") {
      setSeverity("warning");
    }
    setOpen(true);
  };

  return (
    <div>
      <ParticlesBg type="fountain" bg={true} />
      {isLoading ? (
        <div className="progress">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div className="mainDiv">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleConfirmation}
            >
              Confirm Your Registration!
            </Button>
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
            >
              <Alert onClose={handleCloseSnackbar} severity={severity}>
                {msg}
              </Alert>
            </Snackbar>
          </div>
        </div>
      )}
    </div>
  );
}
