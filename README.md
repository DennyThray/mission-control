# 🚀 Mission Control – React Todo App

**Mission Control** is a fully functional React todo application designed and built in under two hours. It implements all core requirements of the _React Todo App with Filtering and Sorting_ challenge — and goes further with thoughtful UX, keyboard shortcuts, and a sharp visual design.

---

## ✅ Features Completed

### 📝 Todo Management

- Add todos with:
  - Title
  - Priority (Low, Medium, High)
  - Optional due date
- Mark todos as completed or undo them
- Edit existing todos
- Delete todos

### 🔍 Filtering & Sorting

- Filter by **status**: All, Active, Completed
- Filter by **priority** level
- Sort by:
  - Priority (High → Low, then due soonest)
  - Creation date (newest first)

### 📊 Statistics Summary

- Total todos
- Count of active and completed todos
- Highlights the highest priority active todo

---

## 🧠 Technical Overview

- **React Hooks**: Built entirely with `useState` and `useEffect`
- **Componentized Structure**:
  - `TodoForm` – Form for creating and editing todos
  - `TodoList` – List of todos with edit/delete controls
  - `TodoStats` – Summary of todo counts and top priority item
- **Custom Keyboard Shortcuts**:
  - Press `A` to focus the add input
  - Press `F` to toggle between active/all
  - Press `P` to switch sort mode

---

## 💅 Styling & UX

- Tailwind CSS-based modern UI
- Responsive design for mobile and desktop
- Visual priority indicators with color-coding
- Date picker using `datetime-local` input
- "Mission Control" branding with polished layout

---

## 📁 Run Locally

```bash
npm install
npm start
```

Then visit <http://localhost:5173>
