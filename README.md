<p align="center">
  <img src="client/public/logo2.png" width="180" />
</p>

<h1 align="center">SagX</h1>

<p align="center">
  Full stack mission management system with real time collaboration and strict workflow enforcement
</p>

<br>

<p align="center">
  A structured enterprise style system where missions, machines, and resources follow strict operational rules before execution
</p>

---

<br>

## 🚀 Overview

SagX is a full stack mission management platform designed for organizations that need structured, rule based workflows instead of manual task coordination.

It simulates real operational environments where missions, machines, and resources must follow strict validation rules before execution.

The system also includes real time communication features to support collaboration between users.

---

<br>

## ✨ Features

• Secure authentication system  
• Two Factor Authentication (2FA)  
• Refresh token session management  
• Mission and task management system  
• Real time chat system  
• Voice and video calls  
• Screen sharing support  
• Role based access control  

---

<br>

## ⚙️ Workflow Engine

SagX enforces strict operational rules similar to real enterprise systems.

<br>

• Missions cannot start without required materials  
• Missing materials block execution and require manager intervention  
• Machine status cannot be set to “down” without a valid alert  
• Technicians must contact managers when resources are missing  
• All actions are validated before execution  

---

<br>

## 📡 Real Time System

• WebSocket based communication  
• Live chat between users  
• Real time alerts for missions, machines, and materials  
• Instant synchronization across the application  

---

<br>

## 📞 Communication System

• WebRTC based voice and video calls  
• Zustand global call state management  
• Users cannot receive multiple calls at the same time  
• Calls are blocked when user is already in a session  
• In call controls: mute, camera, screen share, minimize  

---

<br>

## 🧠 State Management

• Zustand handles global application state  
• Manages call and session state across the system  
• Ensures real time synchronization between modules  
• Keeps UI consistent across all features  

---

<br>

## 🛠 Tech Stack

Frontend  
• React  
• TypeScript  
• Tailwind CSS  
• Zustand  

<br>

Backend  
• Node.js  
• Express.js  

<br>

Database  
• MongoDB  

<br>

Real Time  
• Socket.io  
• WebSockets  
• WebRTC  

---

<br>

## 🎯 Purpose

SagX simulates real enterprise systems where:

• tasks depend on resource availability  
• machine states depend on system alerts  
• actions follow strict business rules  
• communication is embedded into workflows  
• real time coordination is required between users  

It reflects how internal operational tools work in logistics, telecom, and field service environments.

---

<br>

## 📌 Status

Active development as part of a full stack engineering portfolio project.
