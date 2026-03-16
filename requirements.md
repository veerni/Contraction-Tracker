# Bloom - Contraction Tracker: Mobile Implementation Requirements

## 1. Overview
Bloom is a privacy-focused, elegantly designed contraction tracker designed to support expectant mothers through labor. The mobile application (iOS/Android) must prioritize a soothing user experience, organic design language, and high-performance real-time tracking.

## 2. Design Principles
- **Organic Fluidity:** Use "Blob" shapes and non-geometric border radii (e.g., `42% 58% 70% 30% / 45% 45% 55% 55%`) for primary action buttons.
- **Calm UI:** High use of whitespace, soft typography, and subtle glassmorphism.
- **Micro-Interactions:** Continuous organic pulse animations for active states to encourage rhythmic breathing.
- **Privacy First:** All tracking data is stored locally (SQLite/Room/AsyncStorage). No PII is sent to the AI service except anonymous contraction patterns.

## 3. Color Specifications
| Element | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Primary (Brand)** | `#C88989` | `#C88989` |
| **Background** | `#FAFAFA` (Zinc-50) | `#000000` |
| **Surface (Cards)** | `#FFFFFF` | `#FFFFFF` (1.5% - 3% Opacity) |
| **Text Primary** | `#18181B` (Zinc-900) | `#FFFFFF` (90% Opacity) |
| **Text Secondary** | `#71717A` (Zinc-500) | `#FFFFFF` (40% Opacity) |
| **Text Tertiary** | `#D4D4D8` (Zinc-300) | `#FFFFFF` (15% Opacity) |
| **Border/Stroke** | `#E4E4E7` (Zinc-200) | `#FFFFFF` (6% Opacity) |
| **Glass Effect** | `White 90% + Blur` | `Zinc-900 80% + Blur` |

## 4. Typography
- **Display/Headings:** `Plus Jakarta Sans`, Extra Bold (`800`) or Semi Bold (`600`).
- **Body/System:** `Plus Jakarta Sans`, Medium/Regular.
- **Stats/Numbers:** `Plus Jakarta Sans` with `tabular-nums` enabled for stability.
- **Secondary Display:** `Quicksand` (for softer instruction labels).

---

## 5. User Stories & Functional Specs

### 1. Onboarding Screen
- **Visuals:** Centered organic blob animation (`pulse-slow`). Intro text with high-contrast emphasis on "exciting journey".
- **Interaction:** One-tap entry via "SIGNUP / LOGIN" or "SKIP" for guest mode.
- **Requirement:** Blob must smoothly transition scale between 1.0 and 1.05 using a 6-second organic keyframe animation.

### 2. Home Screen (Dashboard)
- **Header:** Fixed at top. Left: Hamburger menu. Center: "BLOOM" (mini-cap spacing 0.5em). Right: History icon.
- **Journey Progress:** Displays "Session Duration" if active, or "Ready to Track".
- **Timeline Card:** Prominent card to set/display "Weeks Along" or "Due Date".
- **Quick Stats:** Row of 3 items (Avg. Duration, Avg. Freq, Pattern). Pattern logic: "Regular" if last 3 events vary < 15s, else "Irregular".
- **Recent Events:** Scrollable list of last 3 contractions.
- **The "Start" Blob:** Fixed at the bottom center. Large organic shape. Background gradient glow.
- **UX Constraint:** Content must scroll *behind* the Start footer. The Start button must have a `z-index` higher than the main content area.

### 3. Tracking Screen (Active Session)
- **Audio Hub:** Mini-player at the top with "Music Note" pulse icon. Volume toggle.
- **The Timer:** Large, high-visibility tabular numbers.
- **Breathing Prompt:** Pulsating text ("Breathe with the pulse...") synchronized with the central Blob animation.
- **The "Stop" Blob:** Replaces Start button. High intensity `pulse-fast` animation.
- **Cancel Action:** Bordered button at bottom for "False Alarm" to discard data.

### 4. Summary Screen (Post-Event)
- **Data Review:** Duration and Gap (since last event) displayed in large type.
- **Intensity Slider:** 1-5 scale (Mild to Strong). UI accent color must be brand primary.
- **Notes Toggle:** Optional text field for symptoms (e.g., "Back pain", "Water broke").
- **AI Insights:** Fetch personalized advice from Gemini API based on the last 5 events + weeks along.
- **Behavior:** "Done" saves to local DB. "Mistake" resumes previous tracking session.

### 5. History Screen
- **Header:** Large title "History" with close button.
- **Session Summary Card:** Integrated at the top. Shows Avg. Duration, Avg. Freq, and Total Events for the current session.
- **Grouped List:** Contractions grouped by date (e.g., "OCTOBER 24, 2024").
- **Edit/Delete:** Each item has an edit button to update intensity or notes.
- **Visual:** Vertical line separators between stats to maintain grid clarity.

### 6. Profile & Settings
- **Identity:** Displays user name and pregnancy progress.
- **Theme Toggle:** Smooth switch between Light and Dark mode.
- **Premium Upsell:** Glassmorphic card highlighting "Emergency Contact" and "Live Partner Share".
- **Feedback:** Modal with 1-5 star rating (blob shape icons) and text area.

---

## 6. Core Logic & AI Integration
### Gemini API Advice Strategy
- **Input Payload:** `[Recent 5 Contractions]`, `[Weeks Along]`.
- **Logic:**
    - If Regular (approx 5/1/1 rule): Recommend hospital bag prep.
    - If Pre-term (<37 weeks): Urgent provider contact recommendation.
    - Else: Relaxation, hydration, and movement tips.
- **Safety:** Always include a medical disclaimer in the UI.

## 7. Navigation Flow
1. **App Start:** Splash -> Onboarding (if new) -> Home.
2. **Main Action:** Home -> Tracking -> Summary -> Home.
3. **Management:** Home -> History / Home -> Profile.
4. **Modals:** All secondary inputs (Setup, Edit, Feedback) should use "Slide-up" glassmorphic sheets with a backdrop blur.

## 8. Technical Requirements (Mobile)
- **Local Database:** SQLite or Room (Android) / CoreData (iOS).
- **Permissions:** `microphone` (Optional for breathing sound detection in future), `notifications` (For labor alerts).
- **Haptics:**
    - `ImpactHeavy` when starting/stopping.
    - `SelectionChange` on intensity slider.
- **Performance:** Timer must run in a foreground service (Android) or Background Task (iOS) to ensure accuracy if the app is minimized.

## 9. Analytics Events
- `session_start`: When the user hits the Start blob.
- `contraction_complete`: Triggered on "Done" in Summary screen.
- `ai_insight_generated`: When Gemini successfully returns advice.
- `theme_toggled`: Track preference for dark vs light.
- `premium_click`: Track interest in the paywall features.

## 10. Error Handling
- **Network Loss:** If Gemini fails, fallback to a local "Standard Reassurance" string.
- **Storage Full:** Graceful handling of DB write errors.
- **Validation:** Prevent saving of 0-second contractions.
