FROM python:3.12-slim

WORKDIR /app

# Install server dependencies first (cacheable layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy audit kit source and install its deps
COPY bayesiq-data-audit-kit/ /app/bayesiq-data-audit-kit/
RUN if [ -f /app/bayesiq-data-audit-kit/requirements.txt ]; then \
      pip install --no-cache-dir -r /app/bayesiq-data-audit-kit/requirements.txt; \
    fi

# Copy server
COPY main.py .

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
