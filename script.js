const authScreen = document.getElementById("authScreen");
const appScreen = document.getElementById("appScreen");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem("kingsProfile")) || null;
  } catch {
    return null;
  }
}

function showApp(profile) {
  const name = profile?.name || "أحمد محمد";
  const university = profile?.university || "طالب";

  document.getElementById("welcomeName").textContent = name.trim().split(/\s+/)[0];
  document.getElementById("smallName").textContent = name;
  document.getElementById("smallUniversity").textContent = university;
  document.getElementById("smallAvatar").textContent = name.trim().charAt(0) || "أ";

  authScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
}

document.getElementById("showSignup").addEventListener("click", () => {
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
  document.getElementById("authTitle").textContent = "أنشئ حسابك";
  document.getElementById("authDescription").textContent = "ابدأ رحلتك الجامعية مع Kings University.";
});

document.getElementById("showLogin").addEventListener("click", () => {
  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  document.getElementById("authTitle").textContent = "سجّل دخولك";
  document.getElementById("authDescription").textContent = "تابع دراستك وأنجز أهدافك اليوم.";
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const profile = {
    name: document.getElementById("signupName").value.trim(),
    email: document.getElementById("signupEmail").value.trim(),
    university: document.getElementById("signupUniversity").value.trim()
  };

  // تخزين بيانات العرض غير الحساسة فقط. لا تُخزّن كلمة المرور.
  localStorage.setItem("kingsProfile", JSON.stringify(profile));
  showApp(profile);
  showToast("تم إنشاء الحساب التجريبي!");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const savedProfile = getProfile();
  const email = document.getElementById("loginEmail").value.trim();

  // تسجيل دخول شكلي للعرض؛ لا توجد مصادقة حقيقية أو تحقق من كلمة المرور.
  const profile = savedProfile?.email === email
    ? savedProfile
    : { name: email.split("@")[0] || "طالب", email, university: "طالب" };

  localStorage.setItem("kingsProfile", JSON.stringify(profile));
  showApp(profile);
  showToast("أهلاً بك في المنصة!");
});

document.getElementById("demoLogin").addEventListener("click", () => {
  showApp({ name: "أحمد محمد", university: "كلية الحاسبات — جامعة سوهاج" });
  showToast("أنت الآن تستكشف النسخة التجريبية.");
});

document.getElementById("logoutButton").addEventListener("click", () => {
  authScreen.classList.remove("hidden");
  appScreen.classList.add("hidden");
  document.getElementById("sidebar").classList.remove("open");
  showToast("تم تسجيل الخروج من العرض.");
});

// التنقل بين أقسام المنصة
const pageNames = {
  home: "الرئيسية",
  academic: "موادي وجدولي",
  library: "مكتبة الملفات",
  exams: "بنك الامتحانات",
  community: "مجتمع الطلاب",
  opportunities: "فرص وتدريبات",
  assistant: "مساعد Kings AI"
};

function openView(viewName) {
  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
  document.querySelectorAll(".nav-link[data-view]").forEach(link => link.classList.remove("active"));

  document.getElementById(`view-${viewName}`)?.classList.add("active");
  document.querySelector(`.nav-link[data-view="${viewName}"]`)?.classList.add("active");
  document.getElementById("currentPageName").textContent = pageNames[viewName] || "الرئيسية";
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-link[data-view]").forEach(button => {
  button.addEventListener("click", () => openView(button.dataset.view));
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => openView(button.dataset.go));
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// مؤقت بومودورو تجريبي
let remainingSeconds = 25 * 60;
let timerInterval = null;
const timerDisplay = document.getElementById("timerDisplay");
const timerButton = document.getElementById("timerButton");

function updateTimer() {
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;

  if (remainingSeconds <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerButton.textContent = "ابدأ جلسة جديدة";
    showToast("أحسنت! انتهت جلسة التركيز 🍅");
  }
}

timerButton.addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerButton.textContent = "استئناف الجلسة";
    return;
  }

  if (remainingSeconds <= 0) remainingSeconds = 25 * 60;
  timerButton.textContent = "إيقاف مؤقت";
  timerInterval = setInterval(() => {
    remainingSeconds -= 1;
    updateTimer();
  }, 1000);
});

