// === 聊天室資料庫模擬 ===
const chatData = {
  "friend-1": {
    id: "friend-1",
    type: "friend",
    name: "Elena Vance",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCY1Smp1pbjfwvnDiYD4Cos8MqZxsFU-NN9p4UtpZ_NEgoR4kf3nkxCi4fwk5-iFoK73GBtyI7fhCwtiVSKSRNDEKnpzKmXUXrpXPU4JOmGhrVZHxnUuPNiAIUICH9SRJqHW8U-Fbrkzs36mebfoRK_SRT6WIlvBnpFxYUNfmNie1Pl5kPJknR39cQ7eV2CsPRoA8alEe8mG-sctv2VfL_aALx6_3Vhs0Ct5VD_0BMTNCouK8O4AwgSIOYB5BzfmNDOkluco5uI-pSr",
    status: "Online",
    preview: "好的，那我們明天下午見！",
    time: "12:45",
    messages: [
      { sender: "them", text: "最近工作進展得怎麼樣？", time: "12:30" },
      {
        sender: "me",
        text: "還不錯！剛完成了一個關於玻璃擬態的設計項目。",
        time: "12:35",
      },
      {
        sender: "me",
        text: "你那邊呢？有空出來喝杯咖啡嗎？",
        time: "12:35",
      },
      {
        sender: "them",
        text: "聽起來很棒！明天下午三點有空，我們老地方見？",
        time: "12:44",
      },
      { sender: "me", text: "好的，那我們明天下午見！", time: "12:45" },
    ],
  },
  "friend-2": {
    id: "friend-2",
    type: "friend",
    name: "Gordon Freeman",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsnthPBbjhpzOXNxrCL82CoUP88YqMXj3UWFtY4ZsN7kOu0CthY9euQbucI1KWfNdZlQV4lbqNk6cplZ6D_cFU_WqPAlws5QI39LMvvK5OBtd0sKMZeHp8IQW7XCXiMuP9kUsXb7dQyMpz_XBIOxcMu-gGa9-_UV993w04WLaQaXzVprER5TQIkWbuas7x41pA1Ud9ogXB1PhGgli6VBUrjGnoVFUr1mHFS1oJOIolgO_xydBH4-p_Nj7YOl3sruZ3KbmuerQgWvSn",
    status: "離線",
    preview: "實驗結果已經上傳到雲端了。",
    time: "昨天",
    messages: [
      {
        sender: "them",
        text: "實驗結果已經上傳到雲端了。",
        time: "昨天",
      },
    ],
  },
  "friend-3": {
    id: "friend-3",
    type: "friend",
    name: "Barney Calhoun",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRBDEWCHacn4rSYkNi2piIFkBw7eVOb3LPPCsao_qCRCTItx8o7ZtaJh9IGaP4wgnhOVj28lZMGolHH6G33r6GxCfRZ-iFoLrqSUmfmtmDNUb3L_qqdSLwFh7RpNzJgWarDQrntLeIykA2aZ4vfPP6og3HEwWsLmPKub7WmAbDQCCpW4lQIOclwmM_voF1r4gQIdR2yA3GAEjLhciAslY-B-ZpLAkSc5KSUiUqs2Ov73E3PK8kHgq2zSpYENQprvD6rdtvC-ZpQUq0",
    status: "離線",
    preview: "嘿，還欠你一瓶啤酒呢！",
    time: "星期一",
    messages: [
      { sender: "them", text: "嘿，還欠你一瓶啤酒呢！", time: "星期一" },
    ],
  },
  "group-1": {
    id: "group-1",
    type: "group",
    name: "遊戲同好會",
    avatarBg: "bg-blue-500/60",
    initial: "GT",
    status: "3 人在線",
    preview: "Gordon: 今晚打遊戲嗎？",
    time: "10:20",
    messages: [
      {
        sender: "them",
        text: "今晚打遊戲嗎？",
        time: "10:20",
        senderName: "Gordon",
      },
      {
        sender: "them",
        text: "我可以加一！",
        time: "10:21",
        senderName: "Barney",
      },
    ],
  },
  "group-2": {
    id: "group-2",
    type: "group",
    name: "設計團隊",
    avatarBg: "bg-purple-500/60",
    initial: "DT",
    status: "1 人在線",
    preview: "Alyx: 玻璃擬態檔案已更新。",
    time: "星期一",
    messages: [
      {
        sender: "them",
        text: "玻璃擬態檔案已更新。",
        time: "星期一",
        senderName: "Alyx",
      },
    ],
  },
  "global-chat": {
    id: "global-chat",
    type: "group",
    name: "世界頻道 (Global Chat)",
    avatarBg: "bg-teal-500/60",
    initial: "GC",
    status: "Online",
    preview: "歡迎來到世界頻道！",
    time: "",
    messages: [],
  },
};

