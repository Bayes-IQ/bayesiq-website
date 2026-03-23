FROM python:3.12-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*

# Clone audit kit from private GitHub repo
ARG GITHUB_TOKEN
RUN git clone --depth 1 \
    https://x-access-token:${GITHUB_TOKEN}@github.com/Bayes-IQ/bayesiq-data-audit-kit.git \
    /tmp/audit-kit && \
    mkdir -p /app/bayesiq-data-audit-kit && \
    cp -r /tmp/audit-kit/audit /tmp/audit-kit/requirements.txt /tmp/audit-kit/config /tmp/audit-kit/templates /tmp/audit-kit/manifests /tmp/audit-kit/verticals /app/bayesiq-data-audit-kit/ 2>/dev/null; \
    rm -rf /tmp/audit-kit

# --- Final stage (no git, no token) ---
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --from=builder /app/bayesiq-data-audit-kit /app/bayesiq-data-audit-kit
RUN if [ -f /app/bayesiq-data-audit-kit/requirements.txt ]; then \
      pip install --no-cache-dir -r /app/bayesiq-data-audit-kit/requirements.txt; \
    fi

COPY main.py .

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
