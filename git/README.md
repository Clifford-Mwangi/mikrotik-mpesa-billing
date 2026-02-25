MikroTik M-Pesa Wi-Fi Billing System
A full-stack ISP billing system that allows Wi-Fi users to purchase time-based internet access using M-Pesa.
Designed for cyber cafés, small ISPs, hostels, hotels, and campuses using MikroTik routers.

🧠 What This System Does
When a user connects to Wi-Fi:
MikroTik blocks internet access
User is redirected to a payment page
User selects a plan (1 hour, 4 hours, 24 hours)
User pays via M-Pesa STK Push
After payment, the system unlocks internet access
Access automatically expires when time is over
This is a real-world captive-portal billing system.

🏗 System Architecture

[ Phone / Laptop ]
↓
[ MikroTik Hotspot ]
↓
[ Node.js API Server ]
↓
[ MongoDB Database ]
↓
[ Safaricom M-Pesa (Daraja API) ]

⚙️ Tech Stack
Backend
Node.js
Express.js
MongoDB
Mongoose
M-Pesa Daraja API
RESTful APIs
Frontend
HTML
CSS
JavaScript (Fetch API)

Networking
MikroTik RouterOS
Hotspot captive portal
DHCP, NAT, Firewall
LAN/WAN routing

📂 Project Structure

/backend
├── controllers
├── routes
├── models
├── server.js

/public
├── login.html
├── buy.html
🔌 Key API Endpoints

Method

GET
/api/plans
Fetch available internet plans

POST
/api/payments/pay
Initiate M-Pesa payment

POST
/api/payments/callback
Receive payment confirmation

POST
/api/admin/activate
Activate MikroTik user

💳 Payment Flow
User selects plan
System sends STK Push via Daraja API
User enters M-Pesa PIN
Safaricom sends callback
Payment is verified
MikroTik hotspot user is created
Internet access is granted

🌍 Real-World Use Case
This system is suitable for:
Cyber cafés
Hostels
Airbnb Wi-Fi billing
Small ISPs
Event Wi-Fi
Community networks
🧪 Running Locally
Clone the repository
Install dependencies
Add .env file:

MONGO_URI=your_mongodb_url
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
SHORTCODE=...
PASSKEY=...
Start server - npm run dev

🧠 What I Learned From This Project
Full-stack API design
Payment gateway integration
Database modeling
Router-based authentication
Network troubleshooting (DHCP, NAT, routing)
Production-style debugging

👨‍💻 Author
Clifford Mwangi
Junior Full-Stack Developer & Systems Engineer
