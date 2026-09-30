# Monsoon Predict - SIH 2026 🌧️

**Hyperlocal Monsoon Onset & Break Prediction System (Block/Village Scale)**

This project is a complete, polished, demo-ready web application created for Smart India Hackathon (SIH) 2026, Problem Statement 26086 by MoES / NCMRWF. 

It provides an interactive, reactive, and live-feeling dashboard that bridges the gap between global climate models and farm-level decisions for the state of Odisha.

## Features ✨

- **Landing Page**: Animated hero section, KPI counters, and problem summary.
- **Global Drivers Panel**: Live-feeling data and animated MJO phase diagram for ENSO, IOD, and MJO indices.
- **Risk Map (Core Feature)**: Interactive map of Odisha blocks with color-coded choropleths for Onset, Break, and Heavy Rain probabilities over a 4-week lead time. Features a 30-day timeline scrubber, search, and a detailed sliding drawer with SHAP explainability and charts.
- **Advisory Engine**: Expert-system rule engine for crop-specific advisories based on block risk, crop type, sowing stage, soil type, and irrigation availability.
- **Farmer Mobile View**: A simplified, responsive view for farmers with multi-language support (English, Hindi, Odia, Bengali, Telugu, Tamil), text-to-speech advisory playback, and WhatsApp sharing.
- **Alert Gateway Simulator**: Mockup of WhatsApp/SMS message delivery with animated read-receipts and broadcast statistics.
- **Extension Officer Dashboard**: Data-dense table view for agricultural officers with filtering, sorting, sparkline charts, and functional CSV exports.
- **Methodology & Architecture**: Animated architecture flow diagram and model validation metrics.

## Setup & Installation 🚀

The app is built with **React, Vite, TypeScript, Tailwind CSS v4, Framer Motion, Recharts, and React-Leaflet**. All data is realistically simulated and hardcoded locally—no backend or API keys are required.

1. **Clone the repository**
   ```bash
   git clone https://github.com/ADITYASHUKLA189/sih.git
   cd sih/monsoon-predict
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Build for production** (Ready for Vercel/Netlify deployment)
   ```bash
   npm run build
   ```

## 3-Minute Demo Script 🎥

**0:00 - 0:30 | Introduction & Global Context**
- Start on the **Landing Page**. Point out the problem statement: bringing global climate data down to the block level. Mention the live-updating KPIs.
- Click "Launch Dashboard" or navigate to **Global Drivers**. Briefly show the animated MJO Phase diagram and sparklines. *“Our model starts by looking at global teleconnections like ENSO and MJO.”*

**0:30 - 1:30 | The Core Risk Map**
- Go to the **Risk Map**. Explain that this is Odisha, modeled down to the block/panchayat scale.
- Toggle between **Week 1** and **Week 2**. Show how the choropleth map smoothly updates to show changing probabilities for Monsoon Onset.
- Select the **Dry Spell (Break)** hazard. Show the spatial patterns.
- Hover over a block (e.g., in Puri or Kalahandi) and **Click it**.
- The right-side **Detail Drawer** slides in. Show the probability gauges, the 30-day rainfall prediction chart, and the *“Why this forecast?”* (SHAP feature contribution) bar chart. *“This provides explainability to meteorologists.”*

**1:30 - 2:00 | Generating Actionable Advice**
- Navigate to the **Advisory Engine**.
- Select a district, block, crop (e.g., Paddy), stage (Pre-Sowing), and irrigation (No). 
- Click **Generate Advisory**. Show the simulated reasoning loading bar. 
- Highlight the output: a clear severity badge, confidence chip, the specific IF-THEN rule trace triggered, and the actionable agronomic practices.

**2:00 - 2:30 | Last Mile Delivery (Farmer View & Alerts)**
- Switch to the **Farmer View**. Show the mobile-friendly layout.
- Change the language to **Hindi** or **Odia** to demonstrate localization.
- Click the **Listen** button to show text-to-speech accessibility, and the WhatsApp share button.
- Go to the **Alert Gateway**. Click **Broadcast** and watch the simulated WhatsApp delivery ticks (Sent → Delivered → Read) and the live farmers-reached counter.

**2:30 - 3:00 | Officer Tools & Methodology**
- Briefly show the **Extension Officer Dashboard**, highlighting the data table, sparklines, and working CSV export.
- End on the **Methodology** page to show the architecture diagram and model validation metrics (Brier Score, ROC-AUC) to prove scientific rigor.

---
*Prototype with simulated data for demonstration — SIH 2026, PS 26086*
