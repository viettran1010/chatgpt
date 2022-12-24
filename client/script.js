// import bot from "./assets/bot.svg";
// import user from "./assets/user.svg";

const bot =
  "https://w7.pngwing.com/pngs/1001/63/png-transparent-internet-bot-computer-icons-chatbot-sticker-electronics-face-careobot-thumbnail.png";
const user =
  "https://raw.githubusercontent.com/abhisheknaiidu/abhisheknaiidu/master/code.gif";

const form = document.querySelector("form");

const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent.length > 3) {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;
  const interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
      <div class="wrapper ${isAi && "ai"}" >
        <div class="chat">
          <div class="profile">
            <img style="width:20px;height:20px;" src="${
              isAi ? bot : user
            }" alt="profile" />
          </div>
          <div class="message" id=${uniqueId}>${value}
          </div>
        </div>
      </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe(
    false,
    data.get("prompt").toString(),
    generateUniqueId()
  );

  form?.reset();

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const response = await fetch("https://chatgpt1.onrender.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt").toString(),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";

    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});
