
# 🚀 ImpactLens - Local Setup Instructions

Follow these steps to get the platform running on your local machine in under 2 minutes.

### 1. Prerequisites
- **Node.js** (v18 or higher) installed on your system.

### 2. Installation
1. Extract the ZIP file into a folder.
2. Open your terminal (Command Prompt, PowerShell, or Terminal) in that folder.
3. Run the following command to install the development server:
   ```bash
   npm install
   ```

### 3. Set your API Key
The app uses Google Gemini for code analysis. You need an API key from [Google AI Studio](https://aistudio.google.com/).
- **Option A (Temporary):** Open `vite.config.ts` and replace `'YOUR_API_KEY_HERE'` with your actual key.
- **Option B (Recommended):** Set an environment variable in your terminal before starting:
  ```bash
  # Windows (PowerShell)
  $env:API_KEY="your_key_here"; npm run dev
  
  # Mac/Linux
  export API_KEY="your_key_here" && npm run dev
  ```

### 4. Start the App
Run this command:
```bash
npm run dev
```
The app will automatically open in your browser at `http://localhost:5173`.

### 5. Demo Flow
1. **Login** as **Alice Director**.
2. **Create a Team**: Enter `facebook/react`.
3. **Map Users**: Ensure "Charlie Dev" has the GitHub username `charlie_code`.
4. **Login** as **Bob Manager**.
5. **Sync Data**: Click "Demo Data" to see the "Silent Architect" logic in action immediately!