let activeChatId = null;

const socket = io("https://ours-chat.onrender.com/");
// 從 URL 取得使用者名稱
const urlParams = new URLSearchParams(window.location.search);
const urlUsername = urlParams.get("username");
let username = urlUsername
  ? urlUsername.trim()
  : "用戶" + Math.floor(Math.random() * 1000);

socket.on("connect", () => {
  document.getElementById("server-status-dot").className =
    "w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]";
  document.getElementById("server-status-dot").nextElementSibling.innerText =
    "伺服器已連線";
  socket.emit("user_join", { username: username });
});

socket.on("disconnect", () => {
  document.getElementById("server-status-dot").className =
    "w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";
  document.getElementById("server-status-dot").nextElementSibling.innerText =
    "伺服器已斷線";
});

socket.on("update_user_list", (data) => {
  const users = data.users;

  // 先把所有朋友標記為離線
  Object.values(chatData).forEach((chat) => {
    if (chat.type === "friend") chat.status = "離線";
  });

  // 更新在線使用者
  users.forEach((u) => {
    const friendName = u.name;
    if (friendName === username) return;

    if (!chatData[friendName]) {
      chatData[friendName] = {
        id: friendName,
        type: "friend",
        name: friendName,
        avatar:
          "https://ui-avatars.com/api/?name=" +
          encodeURIComponent(friendName) +
          "&background=random",
        status: "Online",
        preview: "開始聊天吧！",
        time: "",
        messages: [],
      };
    } else {
      chatData[friendName].status = "Online";
      chatData[friendName].name = friendName;
      chatData[friendName].avatar =
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(friendName) +
        "&background=random";
    }
  });

  initLists();
  if (activeChatId && chatData[activeChatId]) {
    openChat(activeChatId);
  }
});

socket.on("receive_message", (data) => {
  const now = new Date();
  const timeString =
    now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");

  chatData["global-chat"].messages.push({
    sender: data.username === username ? "me" : "them",
    senderName: data.username !== username ? data.username : undefined,
    text: data.msg,
    time: timeString,
  });

  chatData["global-chat"].preview = data.msg;
  chatData["global-chat"].time = timeString;

  if (activeChatId === "global-chat") {
    renderMessages();
  }
  initLists();
});

socket.on("system_message", (data) => {
  const now = new Date();
  const timeString =
    now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");

  chatData["global-chat"].messages.push({
    sender: "system",
    text: data.msg,
    time: timeString,
  });

  chatData["global-chat"].preview = data.msg;
  chatData["global-chat"].time = timeString;

  if (activeChatId === "global-chat") {
    renderMessages();
  }
  initLists();
});

socket.on("private_message", (data) => {
  const sender = data.sender;
  const target = data.target;
  const msg = data.msg;

  const now = new Date();
  const timeString =
    now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");

  let chatId = sender === username ? target : sender;

  if (!chatData[chatId]) {
    chatData[chatId] = {
      id: chatId,
      type: "friend",
      name: chatId,
      avatar:
        "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(chatId) +
        "&background=random",
      status: "Online",
      preview: "",
      time: "",
      messages: [],
    };
  }

  chatData[chatId].messages.push({
    sender: sender === username ? "me" : "them",
    text: msg,
    time: timeString,
    read: false,
  });

  chatData[chatId].preview = msg;
  chatData[chatId].time = timeString;

  if (activeChatId === chatId) {
    if (sender !== username) {
      socket.emit("read_messages", { target: chatId });
    }
    renderMessages();
  }
  initLists();
});

socket.on("messages_read", (data) => {
  const reader = data.reader;
  if (chatData[reader]) {
    chatData[reader].messages.forEach((msg) => {
      if (msg.sender === "me") {
        msg.read = true;
      }
    });
    if (activeChatId === reader) {
      renderMessages();
    }
  }
});

