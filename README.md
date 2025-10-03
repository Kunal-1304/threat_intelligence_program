# 🛡️ Threat Intelligence Dashboard

A **real-time cyber threat monitoring and analysis dashboard** built with **React, TailwindCSS, Recharts, and Lucide Icons**.  
This project simulates **threat intelligence feeds**, provides **risk analysis, anomaly detection**, and includes features like **historical data trends, WhatsApp alerts, and dark mode**.

---

## 🚀 Features

✅ **Real-Time Threat Simulation**  
- Randomized threat data (IP, Country, Threat Type, Confidence Score).  
- Supports filtering by **country, threat type, and time range**.  

✅ **Threat Intelligence Analytics**  
- **Pie Charts** for Threat Type Distribution.  
- **Bar Charts** for Top Countries.  
- **Line & Area Charts** for Historical Threat Trends.  

✅ **Machine Learning Inspired Risk Assessment**  
- Confidence-based **anomaly detection** (low & high confidence treated as anomalies).  
- High-risk identification.  

✅ **Interactive Dashboard**  
- 📅 Filter by 24 hours / 7 days / 30 days.  
- 🌙 Dark Mode / ☀️ Light Mode toggle.  
- 🔔 Real-time alert notifications.  
- 📲 WhatsApp alert integration.  

✅ **Modular & Scalable Architecture**  
- Easy to extend with real APIs.  
- Designed for future upgrades with minimal changes.  

---

## 📂 Project Structure
ThreatDashboard/
│── src/
│ ├── components/
│ │ └── ThreatDashboard.jsx # Main Dashboard Component
│ ├── App.jsx
│ ├── index.jsx
│── public/
│── package.json
│── tailwind.config.js
│── README.md

yaml

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, Lucide-React  
- **Charts:** Recharts (Pie, Bar, Line, Area Charts)  
- **Alerts:** Custom notification system + WhatsApp integration  
- **Styling:** Glassmorphism + Dark/Light Themes  

---



## ⚡ Installation & Setup

1️⃣ **Clone repo:**
```bash
git clone https://github.com/your-username/threat-dashboard.git
cd threat-dashboard

2️⃣ Install dependencies:

npm install


3️⃣ Run the app locally:

npm run dev


4️⃣ Open in browser:
👉 http://localhost:5173

Screenshots

Screenshot 2025-10-03 164503.png
Screenshot 2025-10-03 164521-1.png 
Screenshot 2025-10-03 164447.png

WhatsApp Alerts Setup

Click WhatsApp Setup in dashboard.

Enter phone number with country code (e.g., 919876543210).

Alerts will be sent directly to WhatsApp via wa.me API.

🧠 Future Upgrades

🔗 Integrate real threat intelligence APIs (AlienVault OTX, VirusTotal, AbuseIPDB).

🤖 Use ML models for actual anomaly detection.

☁️ Deploy on cloud (AWS/GCP/Azure).

🗄️ Store threat logs in MongoDB / PostgreSQL.

👨‍💻 Author

Made by Kunal Suresh Pawar

📧 Contact: kunalpawar13042004@gmail.com

🌍 GitHub: Kunal-1304

📜 License

This project is licensed under the MIT License.
