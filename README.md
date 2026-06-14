<div align="center">

  # Weather Dashboard

  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![Open-Meteo](https://img.shields.io/badge/Open--Meteo_API-0EA5E9?style=flat-square&logo=cloud&logoColor=white)](https://open-meteo.com/)

  **Real-time weather for any city on Earth — no API key, no sign-up, completely free.**

  </div>

  ---

  ## Features

  - **Global search** — any city via Open-Meteo Geocoding API
  - **Current conditions** — temperature, feels-like, humidity, wind speed, visibility
  - **7-day forecast** — daily min/max, weather condition, precipitation
  - **Dynamic background** — gradient changes to match weather condition
  - **Zero config** — no environment variables or API keys required

  ## Getting Started

  ```bash
  npm install && npm run dev
  ```

  ## APIs Used

  | API | Purpose | Cost |
  |-----|---------|------|
  | [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City name → coordinates | Free |
  | [Open-Meteo Forecast](https://open-meteo.com/en/docs) | Weather data | Free |

  Both APIs are open, CORS-enabled, and require no authentication.

  ## Weather Code Mapping

  Open-Meteo uses WMO weather codes (0–99). The app maps these to human-readable conditions and matching emoji/gradient themes.

  ---

  <div align="center">Made with TypeScript · Part of my <a href="https://github.com/9bzero">developer portfolio</a></div>
  