// 1. 初始化列表
function initLists() {
  const friendContainer = document.getElementById("friend-list-container");
  const groupContainer = document.getElementById("group-list-container");
  friendContainer.innerHTML = "";
  groupContainer.innerHTML = "";

  Object.values(chatData).forEach((chat) => {
    let html = "";
    const isActive =
      chat.id === activeChatId ? "bg-white/25" : "hover:bg-white/10";

    if (chat.type === "friend") {
      html = `
        <div onclick="openChat('${chat.id}')" class="contact-item flex items-center gap-3 p-3 ${isActive} rounded-2xl transition-colors cursor-pointer" data-id="${chat.id}">
          <div class="relative">
            <img class="w-12 h-12 rounded-full object-cover border border-white/30" src="${chat.avatar}" />
            ${chat.status === "Online" ? '<div class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-800 rounded-full"></div>' : ""}
          </div>
          <div class="flex-grow overflow-hidden">
            <div class="flex justify-between items-baseline">
              <span class="font-headline text-headline text-white truncate">${chat.name}</span>
              <span class="text-[10px] text-white/60">${chat.time}</span>
            </div>
            <p class="text-footnote text-white/80 truncate">${chat.messages[chat.messages.length - 1]?.text || chat.preview}</p>
          </div>
        </div>`;
      friendContainer.innerHTML += html;
    } else if (chat.type === "group") {
      html = `
        <div onclick="openChat('${chat.id}')" class="contact-item flex items-center gap-3 p-3 ${isActive} rounded-2xl transition-colors cursor-pointer" data-id="${chat.id}">
          <div class="w-12 h-12 rounded-full ${chat.avatarBg} border border-white/30 flex items-center justify-center text-white font-bold">${chat.initial}</div>
          <div class="flex-grow overflow-hidden">
            <div class="flex justify-between items-baseline">
              <span class="font-headline text-headline text-white truncate">${chat.name}</span>
              <span class="text-[10px] text-white/60">${chat.time}</span>
            </div>
            <p class="text-footnote text-white/80 truncate">${chat.messages[chat.messages.length - 1]?.senderName ? chat.messages[chat.messages.length - 1].senderName + ": " : ""}${chat.messages[chat.messages.length - 1]?.text || chat.preview}</p>
          </div>
        </div>`;
      groupContainer.innerHTML += html;
    }
  });
}

// 2. 打開/切換個別聊天室
function openChat(chatId) {
  activeChatId = chatId;
  const chat = chatData[chatId];

  document.getElementById("empty-chat-view").classList.add("hidden");
  document.getElementById("empty-chat-view").classList.remove("flex");
  document.getElementById("active-chat-view").classList.remove("hidden");
  document.getElementById("active-chat-view").classList.add("flex");

  document.querySelectorAll(".contact-item").forEach((el) => {
    if (el.dataset.id === chatId) {
      el.classList.add("bg-white/25");
      el.classList.remove("hover:bg-white/10");
    } else {
      el.classList.remove("bg-white/25");
      el.classList.add("hover:bg-white/10");
    }
  });

  document.getElementById("chat-header-name").innerText = chat.name;

  const avatarContainer = document.getElementById(
    "chat-header-avatar-container",
  );
  if (chat.type === "friend") {
    avatarContainer.innerHTML = `
      <img class="w-10 h-10 rounded-full object-cover border border-white/30" src="${chat.avatar}" />
      ${chat.status === "Online" ? '<div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border border-white/30 rounded-full"></div>' : ""}
    `;
  } else {
    avatarContainer.innerHTML = `
      <div class="w-10 h-10 rounded-full ${chat.avatarBg} border border-white/30 flex items-center justify-center text-white font-bold">${chat.initial}</div>
    `;
  }

  const statusEl = document.getElementById("chat-header-status");
  if (chat.status === "Online") {
    statusEl.innerHTML =
      '<span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online';
    statusEl.className = "text-caption text-green-400 flex items-center gap-1";
  } else {
    statusEl.innerHTML = chat.status;
    statusEl.className = "text-caption text-white/60 flex items-center gap-1";
  }

  if (chat.type === "friend") {
    socket.emit("read_messages", { target: chatId });
  }

  renderMessages();
}

