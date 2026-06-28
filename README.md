<p align="center">
  <img src="client/public/logo2.png" width="180" />
</p>

<h1 align="center"><b>SagX</b></h1>

<p align="center">
  <b>Full Stack Mission Management System</b><br>
  Real time collaboration • Workflow enforcement • Enterprise style operations
</p>

---

## 🚀 Overview

SagX is a full stack mission management platform designed for structured enterprise workflows.

It replaces manual coordination with a system where everything is controlled by rules, validation, and real time synchronization.

The system simulates real operational environments where missions, machines, and resources must be validated before execution.

---

## ✨ Features

• <b>Secure Authentication System</b>  
• <b>Two Factor Authentication (2FA)</b>  
• <b>Refresh Token Session Management</b>  
• <b>Mission & Task Management System</b>  
• <b>Real Time Chat System</b>  
• <b>Voice & Video Calling</b>  
• <b>Screen Sharing Support</b>  
• <b>Role Based Access Control</b>  

---

## ⚙️ Workflow Engine

<b>SagX enforces strict operational rules:</b>

• Missions cannot start without required materials  
• Missing materials block execution and require manager approval  
• Machine status cannot be changed to “down” without a valid alert  
• Technicians must contact managers when resources are missing  
• All actions are validated before execution  

---

## 📡 Real Time System

• WebSocket based communication layer  
• Live chat between users  
• Real time alerts for missions, machines, and materials  
• Instant synchronization across the system  

---

## 📞 Communication System

• WebRTC voice and video calls  
• Zustand global call state management  
• Users cannot receive multiple calls at the same time  
• Calls are blocked when user is already in a session  
• In call controls (mute, camera, screen share, minimize)  

---

## 🧠 State Management

• Zustand handles global application state  
• Centralized call + session management  
• Real time synchronization across modules  
• Consistent UI behavior across the system  

---

## 🛠 Tech Stack

<b>Frontend</b>  
• React  
• TypeScript  
• Tailwind CSS  
• Zustand  

<br>

<b>Backend</b>  
• Node.js  
• Express.js  

<br>

<b>Database</b>  
• MongoDB  

<br>

<b>Real Time Layer</b>  
• Socket.io  
• WebSockets  
• WebRTC  

---

## 🎯 Purpose

SagX simulates real enterprise systems where:

• Tasks depend on resource availability  
• Machine states depend on system alerts  
• Actions follow strict business rules  
• Communication is embedded into workflows  
• Real time coordination is required between users  

---

## 📌 Status

<b>Active development</b> as part of a full stack engineering portfolio project.

---

## ⚠️ Note

Some features are implemented in demo form and will be further optimized for production readiness.
