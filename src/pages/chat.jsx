import React from "react";

export default function ChatPage() {
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
                <button className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
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
                <button className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
                  Create Chat
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-[90vh] scroll-smooth">
              {/* Example Chat List */}
              {Array.from({ length: 40 }).map((i, index) => (
                <>
                  <div className="cursor-pointer p-3 bg-gray-50 rounded-md hover:bg-gray-200">
                    <h3 className="text-sm font-medium text-gray-800">John Doe</h3>
                    <p className="text-xs text-gray-500 truncate">Last message preview...</p>
                  </div>
                  <div className="cursor-pointer p-3 bg-gray-50 rounded-md hover:bg-gray-200">
                    <h3 className="text-sm font-medium text-gray-800">Jane Smith</h3>
                    <p className="text-xs text-gray-500 truncate">Another message preview...</p>
                  </div>
                </>
              ))}
            </div>
          </div>

          {/* Right Chat Section */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 bg-white shadow-md">
              <h2 className="text-lg font-bold text-gray-700">Chat with John Doe</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {Array.from({ length: 30 }).map((v, i) => (
                <>
                  {/* Incoming Message */}
                  <div className="mb-4">
                    <div className="max-w-sm p-3 bg-blue-100 text-gray-800 rounded-md">Hello! How are you?</div>
                    <span className="text-xs text-gray-500">10:00 AM</span>
                  </div>
                  {/* Outgoing Message */}
                  <div className="mb-4 text-right">
                    <div className="inline-block max-w-sm p-3 bg-blue-500 text-white rounded-md">I'm good, thanks! What about you?</div>
                    <span className="text-xs text-gray-500">10:02 AM</span>
                  </div>
                </>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              <form className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