// 3. 渲染訊息清單
function renderMessages() {
  const container = document.getElementById("chat-messages");
  const chat = chatData[activeChatId];

  let html = `
    <div class="flex justify-center">
      <span class="px-3 py-1 rounded-full bg-white/10 text-[11px] text-white/50 uppercase tracking-wider">今日</span>
    </div>`;

  chat.messages.forEach((msg) => {
    if (msg.sender === "me") {
      const readIcon = msg.read ? "done_all" : "check";
      html += `
        <div class="flex items-end gap-3 max-w-[70%] ml-auto flex-row-reverse">
          <div class="space-y-1">
            <div class="bg-blue-500 text-white p-4 rounded-2xl rounded-br-none text-body shadow-lg shadow-blue-500/20">
              ${msg.text}
            </div>
            <div class="flex justify-end items-center gap-1 text-[10px] text-white/40 mr-1">
              <span>${msg.time}</span>
              <span class="material-symbols-outlined text-[12px]" style="font-variation-settings: 'FILL' 1">${readIcon}</span>
            </div>
          </div>
        </div>`;
    } else if (msg.sender === "system") {
      html += `
        <div class="flex justify-center my-2">
          <span class="px-3 py-1 rounded-full bg-white/20 text-[11px] text-white/80">${msg.text}</span>
        </div>`;
    } else {
      const senderNameTag = msg.senderName
        ? `<span class="text-[10px] text-white/60 ml-2 block mb-1 font-semibold">${msg.senderName}</span>`
        : "";
      const avatarHtml =
        chat.type === "friend"
          ? `<img class="w-8 h-8 rounded-full object-cover mb-1 shrink-0 border border-white/20" src="${chat.avatar}" />`
          : `<div class="w-8 h-8 rounded-full ${chat.avatarBg} shrink-0 flex items-center justify-center text-white text-xs font-bold mb-1 border border-white/20">${chat.initial}</div>`;

      html += `
        <div class="flex items-end gap-3 max-w-[70%]">
          ${avatarHtml}
          <div class="space-y-1">
            ${senderNameTag}
            <div class="message-in p-4 rounded-2xl rounded-bl-none text-white text-body">
              ${msg.text}
            </div>
            <span class="text-[10px] text-white/40 block ml-1">${msg.time}</span>
          </div>
        </div>`;
    }
  });

  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}

// 4. 發送訊息功能
function sendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();

  if (text !== "") {
    if (activeChatId === "global-chat") {
      socket.emit("send_message", { msg: text });
      input.value = "";
    } else {
      socket.emit("private_message", { target: activeChatId, msg: text });
      input.value = "";
    }
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
}

// === 左側選單切換邏輯 (使用透明度自動適應背景) ===
function switchTab(tabId) {
  activeChatId = null;
  document.getElementById("active-chat-view").classList.add("hidden");
  document.getElementById("active-chat-view").classList.remove("flex");
  document.getElementById("empty-chat-view").classList.remove("hidden");
  document.getElementById("empty-chat-view").classList.add("flex");

  document.querySelectorAll(".contact-item").forEach((el) => {
    el.classList.remove("bg-white/25");
    el.classList.add("hover:bg-white/10");
  });

  // 定義自適應的 CSS Class
  const activeClass =
    "bg-white/20 text-white border border-white/20 shadow-sm rounded-2xl p-3 active:scale-95 duration-200 transition-all";
  const inactiveClass =
    "text-white/60 hover:bg-white/10 hover:text-white border border-transparent rounded-2xl p-3 active:scale-95 duration-200 transition-all";

  const tabs = ["friends", "groups", "profile", "settings"];
  tabs.forEach((tab) => {
    const panel = document.getElementById(`panel-${tab}`);
    const btn = document.getElementById(`btn-${tab}`);

    if (tab === tabId) {
      panel.classList.remove("hidden");
      panel.classList.add("flex");
      btn.className = activeClass;
    } else {
      panel.classList.remove("flex");
      panel.classList.add("hidden");
      btn.className = inactiveClass;
    }
  });
}

function saveProfile() {
  const newName = document.getElementById("profile-name-input").value.trim();
  if (newName !== "") {
    username = newName;
    socket.emit("user_join", { username: username });

    const successMsg = document.getElementById("save-msg");
    successMsg.style.opacity = "1";
    setTimeout(() => {
      successMsg.style.opacity = "0";
    }, 3000);
  }
}

// 背景變更與淺色主題適配
function changeBackground(gradientStr, isLight) {
  document.body.style.backgroundImage = gradientStr;
  if (isLight) {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }
}

// 初始化頁面
window.onload = () => {
  initLists();
  switchTab("friends");
  const profileNameInput = document.getElementById("profile-name-input");
  if (profileNameInput) {
    profileNameInput.value = username;
  }
};
