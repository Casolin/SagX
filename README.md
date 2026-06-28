# 🚀 SagX

SagX is a full stack mission management platform built for organizations that need structured and rule based workflows instead of manual task coordination.

It also includes real time communication tools like chat, voice and video calls, and screen sharing to help users work together inside the same system.

---

## ✨ Features

🔐 Secure authentication system  
🔑 Two Factor Authentication  
🔄 Refresh token session management  
📋 Mission and task management system  
💬 Real time chat  
📞 Voice and video calls  
🖥️ Screen sharing  
👥 Role based access control

---

## ⚙️ How the system actually works

SagX is not just CRUD. It follows real workflow rules.

📦 A mission cannot start if required materials are missing  
🚫 If materials are missing the system blocks the action and requires manager involvement  
⚠️ A machine cannot be marked as down unless there is a real alert for it  
🧑‍🔧 Technicians must contact managers when something is missing before continuing  
🔁 Everything is validated in real time before actions are accepted

---

## 📡 Real time system

🌐 WebSocket based communication across the app  
💬 Live chat between users  
🔔 Real time alerts for missions, machines and materials  
⚡ Instant updates without refreshing the page

---

## 📞 Call system

📞 Voice and video calls using WebRTC  
🧠 Global call state handled with Zustand  
🚫 A user cannot receive another call while already in one  
📵 Calls are blocked if the user is busy  
🎛️ In call controls like mute, camera toggle, screen share, and minimize

---

## 🧠 State management

Zustand is used for global state across the app.

It handles call state, session state and real time synchronization between different parts of the system so everything stays consistent.

---

## 🛠️ Tech stack

Frontend  
React  
TypeScript  
Tailwind CSS  
Zustand

Backend  
Node.js  
Express

Database  
MongoDB

Real time  
Socket.io  
WebSockets  
WebRTC

---

## 🎯 Purpose

The goal of SagX is to simulate how real enterprise systems work where everything depends on rules, resources and coordination between users.

It reflects real internal tools used in industrial and operational environments where you cannot just click and execute anything without validation.

---

## 📌 Status

Still being improved as part of a full stack portfolio project.
