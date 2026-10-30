# Sradha Panigrahi — Professional Portfolio Website

⚡ **Electrical & Electronics Engineer | Power Systems • Smart Grid • ANN Controllers • Embedded IoT • Signal Processing**

This is the official personal portfolio website for **Sradha Panigrahi**, crafted to showcase advanced engineering projects, research internships, academic credentials, and core competencies.

---

## 🌟 Key Features

- **Profile & Visual Identity**: Integrated high-resolution professional headshot with an interactive holographic circuit ring and floating dynamic tech badges.
- **Dynamic Background Canvas**: Interactive neural synapse & electrical grid network simulation in HTML5 Canvas responding to mouse physics.
- **Dark / Light Mode**: Seamless theme switcher with user persistence using `localStorage`.
- **Custom Project Showcase** (Ordered to highlight Multiphysics, AI Power Quality, Grid Dynamics, IoT, & DSP):
  1. **Electrostatic Precipitator (ESP) Design & Multiphysics Simulation** (*Research at IIT Bhubaneswar using COMSOL Multiphysics*)
  2. **Design of ANN Controller & Implementation with UPQC Integrated with Microgrid** (*Flagship Power Quality & Artificial Intelligence Project in MATLAB/Simulink*)
  3. **Grid-Connected PV Microgrid Modeling with MPPT Controller** (*6.84 kW Solar PV + Li-ion BESS in MATLAB/Simulink*)
  4. **Smart Irrigation System with Automated Sensor Integration** (*ESP32/Arduino, moisture sensing & solenoid actuation — 1st Prize Paper Presentation Winner*)
  5. **Digital Filter of Noise Reduction & Feature Extraction from Signal Using Python** (*DSP pipeline using SciPy, NumPy, and Matplotlib*)
  *(Note: "Knocking Pattern Smart Door Lock" and "PORTA-MP Microplastic Detector" have been excluded as requested).*
- **Interactive Project Modals**: Deep-dive technical specifications, schematics, and performance metrics accessible via modal views.
- **Live ATS Resume Download**: Direct one-click download of the complete `Sradha_Panigrahi_Resume.pdf`.
- **Interactive Engineer Console (Easter Egg)**: Built-in terminal allowing recruiters and engineers to run commands (`skills`, `projects`, `experience`, `upqc`, `contact`, `download-cv`).
- **Comprehensive Skills Matrix**: Categorized into Power Systems, Simulation & CAD, Embedded & Hardware, and Programming & Analytics.
- **Interactive Contact Panel**: One-click "Copy Email" and "Copy Phone" buttons with instant feedback toast, alongside an interactive message form.

---

## 📂 Project Directory Structure

```text
sradha-portfolio/
│
├── index.html                   # Semantic HTML5 single-page application
├── README.md                    # Project documentation & deployment guide
│
└── assets/
    ├── css/
    │   └── style.css            # Modern CSS3 styling (dark/light themes, animations)
    ├── js/
    │   └── main.js              # Interactive neural canvas, filters, modals, terminal
    ├── images/
    │   └── profile.jpg          # Professional headshot
    └── documents/
        └── Sradha_Panigrahi_Resume.pdf  # ATS-optimized resume
```

---

## 🚀 How to Run Locally

### Option 1: Direct File Open
Simply double-click [`index.html`](file:///C:/Users/SRADHA%20PANIGRAHI/.gemini/antigravity/scratch/sradha-portfolio/index.html) or right-click and select **Open with Chrome / Edge / Firefox**.

### Option 2: Run via Local Python Server
Open terminal in the `sradha-portfolio` directory:
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000`

---

## 🌐 Free 1-Click Deployment (GitHub Pages)

To publish this portfolio live to the web under your personal URL (e.g. `https://sradhapanigrahi.github.io`):
1. Create a new repository on GitHub named `portfolio` or `sradhapanigrahi.github.io`.
2. Push all files from `sradha-portfolio/` to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Sradha Panigrahi Engineering Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, select **Source: Deploy from a branch**.
   - Set Branch to `main` / `root` and click **Save**.
4. Your website will be live in 1-2 minutes!