document.getElementById("resetTimer").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  remainingSeconds = 25 * 60;
  timerButton.textContent = "ابدأ الجلسة";
  updateTimer();
});

// بحث بسيط داخل الملفات
document.getElementById("resourceSearch").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  document.querySelectorAll(".resource-card").forEach(card => {
    card.style.display = card.dataset.search.toLowerCase().includes(query) ? "" : "none";
  });
});

// فلاتر المكتبة للتوضيح
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    showToast(`تم اختيار: ${button.textContent}`);
  });
});

// إضافة منشور تجريبي للمجتمع
document.getElementById("publishPost").addEventListener("click", () => {
  const input = document.getElementById("postInput");
  const text = input.value.trim();
  if (!text) {
    showToast("اكتب شيئًا قبل النشر.");
    input.focus();
    return;
  }

  const profile = getProfile();
  const name = profile?.name || "أحمد محمد";
  const initial = name.charAt(0) || "أ";
  const post = document.createElement("article");
  post.className = "panel post-card";
  post.innerHTML = `
    <div class="post-top">
      <div class="avatar">${initial}</div>
      <div><strong></strong><small>مجتمع الطلاب · الآن</small></div>
      <span class="post-menu">•••</span>
    </div>
    <p></p>
    <div class="post-actions">
      <button class="like-button">♡ إعجاب</button>
      <button class="comment-button">♧ تعليق</button>
    </div>`;
  post.querySelector(".post-top strong").textContent = name;
  post.querySelector("p").textContent = text;
  document.getElementById("postsList").prepend(post);
  input.value = "";
  showToast("تمت إضافة المنشور للعرض.");
});

document.getElementById("postsList").addEventListener("click", (event) => {
  if (event.target.classList.contains("like-button")) {
    event.target.textContent = event.target.textContent.includes("إعجاب") ? "♥ أعجبني" : "♡ إعجاب";
  }
  if (event.target.classList.contains("comment-button")) {
    showToast("ميزة التعليقات تحتاج ربطًا بالخلفية.");
  }
});

// مساعد توضيحي: لا يرسل الرسائل إلى نموذج ذكاء اصطناعي فعلي.
function sendChatMessage(message) {
  const container = document.getElementById("chatMessages");
  const userBubble = document.createElement("div");
  userBubble.className = "chat-bubble user-bubble";
  userBubble.textContent = message;
  container.appendChild(userBubble);

  const answer = document.createElement("div");
  answer.className = "chat-bubble ai-bubble";
  answer.textContent = "هذه واجهة تجريبية للمساعد. عند ربطها بخدمة ذكاء اصطناعي، ستظهر الإجابة هنا.";
  container.appendChild(answer);
  container.scrollTop = container.scrollHeight;
}

document.getElementById("chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;
  sendChatMessage(message);
  input.value = "";
});

document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => sendChatMessage(button.textContent));
});

// أزرار توضيحية؛ تحتاج ربطًا بخدمات فعلية لاحقًا.
document.querySelectorAll(".resource-action").forEach(button => {
  button.addEventListener("click", () => showToast("عرض الملفات يحتاج إضافة ملفات فعلية."));
});
document.getElementById("uploadFile").addEventListener("click", () => showToast("رفع الملفات يحتاج ربطًا بالخلفية."));
document.getElementById("addSchedule").addEventListener("click", () => showToast("إضافة المواعيد ستكون ضمن التطوير القادم."));
document.querySelectorAll(".start-exam").forEach(button => {
  button.addEventListener("click", () => showToast("الاختبارات التفاعلية تحتاج إضافة الأسئلة."));
});
document.querySelectorAll(".apply-button").forEach(button => {
  button.addEventListener("click", () => showToast("تفاصيل الفرص يمكن إضافتها في النسخة القادمة."));
});

// إبقاء تسجيل الدخول التجريبي بعد إعادة فتح الصفحة على الجهاز نفسه
const existingProfile = getProfile();
if (existingProfile) showApp(existingProfile);
