# Mobile Responsiveness Analysis (R4) — Questão Certeira Interativo

This document analyzes the current state of mobile responsiveness for selected React components and page routes. The goal is to ensure a fluid experience on small screen sizes (down to 320px width), with optimal readability, touch target sizes, layout safety (no content overlapping or clipping), and mobile-optimized interactions.

---

## 1. Component Investigation & Findings

### 1.1. Mission Map (`src/components/mission/MissionMap.tsx` & `src/components/mission/MissionCard.tsx`)

#### Findings in `MissionMap.tsx`:
* **Student & Progress Box (Lines 39-54):**
  * Uses a flex layout `flex items-center justify-between` to place the student details ("Estudante" + `session.displayName`) next to the overall progress ("Progresso geral" + percentage).
  * If the student has a long name, this container will overflow horizontally on narrow mobile screens (320px–360px), pushing the progress percentage off-screen or causing overlap.
  * *Recommendation:* Apply `min-w-0` to the student text wrapper, `truncate` to the `session.displayName` paragraph, and set a responsive max-width.
* **Diagnostic Call-to-Action (Lines 61-80):**
  * The buttons wrapper uses `flex gap-3 flex-wrap`.
  * On narrow viewports, the buttons wrap but maintain their content-fitting width (`px-4 py-2.5`). On mobile, full-width block buttons (`w-full text-center sm:w-auto`) provide much better tap targets and look cleaner when stacked.
  * *Recommendation:* Add `w-full text-center sm:w-auto` classes to the Link and Span button elements.

#### Findings in `MissionCard.tsx`:
* **Card Header Layout (Lines 60-71):**
  * Uses `flex items-start justify-between gap-2` containing the title/goal column and the status badge.
  * On small screens, the badge (`flex-shrink-0`) squashes the title column, leaving very little space for mission names and goals, which causes aggressive text wrapping and looks cluttered.
  * *Recommendation:* Use a responsive flex-direction `flex-col sm:flex-row sm:items-start` with smaller gaps on mobile, and apply `self-start sm:self-auto` to the badge to wrap it to a new line on mobile while keeping it side-by-side on desktop/tablets.

---

### 1.2. Multiple Choice Questions (`src/components/quiz/MultipleChoiceQuestion.tsx`)

#### Findings:
* **Touch Target Size & Accessibility:**
  * Option buttons use `p-4` with `flex items-start gap-3`. This yields a touch height of at least 56px (greater than the standard 48px mobile touch minimum), which is excellent.
  * The options do not currently provide physical touch-down scale feedback on mobile. Adding `active:scale-[0.99] transition-all` will make selection feel more organic.
  * Keyboard navigation and screen-readers lack clear focus states. Adding `focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:outline-none` improves accessibility.
  * Fast tapping on options on mobile can trigger native text selection on the option text. Adding `select-none` prevents accidental selection.
  * *Recommendation:* Enhance option button classes with active states, focus outlines, and prevent text selection.

---

### 1.3. Numeric Questions (`src/components/quiz/NumericQuestion.tsx`)

#### Findings:
* **`inputMode="decimal"` Implementation:**
  * The input element on line 75 already has `inputMode="decimal"` correctly defined:
    ```tsx
    75:         <input
    76:           type="text"
    77:           inputMode="decimal"
    ...
    ```
  * This is correct and correctly prompts mobile browsers (iOS/Android) to open the numeric virtual keyboard with decimal capabilities (comma/dot).
  * *Recommendation:* Confirm that `inputMode="decimal"` is already present. For further mobile polish, we can suggest improving input safety by filtering out non-numeric and non-decimal-separator characters during typed input to prevent keyboard discrepancies.

---

### 1.4. Reports Page & Header (`src/components/reports/StudentReport.tsx`, `src/components/layout/Header.tsx`)

#### Findings in `StudentReport.tsx`:
* **Summary Stats Row (Lines 49-62):**
  * Uses `grid grid-cols-3 gap-3 text-center` to display: Média geral, Missões concluídas, and Resultado.
  * Under 480px, each column has less than 100px of width. Long labels like "Missões concluídas" and status names (like "Precisa Melhorar") will wrap awkwardly, truncate, or cause vertical layout blowouts.
  * *Recommendation:* Apply a responsive gap (`gap-2 sm:gap-3`), responsive padding (`p-2 sm:p-3`), smaller/responsive text sizes (`text-xl sm:text-2xl` for numbers, `text-[10px] sm:text-xs` for labels), and add `truncate` to the `label` element.
* **Mission List Items (Lines 87-105):**
  * Displays mission titles and status badges using `flex items-start justify-between gap-2`.
  * Similar to `MissionCard.tsx`, long mission names will be squished on mobile by the status badge.
  * *Recommendation:* Use a responsive layout `flex flex-col sm:flex-row sm:items-start` and align the badge using `self-start sm:self-auto`.

#### Findings in `Header.tsx`:
* **Header Bar Layout (Lines 15-27):**
  * Displays the app logo and student session details side-by-side using `flex items-center justify-between`.
  * If the student name is long (e.g. "Luiz Gustavo da Silva Santos"), it will run into the logo on small screens.
  * *Recommendation:* Add `min-w-0 ml-4` to the student session text wrapper, and add `truncate max-w-[140px] sm:max-w-[240px]` to the displayName paragraph to truncate the name safely on mobile.
