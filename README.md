# 🚀 SagX

SagX is a full stack mission management platform built for organizations that need structured and rule based workflows instead of manual task coordination.

It also includes real time communication features like chat, voice and video calls, and screen sharing to support collaboration inside the system.

---

<br>

## ✨ Features

<br>

🔐 Secure authentication system  
<br>
🔑 Two Factor Authentication  
<br>
🔄 Refresh token session management  
<br>
📋 Mission and task management system  
<br>
💬 Real time chat  
<br>
📞 Voice and video calls  
<br>
🖥️ Screen sharing  
<br>
👥 Role based access control  

---

<br>

## ⚙️ How the system works

<br>

SagX is not a simple CRUD app. It enforces real workflow logic.

<br>

📦 A mission cannot start if required materials are missing  
<br>
🚫 Missing materials block execution and require manager action  
<br>
⚠️ A machine cannot be marked as down without a valid alert  
<br>
🧑‍🔧 Technicians must contact managers when resources are missing  
<br>
🔁 Every action is validated before it is accepted by the system  

---

<br>

## 📡 Real time system

<br>

🌐 WebSocket communication across the platform  
<br>
💬 Live chat between users  
<br>
🔔 Real time alerts for missions, machines and materials  
<br>
⚡ Instant updates without page refresh  

---

<br>

## 📞 Call system

<br>

📞 Voice and video calls using WebRTC  
<br>
🧠 Global call state managed with Zustand  
<br>
🚫 Users cannot receive multiple calls at the same time  
<br>
📵 Calls are blocked when a user is busy  
<br>
🎛️ In call controls like mute, camera, screen share and minimize  

---

<br>

## 🧠 State management

<br>

Zustand is used for global state across the app.

It keeps call state, session state and real time updates in sync so everything behaves consistently across the system.

---

<br>

## 🛠️ Tech stack

<br>

Frontend  
React  
TypeScript  
Tailwind CSS  
Zustand  

<br>

Backend  
Node.js  
Express  

<br>

Database  
MongoDB  

<br>

Real time  
Socket.io  
WebSockets  
WebRTC  

---

<br>

## 🎯 Purpose

<br>

SagX simulates real enterprise systems where everything depends on rules, resources and coordination between users.

It represents how internal tools work in real companies where actions must be validated and cannot happen freely without constraints.

---

<br>

## 📌 Status

<br>

Still being improved as part of a full stack portfolio project.
