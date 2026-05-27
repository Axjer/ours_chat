function joinChat() {
  const username = document.getElementById("name-input").value;
  if (!username) {
    alert("請輸入使用者名稱來登入。");
    return;
  }
  console.log(`Joining Ours Chat as: ${username}`);

  const btn = document.querySelector("button");
  const originalHtml = btn.innerHTML;
  btn.innerHTML =
    '<span class="material-symbols-outlined animate-spin" data-icon="progress_activity">progress_activity</span> 同步中...';
  btn.classList.add("opacity-80", "pointer-events-none");

  setTimeout(() => {
    // Reset button state
    btn.innerHTML = originalHtml;
    btn.classList.remove("opacity-80", "pointer-events-none");

    // 跳轉到聊天室並帶上使用者名稱
    window.location.href = `../chatroom/index.html?username=${encodeURIComponent(username)}`;
  }, 800);
}

function createAccount() {
  // Redirection or registration logic
  alert("準備導向「新增帳號」的頁面或顯示註冊表單。");
}

// === 底部跑動寵物邏輯 ===
function initWanderingPets() {
  class Pet {
    constructor(containerId, startX, speedBase) {
      this.container = document.getElementById(containerId);
      this.icon = this.container.querySelector(".pet-icon");
      this.x = startX;
      this.speedBase = speedBase;
      this.speed = 0;
      this.direction = Math.random() > 0.5 ? 1 : -1; // 1 = 向右, -1 = 向左
      this.state = "idle"; // 'idle', 'walk'
      this.stateTimer = 0;
      this.updateDisplay();
    }

    update() {
      // 每次迴圈減少大約一幀的時間 (16ms)
      this.stateTimer -= 16;
      if (this.stateTimer <= 0) {
        this.chooseNewState();
      }

      if (this.state === "walk") {
        this.x += this.speed * this.direction;

        // 邊界碰撞偵測 (假設寵物寬度約為 80px)
        const maxW = window.innerWidth - 80;
        if (this.x < 10) {
          this.x = 10;
          this.direction = 1;
        } else if (this.x > maxW) {
          this.x = maxW;
          this.direction = -1;
        }
      }

      this.updateDisplay();
    }

    updateDisplay() {
      // 🐈 🐕 Emoji 預設面朝左。
      // 向右(1)時翻轉(scaleX(-1))，向左(-1)時不翻轉(scaleX(1))
      const scaleX = this.direction === 1 ? -1 : 1;
      this.container.style.transform = `translateX(${this.x}px) scaleX(${scaleX})`;

      // 套用或移除跑動動畫 class
      if (this.state === "walk") {
        this.icon.classList.add("pet-running");
      } else {
        this.icon.classList.remove("pet-running");
      }
    }

    chooseNewState() {
      // 100% 持續跑動，不要原地踏步
      this.state = "walk";
      this.speed = this.speedBase + Math.random() * 2;

      // 偶爾隨機換方向
      if (Math.random() > 0.7) {
        this.direction *= -1;
      }
      this.stateTimer = 1500 + Math.random() * 3000;
    }
  }

  // 初始化貓的起始位置跟基準速度
  const cat = new Pet("running-cat", window.innerWidth > 400 ? 300 : 150, 2);

  function loop() {
    cat.update();
    requestAnimationFrame(loop);
  }
  // 啟動動畫迴圈
  loop();

  // 視窗縮放時稍微保護一下，避免寵物跑出視窗外回不來
  window.addEventListener("resize", () => {
    const maxW = window.innerWidth - 80;
    if (cat.x > maxW) cat.x = maxW;
  });
}

// 啟動底部跑動寵物動畫
initWanderingPets();
