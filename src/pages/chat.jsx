import { useNavigate } from "react-router-dom";
import { getUserList, logout, createUserChat, allUserChatList, getAllMessages, sendMessage } from "@/api";
import { requestHandler } from "@/utils";
import CustomModal from "@/components/CustomModal";
import React, { useState, useRef, useEffect } from "react";
import { Children } from "react";
import { Dropdown } from "@/components";

export default function ChatPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [userList, setUsersList] = useState([]);
  const [selectedUserFromDropdown, setSelectedUserFromDropdown] = useState("");
  const [allUserChatListDetailData, setAllUserChatListDetailData] = useState("");
  const [allMessage, setAllMessage] = useState([]);
  const [chatId, getChatId] = useState("");
  const [sendInputMessage, getSendInputMessage] = useState("");
  const [isClickedOnChatList, setIsClickedOnChatList] = useState(false);

  // Logout functionality
  const handleLogout = async () => {
    await requestHandler(
      () => logout(),
      setLoading,
      (data) => {
        localStorage.clear();
        navigate("/login");
        alert("Logout successful!");
      },
      (error) => {
        console.error("Login failed:", error);
        alert(error);
      }
    );
  };

  // get users list
  const getUserListData = async () => {
    await requestHandler(
      () => getUserList("chat-app/chats/users"),
      setChatLoading,
      (data) => {
        const options = data?.data?.map((v, i) => ({
          value: v._id, // Set the value property
          label: v.username, // Set the label property
        }));
        setUsersList(options);
      },
      (error) => {
        console.error("Login failed:", error);
        alert(error);
      }
    );
  };

  // Get all list one-one and group list
  const allUserChatListData = async () => {
    await requestHandler(
      () => allUserChatList(),
      null,
      (data) => {
        setAllUserChatListDetailData(data);
      },
      (error) => {
        console.error("chat list", error);
        alert(error);
      }
    );
  };

  useEffect(() => {
    getUserListData();
    allUserChatListData();
  }, []);

  const handleDropdownChange = (event) => {
    setSelectedUserFromDropdown(event.target.value);
  };

  // create userchat list
  const handleCreateUserChatList = async (e) => {
    e.preventDefault();
    await requestHandler(
      () => createUserChat(selectedUserFromDropdown),
      null,
      (data) => {},
      (error) => {
        console.error("Login failed:", error);
        alert(error);
      }
    );
  };

  // Get all message
  const getAllMessageData = async (selectedId) => {
    await requestHandler(
      () => getAllMessages(selectedId),
      null,
      (data) => {
        setAllMessage(data?.data);
      },
      (error) => {
        console.error("Login failed:", error);
        alert(error);
      }
    );
  };

  // get the id when we clicked on chat list
  const handleClickedChatList = (selectedId) => {
    getChatId(selectedId);
    getAllMessageData(selectedId);
    setIsClickedOnChatList(true);
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const data = {
      attachments: "",
      content: sendInputMessage,
    };
    sendMessage(chatId, data);
    getSendInputMessage("");
  };

  return (
    <>
      <div className="bg-gray-200">
        <div className="flex h-screen bg-gray-200 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-1/4 bg-white shadow-lg">
            <div className="p-4 border-b space-y-2">
              {/* First Row: Title and Logout */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-700">Chats</h2>
                <button
                  className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>

              {/* Second Row: Search and Create Chat */}
              <div className="flex items-center space-x-2">
                {/* Search Box */}
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="flex-1 px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring focus:ring-blue-300"
                />
                {/* Create Chat Button */}
                <button
                  className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  onClick={() => setIsOpen(true)}
                >
                  Create Chat
                </button>

                {/* This modal is use for create group chat and add partipent on the group and create one to one chat */}
                <CustomModal isOpen={isOpen} setIsOpen={setIsOpen}>
                  <form action="">
                    <div className="mb-3">
                      <input type="checkbox" id="group-chat" name="subscribe" value="newsletter" /> &nbsp;
                      <label htmlFor="group-chat">Is it a group chat? </label>
                    </div>

                    <div className="mb-3">
                      <Dropdown ref={dropdownRef} label="select user to chat" options={userList} onChange={handleDropdownChange} />
                    </div>

                    <div className="flex gap-4 justify-center mt-5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setIsOpen(false);
                        }}
                        className="px-2 py-1 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        close
                      </button>
                      <button
                        type="submit"
                        className="px-2 py-1 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        onClick={handleCreateUserChatList}
                      >
                        create
                      </button>
                    </div>
                  </form>
                </CustomModal>
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-[90vh] scroll-smooth">
              {allUserChatListDetailData?.data?.map((v, i) => (
                <div className="cursor-pointer p-3 bg-gray-50 rounded-md hover:bg-gray-200" onClick={() => handleClickedChatList(v._id)} key={i}>
                  <h3 className="text-sm font-medium text-gray-800">{v.participants[1].username}</h3>
                  <p className="text-xs text-gray-500 truncate">Another message preview...</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Chat Section */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 bg-white shadow-md">
              <h2 className="text-lg font-bold text-gray-700">Chat with John Doe</h2>
            </div>

            {isClickedOnChatList && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {allMessage?.map((v, i) => (
                    <div key={i}>
                      {/* Incoming Message */}
                      <div className="mb-4">
                        <div className="max-w-sm p-3 bg-blue-100 text-gray-800 rounded-md">{v.content}</div>
                        {/* <span className="text-xs text-gray-500">10:00 AM</span> */}
                      </div>
                      {/* Outgoing Message */}
                      {/* <div className="mb-4 text-right">
                    <div className="inline-block max-w-sm p-3 bg-blue-500 text-white rounded-md">I'm good, thanks! What about you?</div>
                    <span className="text-xs text-gray-500">10:02 AM</span>
                  </div> */}
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t">
                  <form className="flex items-center space-x-2" onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={sendInputMessage}
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      onChange={(e) => getSendInputMessage(e.target.value)}
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Send
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
