🚀 ISP Billing & Hotspot Management System

A full-stack billing and authentication system built for a real-world ISP business.
Designed to automate customer subscriptions, integrate M-Pesa payments, and manage hotspot access efficiently.
This system was built to solve actual operational problems in a live ISP business ("The Link Internet") and generated revenue through automated billing and subscription management.

📌 Overview
This application provides:
Customer subscription management
Automated billing logic
M-Pesa (Daraja Sandbox) payment integration
API-based plan management
MongoDB database integration
Backend authentication & routing
Hotspot network integration (MikroTik RouterOS)
It replaces manual billing processes with a scalable digital system.

🛠️ Tech Stack

Backend
Node.js
Express.js
MongoDB (Mongoose ODM)
RESTful API architecture

Payments
Safaricom Daraja API (Sandbox)

Networking
MikroTik RouterOS
Hotspot user management
DHCP & IP configuration
NAT & firewall configuration

Frontend
HTML5
CSS3
JavaScript (ES6+)

Dev Tools
Git & GitHub
VS Code
Postman (API testing)

🧠 System Architecture
Client → Frontend → Express API → MongoDB
↓
Daraja API (M-Pesa)
↓
MikroTik Hotspot Integration

🔥 Key Features

1️⃣ Subscription Management
Create, edit and delete plans
Hourly subscriptions
24-hour subscriptions
Monthly subscriptions
Automatic expiry logic

2️⃣ Payment Integration
M-Pesa STK Push integration
Payment validation via callback
Transaction storage in MongoDB
Payment-to-subscription linking

3️⃣ Customer Management
User registration
Phone-based authentication
Plan allocation
Active session tracking

4️⃣ API Endpoints
/api/plans
/api/payments
/api/users
/api/subscriptions

Built following REST principles.

5️⃣ Network Layer (MikroTik)
NAT configuration
DHCP server setup
Bridge configuration
Hotspot authentication
Firewall rules

💰 Real-World Impact

This system was deployed in a live ISP business:
Business: The Link Internet
Location: Section 58, Nakuru, Kenya
It enabled:
Automated billing
Flexible subscription models
Improved customer management
Increased operational efficiency
The ISP business generated KES 115,000+ annually using this system.

📂 Project Structure

/controllers
/models
/routes
/middleware
/config
/public

👨‍💻 Author
Clifford Mwangi
Junior Full-Stack Developer & Systems Engineer
