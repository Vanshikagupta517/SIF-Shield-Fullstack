# SIF-SHIELD

SIF-SHIELD is an AI-powered industrial safety intelligence prototype for SIH26165 (OIL India). The current implementation connects the existing React/Vite UI to a Python/FastAPI analysis engine.

## Architecture

React frontend → `POST /analyze` → FastAPI → Groq NLP extraction (when configured) → deterministic risk engine + prototype safety rule base → JSON → existing Report Analysis UI.

The browser never receives the Groq API key.

## Project structure

```text
backend/
├── main.py
├── requirements.txt
├── .env
├── .env.example
├── services/
│   ├── analyzer.py
│   ├── risk_engine.py
│   └── rule_engine.py
└── data/
    └── safety_rules.json
src/
├── services/api.ts
└── views/ReportAnalysis.tsx
```

## Backend setup

From the project root:

```bash
cd backend
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and add your local Groq key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Health check: `http://localhost:8000/health`

## Frontend setup

Open a second terminal at the project root:

```bash
npm install
npm run dev
```

The frontend uses the Vite dev-server proxy by default:

```env
VITE_API_BASE_URL=/api
```

Vite forwards `/api/*` to the FastAPI server on `http://localhost:8000`, which also avoids mixed-content problems when the existing Vite UI is served over HTTPS on port 8443. You can override the value in a root `.env` when needed.

## API example

Request:

```json
{
  "report": "Worker entered a confined space without gas testing and permit verification."
}
```

Response contains the SIF flag, risk score/level, hazard, evidence, control gap, consequences, recommended actions, risk breakdown, and clearly labelled illustrative historical/trend data.

## How it works

1. The frontend sends the raw report to FastAPI.
2. Groq extracts structured safety facts when `GROQ_API_KEY` is configured.
3. If Groq is unavailable, a deterministic keyword fallback keeps the prototype usable locally.
4. The backend maps the report to the prototype safety rule base.
5. A transparent deterministic risk engine calculates a score from severity, control gaps, exposure, hazardous activity and illustrative recurrence.
6. The structured response is rendered by the existing Report Analysis UI.

Risk thresholds in this prototype are screening logic only and are not an OIL-validated methodology.

## Troubleshooting

### Backend connection error
Make sure FastAPI is running on port 8000 and that the frontend is using `http://localhost:8000`.

### CORS error
The backend allows the local Vite origins used by this project, including `localhost:8443`. If your Vite port changes, add that local origin to `backend/main.py`.

### Groq errors
Check that `GROQ_API_KEY` exists only in `backend/.env`. The application falls back to deterministic analysis if the Groq call fails.

## Demo reports

The existing UI keeps the three demo report texts for reliable SIH demonstration: Confined Space, Working at Height, and Electrical/LOTO. The important difference is that clicking **Analyse Report** now sends the selected text through the real FastAPI endpoint rather than selecting a hardcoded result.

## Still illustrative/mock

- Historical similar-report rows are representative prototype data.
- Recurrence trend data is representative prototype data.
- The safety rule JSON is a prototype knowledge base, not an official OIL policy database.
- No persistent database, authentication, batch processing, or production deployment is included yet.
