import { useState } from "react";

export default function Chat() {
  const [chat, setChat] = useState(true);
  return (
    <div
      className=""
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        className="messages overflow-y-scroll"
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflowY: "auto"
        }}
      >
        <h3 className="mb-4 mt-7">Messages</h3>
        <div
          className="message"
          style={{
            backgroundColor: "grey",
            padding: "20px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
          />
          <span style={{ fontWeight: "bold" }}>John Doe</span>
          <span>Lorem ipsum dolor,...</span>
        </div>
        <div
          className="message"
          style={{
            backgroundColor: "grey",
            padding: "20px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
          />
          <span style={{ fontWeight: "bold" }}>John Doe</span>
          <span>Lorem ipsum dolor,...</span>
        </div>
        <div
          className="message"
          style={{
            backgroundColor: "grey",
            padding: "20px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
          />
          <span style={{ fontWeight: "bold" }}>John Doe</span>
          <span>Lorem ipsum dolor,...</span>
        </div>
        <div
          className="message"
          style={{
            backgroundColor: "grey",
            padding: "20px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
          />
          <span style={{ fontWeight: "bold" }}>John Doe</span>
          <span>Lorem ipsum dolor,...</span>
        </div>
        <div
          className="message"
          style={{
            backgroundColor: "grey",
            padding: "20px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
          />
          <span style={{ fontWeight: "bold" }}>John Doe</span>
          <span>Lorem ipsum dolor,...</span>
        </div>
        <div
          className="message"
          style={{
            backgroundColor: "grey",
            padding: "20px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
          />
          <span style={{ fontWeight: "bold" }}>John Doe</span>
          <span>Lorem ipsum dolor,...</span>
        </div>
      </div>
      {chat && (
        <div
          className="chatBox"
          style={{
            flex: "0.5",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            
          }}
        >
          <div
            className="top"
            style={{
              backgroundColor: "gray",
              padding: "20px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              
            }}
          >
            <div
              className="user"
              style={{ display: "flex", alignItems: "center", gap: "20px" }}
            >
              <img
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt=""
              />{" "}
              John Doe
            </div>
            <span
              className="close"
              onClick={() => setChat(false)}
              style={{ cursor: "pointer" }}
            >
              X
            </span>
          </div>
          <div
            className="center"
            style={{
              height: "350px",
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div className="chatMessage own" style={{width:"50%"}}>
              <p>Lorem ipsum dolor.</p>
              <span style={{ fontSize: "12px",
          backgroundColor: "#f7c14b39",
          padding: "2px",
          borderRadius: "5px"}}>1 hr ago</span>
            </div>
            <div className="chatMessage" style={{width:"50%", alignSelf:"flex-end", textAlign:"right"}}>
              <p>Lorem ipsum dolor.</p>
              <span style={{ fontSize: "12px",
          backgroundColor: "#f7c14b39",
          padding: "2px",
          borderRadius: "5px"}}>1 hr ago</span>
            </div>
          </div>
          <div
            className="bottom"
            style={{
              borderTop: "2px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <textarea
              style={{ flex: "3", height: "100%", borderColor: "black",border: "1px solid #ccc" ,resize: "none",
            }}
            ></textarea>
            <button
              style={{
                flex: "1",
                backgroundColor: "gray",
                border: "none",
                height: "100%",
                cursor: "pointer",

              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
