import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { makeStyles } from "@mui/styles";

const useStyle = makeStyles({
  chat: {
    backgroundColor: "#F5FCFF",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  paper: {
    minHeight: 400,
    maxHeight: 400,
    overflow: "auto",
    shadow: "none",
    textAlign: "end",
  },
  send: {
    background: "red",
    borderRadius: "1em",
  },
  recieve: {
    background: "blue",
    borderRadius: "1em",
  },
});

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recieveMessage, setRecieveMessage] = useState([]);

  const classes = useStyle();
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        timeStamp: `${new Date().getHours() % 12 || 12}:${
          new Date().getMinutes() < 10
            ? "0" + new Date().getMinutes()
            : new Date().getMinutes()
        } ${new Date().getHours() >= 12 ? "PM" : "AM"}`,
      };
      setCurrentMessage("");
      await socket.emit("send_message", messageData);
      setMessages((list) => [...list, messageData]);
    }
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setRecieveMessage((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <>
      <Box className={classes.chat} width="100%" margin="10% auto">
        <Typography
          p={1}
          fontSize={{
            lg: 40,
            md: 30,
            sm: 25,
            xs: 28,
          }}
          sx={{ textAlign: "center", fontWeight: "bold" }}
          color="primary"
          variant="h3"
        >
          Messages
        </Typography>
        <Box>
          <Paper elevation={0} className={classes.paper}>
            {messages.map((message, index) => {
              return (
                <>
                  <Box
                    className={classes.send}
                    p={1}
                    width="fit-content"
                    mb={2}
                  >
                    <Typography
                      textAlign={"start"}
                      backgroundColor="primary"
                      variant="h6"
                    >
                      {message.message}
                    </Typography>
                    <Typography variant="subtitle">
                      {message.timeStamp}
                    </Typography>
                  </Box>
                </>
              );
            })}
            {recieveMessage.map((message, index) => {
              return (
                <>
                  <Box
                    className={classes.recieve}
                    p={1}
                    width="fit-content"
                    mb={2}
                  >
                    <Typography
                      textAlign={"start"}
                      backgroundColor="primary"
                      variant="h6"
                    >
                      {message.message}
                    </Typography>
                    <Typography variant="subtitle">
                      {message.timeStamp}
                    </Typography>
                  </Box>
                </>
              );
            })}
          </Paper>
        </Box>
        <Box>
          <TextField
            label="Type Something"
            fullWidth
            onChange={(e) => {
              setCurrentMessage(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={sendMessage} edge="end" color="primary">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </>
  );
}

export default Chat;
