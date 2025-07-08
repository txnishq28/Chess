# ♟️ Real-Time Multiplayer Chess App

A beautifully designed real-time chess game built using **Node.js**, **Socket.IO**, and **chess.js**, deployed live on Render.

🌐 **Live Demo**: [https://checkmate-app-hh80.onrender.com](https://checkmate-app-hh80.onrender.com)

---

## 🚀 Features

- 🔴 Real-time multiplayer gameplay via **WebSockets**
- ⚪ Role assignment (White / Black) on join
- 🧠 Chess rules enforced using **chess.js**
- ✅ Legal move highlighting with green circles
- 🔊 Sound effects for move, win, and loss
- ⏱️ Per-turn timer (1:30 countdown)
- 🪧 Popups for:
  - Turn notifications
  - Checkmate or draw result
  - Waiting for other player
- 🎨 Clean, responsive UI with **Tailwind CSS**

---

## 🛠️ Tech Stack

- **Frontend**: HTML, EJS, TailwindCSS, Vanilla JS
- **Backend**: Node.js, Express, Socket.IO
- **Logic**: [chess.js](https://github.com/jhlywa/chess.js) for game rules
- **Deployment**: [Render](https://render.com/)

---

## 📸 Screenshots

![Chess App Screenshot](https://raw.githubusercontent.com/txnishq28/Chess/main/assets/screenshot.png)

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

bash
git clone https://github.com/txnishq28/Chess.git
cd Chess
2. Install dependencies
bash
Copy
Edit
npm install
3. Run locally
bash
Copy
Edit
node app.js
# or if using nodemon
npx nodemon app.js
Visit http://localhost:3001 in your browser. Open in two tabs/windows to test multiplayer.

📁 Folder Structure
pgsql
Copy
Edit
Chess/
├── public/
│   ├── js/
│   │   └── chessgame.js
│   └── sounds/
│       ├── move.mp3
│       ├── win.mp3
│       └── lose.mp3
├── views/
│   └── index.ejs
├── app.js
├── package.json
└── README.md
✨ Future Improvements
👥 Support for spectators and lobby

🔁 Rematch system with vote prompt

💬 In-game chat

🧩 ELO rating system

📃 License
This project is open-source under the MIT License.

Built with ♥ by @txnishq28

yaml
Copy
Edit

---

### ✅ To complete:
- Add a screenshot named `assets/screenshot.png` in your repo or remove that line.
- Paste this into your `README.md` and push it:

``bash
echo "<paste-content-here>" > README.md
git add README.md
git commit -m "Add project README"
git push origin main
