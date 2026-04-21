# FindIt 🧭

Not a big project, just something I kept thinking about and finally built.

I noticed a simple problem around me — whenever someone loses something, they usually post it in WhatsApp groups or random platforms. Most of the time, those messages get buried under other chats, and people don’t even notice them.

That didn’t feel right.

So I tried to build something simple that actually helps.

**FindIt** is a Lost & Found web app that connects people to help them recover their belongings.

---

## 🚀 Live Demo

👉 https://findit-1-74wq.onrender.com/login

---

## 🔍 Features

* 📢 Post lost or found items with image and location
* 🗺️ Browse items near you (region-based filtering)
* 📞 Contact the reporter directly (Call / WhatsApp)
* 🔄 Track item status (Open → In Progress → Completed)
* 🔐 Secure authentication using JWT
* 🖼️ Image uploads using Cloudinary
* 🛡️ Basic verification system for sensitive items

---

## 🛠️ Tech Stack

**Frontend**

* React + Vite
* Tailwind CSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB Atlas

**Storage**

* Cloudinary

**Deployment**

* Render

---

## 📦 Project Structure

```bash
Findit/
├── client/   # Frontend (React)
├── server/   # Backend (Node + Express)
```

---

## ⚙️ Environment Variables

Create a `.env` file inside `/server`:

```env
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
FRONTEND_URL=http://localhost:5173
```

---

## ▶️ Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/your-username/Findit.git
cd Findit
```

### 2. Setup backend

```bash
cd server
npm install
npm run dev
```

### 3. Setup frontend

```bash
cd client
npm install
npm run dev
```

---

## ⚠️ Note

* This project is still a **work in progress**
* You might see bugs or incomplete features
* I’m continuously improving it

---

## 💭 Why I built this

This started from a small real-life observation.

People lose things, but the way we try to find them is messy and unreliable. I wanted to build something focused and simple that actually works better than scattered messages.

---

## 🙌 Feedback

If you have suggestions, ideas, or improvements, feel free to open an issue or reach out.

---

## ⭐ If you like it

Give this repo a star — it helps a lot 🙂
