# Calculator

A clean, responsive, and tactile basic calculator built with React 19, TypeScript, Tailwind CSS, and Motion.

## Features

- **Standard Arithmetic Operations**: Addition (`+`), Subtraction (`−`), Multiplication (`×`), and Division (`÷`).
- **Utility Functions**: Percentage calculation (`%`), sign inversion (`±`), backspace delete, and all-clear (`AC`).
- **Dynamic Display**:
  - Live expression formula preview (e.g. `12.5 × 4 =`).
  - Automatic font downscaling for large values to maintain visibility.
  - One-click copy to clipboard with instant visual feedback.
  - Floating-point inaccuracy normalization and safe division-by-zero handling.
- **Calculation Tape**: Toggleable history drawer displaying past calculations with one-tap result recall.
- **Keyboard & Numpad Support**: Full desktop navigation mapped to standard keys.
- **Audio Feedback**: Subtle, non-intrusive acoustic click synth powered by the Web Audio API (with toggle switch).

## Keyboard Shortcuts

| Key / Shortcut | Action |
| --- | --- |
| `0` – `9` | Input digits |
| `.` or `,` | Decimal point |
| `+`, `-`, `*`, `/` | Binary operators (`+`, `−`, `×`, `÷`) |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape` or `C` | All Clear (`AC`) |
| `%` | Percentage |

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Bundler & Dev Server**: [Vite](https://vite.dev/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the local development server on port 3000:

```bash
npm run dev
```

### Build

Compile the production bundle:

```bash
npm run build
```

## License

Apache-2.0
