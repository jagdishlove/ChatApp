import io from "socket.io-client";
import React, { useState } from "react";
import Chat from "./Chat";
import { Box, Button, TextField, Typography, AppBar, Container, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Fade from "@mui/material/Fade";

const socket = io.connect("http://localhost:3001");

const useStyle = makeStyles({
  form: {
    display: "flex",
    flexDirection: "column",
    itemAlign: "center",
    justifyContent: "center",
    gap: "1em",
  },
});

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [error, setError] = useState(false);
  const classes = useStyle();

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };
  return (
    <>
      <Box >
        {!showChat ? (
          <Box className={classes.form} width="50%" margin="10% auto">
            <Typography
              fontSize={{
                lg: 40,
                md: 30,
                sm: 25,
                xs: 28,
              }}
              sx={{ fontWeight: "bold", margin: "auto" }}
              variant="h3"
            >
              Live Chat
            </Typography>
            <TextField
              label="Enter name"
              variant="outlined"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <TextField
              label="Enter Room ID.."
              variant="outlined"
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
            <Button variant="contained" onClick={joinRoom}>
              Join A Room
            </Button>
            {error && (
              <Fade in={error}>
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  Please fill the all field
                </Alert>
              </Fade>
            )}
          </Box>
        ) : (
          <Chat socket={socket} username={username} room={room} />
        )}

      </Box>
      <Box>
        <AppBar sx={{ position: 'sticky' }} color="primary">
          <Container maxWidth>
            <Toolbar>
              <Typography variant="body1" color="inherit">
                © 2022 Owner Jagdish
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
    </>
  );
}

export default App;
