# 🛡️ Trust Issues — Behavioral Threat Intelligence System

> **S62-0226-PineappleLassi-MLwith-TrustIssues**

A full-stack **Security Operations Center (SOC) dashboard** that detects, analyzes, and simulates behavioral threats using machine learning-driven insights.

---

## 🚀 Overview

**Trust Issues** is a behavioral threat intelligence platform designed to:

* Detect anomalous user activity
* Analyze behavioral risk patterns
* Provide actionable intelligence insights
* Simulate cyber attacks to test system robustness

It mimics a **real-world SOC dashboard**, combining analytics, monitoring, and simulation into one unified interface.

---

## 🧠 Core Features

### 📊 Dashboard (Overview)

* Real-time system metrics
* High-risk user detection
* Alert summaries
* Investigate flow → deep intelligence view

---

### 👤 User Intelligence

* Behavioral analysis per user
* AI-style insight summary
* Primary risk drivers
* Session timeline visualization

---

### 🚨 Alerts System

* Live anomaly detection feed
* Convert alerts → incidents
* Risk-based prioritization

---

### 📈 Analytics

* Organizational risk trends
* Device-based risk distribution
* Department-level heatmaps

---

### 🧪 Attack Simulation Lab

* Simulate behavioral attacks:

  * Data Exfiltration
  * Privilege Abuse
  * After-hours Intrusion
  * Credential Compromise
* Observe system response in real-time
* Validate detection pipelines

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Chart libraries (custom visualizations)

### Backend

* Python (FastAPI / Flask style APIs)
* Machine Learning-based scoring logic

### Data

* Behavioral session data
* Risk scoring engine
* Intelligence aggregation

---

## 📁 Project Structure

```
frontend/
  ├── pages/
  ├── components/
  ├── charts/
  ├── services/

backend/
  ├── api/
  ├── models/
  ├── simulation/
  ├── analytics/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <repo-url>
cd S62-0226-PineappleLassi-MLwith-TrustIssues
```

---

## 🐍 Environment Setup (Data Science)

### Python Verification

```bash
python --version
```

✔ Expected:

```
Python 3.x.x → verified working
```

---

### Conda Verification

```bash
conda --version
```

✔ Expected:

```
conda x.x.x → verified working
```

---

### ⚠️ Conda Fix (Git Bash)

```bash
source ~/anaconda3/etc/profile.d/conda.sh
```

---

### Create Environment

```bash
conda create -n ds_env python=3.10
conda activate ds_env
```

---

### Verify Environment

```bash
python --version
conda info --envs
```

---

### Launch Jupyter

```bash
jupyter notebook
```

✔ Jupyter should open in browser successfully

---

### Test Execution (Jupyter)

```python
print("Environment working")
```

✔ Output:

```
Environment working
```

---

### ✅ Status

Environment verified and ready for Data Science work.

---

## 💻 Running the Application

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### Backend

```bash
cd backend
# run your API server
python app.py
```

---

## 🔗 Application Flow

```
Overview → Investigate → User Intelligence
Alerts → Convert → Incident
Simulation → Inject Attack → Analyze Response
```

---

## 🎯 Key Highlights

* 🔥 Realistic SOC dashboard UI
* 🧠 AI-style behavioral insights
* ⚡ Attack simulation engine
* 📊 Multi-layer analytics
* 🔗 Fully connected user flow

---

## 📌 Future Improvements

* Real-time streaming logs
* Advanced ML anomaly detection models
* Role-based access control
* Live alert pipelines
* Predictive risk modeling

---

## 👩‍💻 Author

**Jessica Shalomi Selvan**

---

## 📄 License

This project is for academic and learning purposes.

---

## ⭐ Final Note

This project is designed to simulate how modern security systems:

* detect threats
* analyze behavior
* and respond intelligently

It bridges **frontend UX + backend intelligence + ML concepts** into one cohesive system.

---
