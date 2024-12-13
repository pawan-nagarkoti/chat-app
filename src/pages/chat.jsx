import { useNavigate } from "react-router-dom";
import {
  getUserList,
  logout,
  createUserChat,
  allUserChatList,
  getAllMessages,
  sendMessage,
  deleteUserList,
  deleteSingleMessage,
  createGroupChat,
  getGroupChatDetail,
  updateGroupChatName,
  removeParticipant,
} from "@/api";
import { requestHandler, formatTime } from "@/utils";
import CustomModal from "@/components/CustomModal";
import React, { useState, useRef, useEffect } from "react";
import { Children } from "react";
import { Dropdown, MultiSelect, Input, CustomSlider } from "@/components";
import moment from "moment";

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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const multiSelectRef = useRef();
  const [handleToggleButton, setHandleToggleButton] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // this is used for toggle side drawer
  const [getGroupChatName, setGetGroupChatName] = useState("");
  const [hasGropupChat, setHasGroupChat] = useState("");
  const [selectedSingleChatListData, setSelectedSingleChatListData] = useState("");
  const [isEditGroupNameBtnClicked, setIsEditGroupNameBtnClicked] = useState(false);
  const [isAddParticipantClicked, setIsAddParticipantClicked] = useState(false);
  const [editGroupName, setEditGroupName] = useState(selectedSingleChatListData?.name || "");

  // this useeffect is used for when we edit group name and its set the default value on the input box
  useEffect(() => {
    setEditGroupName(selectedSingleChatListData?.name || "");
  }, [selectedSingleChatListData]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
    console.log(selected);
  };

  // const clearSelection = () => {
  //   if (multiSelectRef.current) {
  //     multiSelectRef.current.clearValue(); // Clear selected options
  //   }
  // };

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

    !handleToggleButton
      ? await requestHandler(
          () => createUserChat(selectedUserFromDropdown),
          null,
          (data) => {
            setIsOpen(false);
            allUserChatListData();
          },
          (error) => {
            console.error("One on One chat:", error);
            alert(error);
          }
        )
      : await requestHandler(
          () =>
            createGroupChat({
              name: getGroupChatName,
              participants: selectedOptions?.map((v) => v.value),
            }),
          null,
          (data) => {
            setIsOpen(false);
            allUserChatListData();
          },
          (error) => {
            console.error("Create Group Chat:", error);
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
        setAllMessage(data?.data.reverse());
      },
      (error) => {
        console.error("Login failed:", error);
        alert(error);
      }
    );
  };

  // get the id when we clicked on chat list
  const handleClickedChatList = (selectedId, v) => {
    console.log("sfslfjdslfjsldjflsdf", v);
    setSelectedSingleChatListData(v);
    setHasGroupChat(v?.isGroupChat); // is chat user group list?
    setSelectedUsername(handleSenderMessagerName(v));
    getChatId(selectedId);
    getAllMessageData(selectedId);
    setIsClickedOnChatList(true);
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", sendInputMessage);

    Array.from(selectedFiles).forEach((file) => {
      formData.append("attachments", file);
    });

    await requestHandler(
      () => sendMessage(chatId, formData),
      null,
      async (data) => {
        getSendInputMessage("");
        setSelectedFiles([]);
        await allUserChatListData();
        await getAllMessageData(chatId);
      },
      (error) => {
        console.error("Login failed:", error);
        alert(error);
      }
    );
  };

  // delete user list
  const deleteUser = async (deletedId) => {
    await requestHandler(
      () => deleteUserList(deletedId),
      setLoading,
      (data) => {
        allUserChatListData();
        alert("deleted user");
      },
      (error) => {
        console.error("Login failed:", error);
        alert(error);
      }
    );
  };
  // get deleted list
  const handleDeleteChat = (deletedId) => {
    deleteUser(deletedId);
  };

  // Selete image form local devices
  const handleFileSelected = (e) => {
    const files = Array.from(e.target.files);

    // Check if the selected files plus already selected files exceed the limit of 5
    if (selectedFiles.length + files.length <= 5) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    } else {
      alert("You can only select up to 5 images.");
    }
  };

  // this method is used for handle the participant means whose sended the message
  const handleSenderMessagerName = (item) => {
    return item.participants?.find((v) => v._id !== localStorage.getItem("loginUserId"));
  };

  // Delete one one chat message
  const handleDeleteSingleChatItem = async (deletedChatId, deletedMessageId) => {
    await requestHandler(
      () => deleteSingleMessage(deletedChatId, deletedMessageId),
      null,
      (data) => {
        getAllMessageData(chatId);
        confirm("Are you sure you want to delte this message");
      },
      (error) => {
        console.error("Delete one one chat :", error);
        alert(error);
      }
    );
  };

  const toggleSheet = (open) => {
    setIsSheetOpen(open);
  };

  // updated group name
  const handleUpdateGroupName = async () => {
    await requestHandler(
      () => updateGroupChatName(selectedSingleChatListData?._id, { name: editGroupName }),
      null,
      async (data) => {
        setIsEditGroupNameBtnClicked((prev) => !prev);
        await allUserChatListData();
        getAllMessages(chatId);
      },
      (error) => {
        console.error("Updated Group Name", error);
        alert(error);
      }
    );
  };

  // Remove participants from group
  const handleRemoveParticipants = async (v) => {
    await requestHandler(
      () => removeParticipant(chatId, v._id),
      null,
      async (data) => {
        confirm("Are you sure you want to delete");
      },
      (error) => {
        console.error("Updated Group Name", error);
        alert(error);
      }
    );
  };
  return (
    <>
      <CustomSlider isOpen={isSheetOpen} toggleSheet={toggleSheet}>
        <div className="p-4 space-y-4 bg-gray-100 rounded-lg shadow-md">
          {/* Group Info */}
          <div className="flex items-center justify-between">
            {isEditGroupNameBtnClicked ? (
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  name=""
                  id=""
                  value={editGroupName}
                  className="px-2 py-2 w-full mb-3"
                  onChange={(e) => setEditGroupName(e.target.value)}
                />
                {/* <div className="flex flex-col gap-2"> */}
                <button className="w-full px-4 py-2 mb-3 text-sm font-medium text-white bg-green-500 rounded-md" onClick={handleUpdateGroupName}>
                  save
                </button>
                <button
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md"
                  onClick={() => setIsEditGroupNameBtnClicked((pre) => !pre)}
                >
                  Cancel
                </button>
                {/* </div> */}
              </div>
            ) : (
              <>
                <span className="text-lg font-semibold text-gray-800">{selectedSingleChatListData?.name}</span>
                <button
                  className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                  onClick={() => setIsEditGroupNameBtnClicked((pre) => !pre)}
                >
                  edit
                </button>
              </>
            )}
          </div>

          <hr className="border-gray-300" />
          <p className="font-medium text-gray-800">{selectedSingleChatListData?.participants?.length} Participants</p>

          {/* Participant List */}
          <div className="space-y-4">
            {selectedSingleChatListData?.participants?.map((v, i) => (
              <div className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="block text-gray-800 font-medium text-sm">{v.username}</span>
                    {v?._id === selectedSingleChatListData?.admin && (
                      <p className="inline-block px-2 py-1 mt-1 text-xs font-semibold text-white bg-green-500 rounded-md">Admin</p>
                    )}
                  </div>
                  <span className="block text-sm text-gray-600">{v.email}</span>
                </div>
                <button
                  className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded-md hover:bg-red-100"
                  onClick={() => handleRemoveParticipants(v)}
                >
                  Remove
                </button>
              </div>
            ))}

            <hr className="border-gray-300" />
          </div>

          {/* Actions */}
          {isAddParticipantClicked ? (
            <>
              <Dropdown ref={dropdownRef} label="Add Participant" options={userList} onChange={handleDropdownChange} />
              <button className="w-full px-4 py-2 mt-1 text-sm font-medium text-white bg-green-500 rounded-md">save</button>
              <button
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md "
                onClick={() => setIsAddParticipantClicked((pre) => !pre)}
              >
                cancel
              </button>
            </>
          ) : (
            <button
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={() => setIsAddParticipantClicked((pre) => !pre)}
            >
              Add Participant
            </button>
          )}

          <button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
            Delete Group
          </button>
        </div>
      </CustomSlider>
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
                      <input
                        type="checkbox"
                        id="group-chat"
                        name="subscribe"
                        value="newsletter"
                        onChange={() => setHandleToggleButton((pre) => !pre)}
                      />{" "}
                      &nbsp;
                      <label htmlFor="group-chat">Is it a group chat? </label>
                    </div>

                    {handleToggleButton ? (
                      <>
                        <div>
                          <div className="mb-4">
                            <Input
                              label="Group Name"
                              type="text"
                              placeholder="Enter group name"
                              onChange={(e) => setGetGroupChatName(e.target.value)}
                            />
                          </div>
                          <div className="mb-4">
                            <div className="text-sm mb-2">Group Participant</div>
                            <MultiSelect ref={multiSelectRef} options={userList} onChange={handleChange} placeholder="Select group participants" />
                            {/* <button onClick={clearSelection}>Clear Selection</button> */}
                            <p className="text-sm mt-3">Selected: {selectedOptions.map((opt) => opt.label).join(", ")}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-3">
                          <Dropdown ref={dropdownRef} label="select user to chat" options={userList} onChange={handleDropdownChange} />
                        </div>
                      </>
                    )}

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
                        className={`px-2 py-1 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ${
                          handleToggleButton
                            ? selectedOptions.length > 0 && getGroupChatName !== ""
                              ? ""
                              : "opacity-50 cursor-not-allowed"
                            : selectedUserFromDropdown
                            ? ""
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={handleCreateUserChatList}
                        disabled={handleToggleButton ? !(selectedOptions.length > 0 && getGroupChatName) : !selectedUserFromDropdown}
                      >
                        Create
                      </button>

                      {/* {handleToggleButton ? (
                        <>
                          <button
                            type="submit"
                            className={`px-2 py-1 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300
                          ${selectedOptions.length > 0 && getGroupChatName !== "" ? "" : "opacity-50 cursor-not-allowed"}
                        `}
                            onClick={handleCreateUserChatList}
                            disabled={!selectedOptions.length > 0 && getGroupChatName !== ""}
                          >
                            create something
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="submit"
                            className={`px-2 py-1 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300
                          ${selectedUserFromDropdown ? "" : "opacity-50 cursor-not-allowed"}
                        `}
                            onClick={handleCreateUserChatList}
                            disabled={!selectedUserFromDropdown}
                          >
                            create
                          </button>
                        </>
                      )} */}
                    </div>
                  </form>
                </CustomModal>
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-[90vh] scroll-smooth">
              {allUserChatListDetailData?.data?.map((v, i) => (
                <div
                  key={i} // Ensures uniqueness
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleClickedChatList(v._id, v)} // Handles click for the chat list
                >
                  {/* User Avatar */}
                  <div className="flex items-center gap-3">
                    <img
                      src={handleSenderMessagerName(v)?.avatar?.url ? handleSenderMessagerName(v)?.avatar.url : `https://dummyjson.com/image/150`}
                      alt={`${handleSenderMessagerName(v)?.username}'s avatar`}
                      className="border border-gray-300 w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{v?.isGroupChat ? v?.name : handleSenderMessagerName(v)?.username}</h3>
                      </div>
                      <p className="text-xs text-gray-500 truncate max-w-[12rem] mt-1">{v?.lastMessage?.content || "No recent messages"}</p>
                    </div>
                  </div>

                  {/* Message Details */}
                  <div className="flex items-center gap-3">
                    {/* Time */}
                    {/* {formatTime(v?.lastMessage?.updatedAt) !== "0 s ago" && (
                      <span className="text-[.8rem] text-gray-600 whitespace-nowrap">{formatTime(v?.lastMessage?.updatedAt)}</span>
                    )} */}

                    <span className="text-[.8rem] text-gray-600 whitespace-nowrap">
                      {moment(v?.lastMessage?.updatedAt).add("TIME_ZONE", "hours").fromNow(true)} {/* Delete Icon */}
                    </span>

                    {v?.isGroupChat ? (
                      <>
                        <span onClick={() => setIsSheetOpen(true)}>||</span>
                      </>
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents triggering the parent click
                          handleDeleteChat(v._id);
                        }}
                        className="text-gray-600 hover:text-red-500 text-[.8rem] cursor-pointer"
                        title="Delete chat"
                      >
                        &#128465;
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Chat Section */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            {isClickedOnChatList && (
              <>
                <div className="p-4 bg-white shadow-md">
                  <h2 className="text-lg font-bold text-gray-700">
                    {selectedSingleChatListData?.isGroupChat ? selectedSingleChatListData?.name : selectedUsername?.username.toUpperCase()}
                  </h2>
                  <p>
                    {selectedSingleChatListData?.isGroupChat
                      ? `${selectedSingleChatListData?.participants?.length} members in the chat`
                      : selectedUsername?.email}
                  </p>
                </div>
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {allMessage?.map((v, i) => (
                    <div key={i}>
                      {/* Incoming Message */}
                      <div className="mb-4">
                        <h1>{v.sender._id === localStorage.getItem("loginUserId")}</h1>
                        {/* isOwnMessage={msg.sender?._id === user?._id} */}

                        <div
                          className={`max-w-sm p-3 bg-blue-100 text-gray-800 rounded-md
                        ${v.sender._id !== localStorage.getItem("loginUserId") ? "ml-auto" : "bg-blue-400 text-white"}`}
                        >
                          {v?.attachments?.length > 0 ? (
                            <div className={`grid grid-cols-2 gap-3`}>
                              {v?.attachments?.map((v, i) => (
                                <img src={v.url} alt="img" key={i} className="w-[100%] h-[7rem] mb-3" />
                              ))}
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="flex justify-between">
                            <div>{v.content}</div>

                            {v.sender._id === localStorage.getItem("loginUserId") ? (
                              <div className="cursor-pointer" onClick={() => handleDeleteSingleChatItem(v.chat, v._id)}>
                                &#128465;
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
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

                {/* selected images */}
                <div className="flex gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i != index))}
                        className="absolute top-0 right-0 bg-gray-600 text-white rounded-full p-1"
                        style={{ transform: "translate(10%, -10%)" }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t">
                  <form className="flex items-center space-x-2" onSubmit={handleSendMessage}>
                    <div className="relative w-12 h-12 flex items-center justify-center text-4xl cursor-pointer">
                      <span role="button" aria-label="Upload File">
                        &#43;
                      </span>
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        max={5}
                        multiple
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileSelected}
                      />
                    </div>
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
