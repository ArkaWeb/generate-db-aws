import { useState, useEffect } from "react";
import imageGif from "./e593ab0589d5f1b389e4dfbcce2bce20.gif";
import "./App.css";
import {
  Button,
  Container,
  Select,
  Paper,
  Chip,
  FormControl,
  Input,
  MenuItem,
  InputLabel,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiAlert from "@material-ui/lab/Alert";

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App() {
  const [form, setForm] = useState({
    class: "",
    batch: "",
    talent: [],
    inputTalent: "",
  });
  const [result, setResult] = useState({
    data: [],
    querySQL: {
      createUser: [],
      createDBUser: [],
      grantUser: [],
    },
  });
  const [showSnackbar, setShowSnackbar] = useState({
    msg: "",
    status: false,
    severity: "success",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (localStorage.getItem("form")) {
      const form = JSON.parse(localStorage.getItem("form"));
      setForm(form);
    }
    if (localStorage.getItem("result")) {
      const result = JSON.parse(localStorage.getItem("result"));
      setResult(result);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("form", JSON.stringify(form));
    localStorage.setItem("result", JSON.stringify(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSnackbar({ ...showSnackbar, status: false });
  };

  const handleChangeClass = (event) => {
    setForm({ ...form, class: event.target.value });
  };

  const handleChangeBatch = (event) => {
    setForm({ ...form, batch: event.target.value });
  };

  const handleChangeTalent = (event) => {
    setForm({ ...form, inputTalent: event.target.value });
  };

  const handleSetTalent = (event) => {
    if (event.key === "Enter") {
      if (event.target.value !== "") {
        setForm({
          ...form,
          talent: [...form.talent, event.target.value.toLowerCase()],
          inputTalent: "",
        });
      }
    }
  };

  const handleDelete = (data) => {
    const deleteTalent = form.talent.filter((e) => e !== data);
    setForm({
      ...form,
      talent: deleteTalent,
    });
    localStorage.clear();
  };

  const generateQuerySQL = () => {
    const dataUser = [];
    const createUser = [];
    const createDBUser = [];
    const grantUser = [];
    for (let item of form.talent) {
      const username = `${form.class}${form.batch}${item.replace(/\s/g, "")}`;
      const password = makeid(6);
      dataUser.push({
        name: item,
        username,
        password,
      });
      createUser.push(
        `CREATE USER '${username}'@'%' identified by '${password}';`
      );
      createDBUser.push(`CREATE DATABASE ${username}_dbname;`);
      grantUser.push(
        "GRANT ALL PRIVILEGES ON `" + username + "_%`.* TO '" + username + "';"
      );
    }
    setResult({
      data: dataUser,
      querySQL: {
        createUser,
        createDBUser,
        grantUser,
      },
    });
  };

  const handleReset = () => {
    setStatus("reset");
    if (result.data.length > 0) {
      setShowDialog(true);
    } else {
      resetData();
    }
  };

  const resetData = () => {
    localStorage.clear();
    setShowSnackbar({
      ...showSnackbar,
      status: true,
      msg: "Success Reset Data !",
      severity: "success",
    });
    setForm({
      class: "",
      batch: "",
      talent: [],
      inputTalent: "",
    });
    setResult({
      data: [],
      querySQL: {
        createUser: [],
        createDBUser: [],
        grantUser: [],
      },
    });
  };

  const saveData = () => {
    generateQuerySQL();
    setShowSnackbar({
      ...showSnackbar,
      status: true,
      msg: "Success Generate Data !",
      severity: "success",
    });
  };

  const handleGenerate = () => {
    setStatus("generate");
    if (form.class === "" || form.batch === "" || form.talent.length <= 0) {
      setShowSnackbar({
        ...showSnackbar,
        status: true,
        msg: "Complete Form !",
        severity: "error",
      });
    } else {
      if (result.data.length > 0) {
        setShowDialog(true);
      } else {
        saveData();
      }
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  return (
    <Container maxWidth="md">
      <div className="container-logo">
        <img src={imageGif} alt="logo" className="img-logo" />
        <Typography variant="h6" color="textSecondary">
          Generate DB AWS
        </Typography>
      </div>
      <Paper className="form" elevation={3}>
        <FormControl margin="dense" fullWidth required>
          <InputLabel>Class</InputLabel>
          <Select value={form.class} onChange={handleChangeClass}>
            <MenuItem value="fw">Fullstack Website</MenuItem>
            <MenuItem value="fm">Fullstack Mobile</MenuItem>
          </Select>
        </FormControl>
        <FormControl margin="dense" fullWidth required>
          <InputLabel>Batch</InputLabel>
          <Input
            onChange={handleChangeBatch}
            type="number"
            value={form.batch}
          />
        </FormControl>
        <FormControl margin="dense" fullWidth>
          <InputLabel>Add Talent [Enter]</InputLabel>
          <Input
            onKeyUp={handleSetTalent}
            onChange={handleChangeTalent}
            value={form.inputTalent}
          />
        </FormControl>
        <div className="container-chip" align="left">
          {form.talent.map((item, index) => (
            <Chip
              key={index}
              className="list-chip"
              color="primary"
              onDelete={() => handleDelete(item)}
              label={item}
              avatar={<Avatar>{item.split("")[0].toUpperCase()}</Avatar>}
            />
          ))}
        </div>
        <Button
          variant="contained"
          color="primary"
          className="button-submit"
          fullWidth
          onClick={handleGenerate}
        >
          GENERATE
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className="button-submit"
          fullWidth
          onClick={handleReset}
        >
          RESET
        </Button>
      </Paper>
      {result.data.length > 0 && (
        <div className="container-accordion">
          <Accordion elevation={3}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions1-content"
              id="additional-actions1-header"
            >
              <FormControlLabel
                aria-label="Acknowledge"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                control={<Checkbox />}
                label="Data Talent"
              />
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Password</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {item.username}
                        </TableCell>
                        <TableCell>{item.password}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions2-content"
              id="additional-actions2-header"
            >
              <FormControlLabel
                aria-label="Acknowledge"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                control={<Checkbox />}
                label="Query SQL"
              />
            </AccordionSummary>
            <AccordionDetails>
              <div>
                {result.querySQL.createUser.map((item, index) => (
                  <Typography color="textSecondary" key={index}>
                    {item}
                  </Typography>
                ))}
                {result.querySQL.createDBUser.map((item, index) => (
                  <Typography color="textSecondary" key={index}>
                    {item}
                  </Typography>
                ))}
                {result.querySQL.grantUser.map((item, index) => (
                  <Typography color="textSecondary" key={index}>
                    {item}
                  </Typography>
                ))}
                <Typography color="textSecondary">FLUSH PRIVILEGES;</Typography>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-label="Expand"
              aria-controls="additional-actions3-content"
              id="additional-actions3-header"
            >
              <FormControlLabel
                aria-label="Acknowledge"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                control={<Checkbox />}
                label="Message Talent"
              />
            </AccordionSummary>
            <AccordionDetails>
              <div className="container-message">
                {result.data.map((item, index) => (
                  <Paper className="message" elevation={3} key={index}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      key={index}
                    >
                      Hallo{" "}
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}{" "}
                      :wave:
                    </Typography>
                    <br />
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      Untuk username & password DB kamu ini ya :
                    </Typography>
                    <br />
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      `username : {item.username}`
                    </Typography>
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      `password : {item.password}`
                    </Typography>
                    <br />
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      Jika ingin membuat database penamaannya `{item.username}
                      _namadatabase`
                    </Typography>
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      Terimakasih :smiley_cat:
                    </Typography>
                  </Paper>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={showSnackbar.status}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={showSnackbar.severity}>
          {showSnackbar.msg}
        </Alert>
      </Snackbar>
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete Saved Data {status === "generate" && "& Generate New Data"} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={
              status === "generate"
                ? () => {
                    saveData();
                    setShowDialog(false);
                    setStatus("");
                  }
                : () => {
                    resetData();
                    setShowDialog(false);
                    setStatus("");
                  }
            }
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
