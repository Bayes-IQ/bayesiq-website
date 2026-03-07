FROM python:3.12-slim

WORKDIR /app

# Install audit kit dependencies first (cacheable layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy audit kit source
COPY bayesiq-data-audit-kit/ /app/bayesiq-data-audit-kit/

# Copy server
COPY main.py .

ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
