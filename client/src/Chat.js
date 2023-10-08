import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        isJoined: '0',
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };


//   useEffect(() => {
//     socket.on("receive_message", (data) => {

//             setMessageList((list) => [...list, data]);
//     });

//      socket.on("user_joined", (data) => {
//     const joinMessage = `${data.user} joined room ${data.room}`;
//     setMessageList((list) => [...list, { message: joinMessage }]);
//   });

//     return () => socket.removeListener("receive_message")

    
//   }, [socket]);

useEffect(() => {
    const handleMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    
  
    const handleUserJoin = (data) => {
        console.log("User joined room:", data);
        const joinMessage = `${data.user} Joined room ${data.room}`;
        setMessageList((list) => [...list, { message: joinMessage, isJoined: '1' }]);
      };

     
  
    socket.on("receive_message", handleMessage);
    socket.on("user_joined", handleUserJoin);  
    // Cleanup
    return () => {
      socket.removeListener("receive_message", handleMessage);
      socket.removeListener("user_joined", handleUserJoin);
    };
  }, [socket, setMessageList]);
  

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>PerpAll Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={messageContent.isJoined === '1' ? "joined" : username === messageContent.author ? "other" : "you"}
              >


                <div>
                  <div className={messageContent.isJoined === '1'  ? "joinmessage-content": "message-content"}>
                    <p >{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="type a message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;