# NetUndo 📡

NetUndo is a community-driven web application designed to map and track real-world cellular network coverage across Kerala. Carrier maps often lie; NetUndo doesn't. Join the community in mapping true 5G zones, call drops, and total deadzones before you go off the grid.

## Features ✨

- **Interactive Live Map:** Explore a full coverage map of Kerala powered by Leaflet, displaying live community-reported signal data.
- **Community Reporting:** Found a deadzone or a blazing fast 5G spot? Drop a pin to help map out true connectivity.
- **Coverage Insights:** View signal strength (5G, 4G, 3G, 2G, Deadzone), carrier details, and user comments at a glance.
- **Location Search:** Quickly jump to specific cities or areas to check existing network data.
- **Premium UI:** A sleek, modern dark-mode aesthetic with smooth glassmorphism and animations.

## Tech Stack 🛠️

- **Frontend:** React, Vite, React Router
- **Map Integration:** Leaflet, React-Leaflet
- **Styling:** Vanilla CSS (Custom modern design system with CSS Variables)
- **Icons:** Lucide React
- **Backend / Database:** Supabase (PostgreSQL)

## Getting Started 🚀

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nijint/NetUndo.git
   cd NetUndo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Supabase keys (see `.env.example` for reference):
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to see the app in action!

## Contributing 🤝
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/nijint/NetUndo/issues).

## License 📝
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

---
Made with chaya ☕ by [nijint](https://github.com/nijint)
