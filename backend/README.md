# Noggimigo API

This FastAPI adapter exposes the upstream deterministic Noggimigo session runtime to the Noggin React application.

## Local development

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload --port 8000
```

The default runtime is deterministic and does not download model weights. To opt into local model-generated tutoring language, install `backend/requirements-local-model.txt` and set `NOGGIMIGO_ENABLE_LOCAL_MODEL=1`.

Sessions are process-local and ephemeral. Do not send names, school identifiers, or sensitive learner information. See the root README for frontend setup and environment variables.
