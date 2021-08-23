import React, { useEffect, useState } from "react";
import axios from "axios";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import ParticlesBg from "particles-bg";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./getRegistrations.css";

export default function GetRegistrations() {
  const [registrations, setRegistrations] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [severity, setSeverity] = React.useState("error");
  const [msg, setMsg] = React.useState("error");

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handlePagination = (e, page) => {
    setSelectedPage(page);
  };

  const pageCount = 3;
  useEffect(() => {
    (async function loadData() {
      setIsLoading(true);

      const res = await axios.get("/actions/registrations");
      setRegistrations(res.data);
      setIsLoading(false);
    })();
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleClicked = async (email) => {
    setIsLoading(true);
    const res = await axios.post("/actions/resendEmail", { email });
    setIsLoading(false);

    if (res.data == "ok") {
      setSeverity("success");
      setMsg("נשלח בהצלחה");
      setOpen(true);
    }
  };

  return (
    <div>
      <ParticlesBg type="circle" bg={true} />
      {isLoading ? (
        <div className="progress">
          <CircularProgress />
        </div>
      ) : (
        <div>
          {!isLoading && (
            <div className="newDivS">
              {registrations.length > 0 && (
                <Pagination
                  className="pagS"
                  count={Math.ceil(registrations.length / 3)}
                  color="primary"
                  onChange={handlePagination}
                  page={selectedPage}
                />
              )}

              <Typography
                className="typoText"
                variant="h3"
                className="inline"
                color="textPrimary"
              >
                Course Registrations
              </Typography>
            </div>
          )}{" "}
          <div className="root">
            <List>
              {registrations
                .slice(
                  pageCount * selectedPage - pageCount,
                  pageCount * selectedPage
                )
                .map((registration) => (
                  <ListItem alignItems="flex-start">
                    {" "}
                    <ListItemText
                      secondary={
                        <React.Fragment>
                          <div className="divButTyp">
                            <div>
                              <div>
                                <Typography
                                  variant="body2"
                                  className="inline"
                                  color="textPrimary"
                                >
                                  name:{" "}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  className="inline"
                                  color="textPrimary"
                                >
                                  {registration.firstName}{" "}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="inline"
                                  color="textPrimary"
                                >
                                  {registration.lastName}{" "}
                                </Typography>
                              </div>
                              <div>
                                <Typography
                                  variant="body2"
                                  className="inline"
                                  color="textPrimary"
                                >
                                  email: {registration.email}
                                </Typography>
                              </div>
                              <div>
                                <Typography
                                  variant="body2"
                                  className="inline"
                                  color="textPrimary"
                                >
                                  phone: {registration.phoneNumber}
                                </Typography>{" "}
                              </div>

                              <div>
                                <Typography
                                  variant="body2"
                                  className="inline"
                                  color="textPrimary"
                                >
                                  address: {registration.address}
                                </Typography>{" "}
                              </div>
                              <div>
                                <Typography
                                  variant="body2"
                                  className="inline"
                                  color="textPrimary"
                                >
                                  approved email:{" "}
                                  {registration.approved ? "yes" : "no"}
                                </Typography>{" "}
                              </div>
                            </div>
                            <div className="button">
                              <Button
                                onClick={() =>
                                  handleClicked(registration.email)
                                }
                                variant="contained"
                                color="primary"
                              >
                                Resend Email
                              </Button>
                            </div>
                          </div>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </div>
        </div>
      )}

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
  );
}
