ImpactLens – Contribution Intelligence Platform
ImpactLens is an AI-assisted platform that evaluates work based on actual impact rather than activity-based metrics. It integrates GitHub development data, manual work inputs, and AI-driven analysis to provide fair performance visibility across technical and operational roles.

Problem Statement:
Traditional metrics such as commit count and lines of code often misrepresent real contribution value. High-impact work can go unnoticed, while low-value activity appears productive. ImpactLens addresses this by combining code metadata analysis with AI-assisted insights.

Key Features:
   -> GitHub REST API integration for fetching commit metadata
   -> AI-assisted analysis using Gemini API to identify high-impact work
   -> Support for technical and non-technical contributions
   -> Attendance and manual work reporting
   -> Impact vs Visibility data visualization
   -> Role-based dashboards

System Overview:
The system links teams to a GitHub repository, collects contribution data through APIs and manual inputs, analyzes commit context using AI, and visualizes insights through interactive charts.

Tech Stack:
   Frontend: React.js, Tailwind CSS
   APIs: GitHub REST API, Google Gemini API
   Visualization: Recharts
   Networking: Axios
   Storage: MySQL

Limitations:
   -> Limited to GitHub as the data source
   -> LocalStorage-based persistence
   -> AI analysis restricted to commit metadata

Future Scope:
   -> Full pull request and source code analysis
   -> Integration with project management tools
   -> Cloud-based backend support
