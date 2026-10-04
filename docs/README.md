# Noggin 🧠 - Learning that Adapts to You


<img width="1280" height="640" alt="Untitled design" src="https://github.com/user-attachments/assets/d9de5745-0a74-440e-9879-cf30bb36752a" />

  Noggin is an open-source AI-powered adaptive learning platform built for students with special educational needs. Utilizing an AI-driven engine built on neuroplasticity research, the system creates a personalized curriculum that adjusts difficulty and teaching styles in real time to accommodate conditions like ADHD, autism, and dyslexia. The program covers core academic subjects and social-emotional skills through game-based interactive challenges, ensuring that lessons remain engaging rather than frustrating.

[🌐 Launch Live Application](https://nogginbynogginlabs.netlify.app)

---

## ⚛️ Meet Noggimigo!

**Noggimigo** is our built-in, local Python AI tutor designed specifically for special education workflows. 

Unlike standard conversational models that hand out answers, Noggimigo acts as a patient, scaffolded coach. It asks friendly, guiding questions, breaks down complex topics into micro-concepts, and uses clear, encouraging language to help students learn at their own pace without cognitive fatigue.

---


## 🛠️ Production Tech Stack

Noggin is built using a modern, scalable, and highly performant split architecture:

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend & App Interface** | Next.js (React) + TypeScript | Creates a modern, sensory-overload-free UI for neurodivergent students. |
| **Database & Auth Engine** | Supabase / PostgreSQL | Structured relational schema logging student baselines and active `PerformanceLogs`. |
| **AI Orchestration Layer** | Python Serverless Scripts| Low-cost, highly optimized prompt mechanics powering Noggimigo's custom tuning logic. |

---

## 🎯 Core Features

*   🔒 **AI Assessment Gatekeeper:** A mandatory onboarding evaluation game that maps student baselines across speed, input accuracy, and error types before unlocking core content.
*   📈 **True Adaptive Pacing:** Automated micro-difficulty adjustments that scale based on live input tracking, response velocity, and error patterns.
*   🚫 **Zero Sensory Overload:** Fluid interface layout transforms that actively minimize cognitive strain, strip complex hovering actions, and eliminate flashing animations.
*   ♿ **WCAG-Compliant Engineering:** Native integration for high-contrast color matrices, screen-reader accessibility hooks, and single-tap text-to-speech toggles.
*   📱 **Touchscreen Optimized Layouts:** Large interactive click and touch targets (minimum 80px) designed natively to accommodate motor challenges on standard classroom tablets.

---

## 🔄 The Adaptive Workflow

```text
 [1. Gatekeeper]      ➔      [2. Profiling]       ➔    [3. Database Sync]    ➔    [4. Tailored Delivery]
Onboarding assessment       Tracks response speeds,     Metrics populate the       Lessons unlock with fully
game maps student           input errors, and sensory   student's unique database  individualized learning paths
core abilities.             triggers dynamically.       profile schema.            and dynamic AI tracking.
```

---

## 🚀 Quick Start for Developers

Get your local development environment up and running in under five minutes.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   A local Python 3.10+ environment (for the Noggimigo module)

### Installation
```bash
# Clone the repository
git clone https://github.com/FolatheDuckofDuckingburg/Noggin.git

# Enter the project directory
cd Noggin

# Install production dependencies
npm install

# Spin up the local development server
npm run dev
```

---

## 🤝 Join the Mission

We are actively seeking developers, instructional designers, and special education teachers to expand Noggin's impact.

*   💡 **Teachers & Educators:** Request specific lesson templates, suggest interface enhancements, or flag gaps via our GitHub Issues tracker.
*   💻 **Open Source Developers:** Look through our codebase repository tags for bugs, Tailwind configuration refinements, or Supabase schema optimizations.

---
## Contributors

Thanks to all contributors:

<!-- contributors:start -->

<a href="https://github.com/FolatheDuckofDuckingburg"><img src="https://avatars.githubusercontent.com/u/268987568?v=4&size=48" width="48" height="48" alt="FolatheDuckofDuckingburg"></a> <a href="https://github.com/FolatheDuckofDuckingburg">

## 📄 License

Distributed entirely under the MIT License. See `LICENSE` for the complete legal text.
