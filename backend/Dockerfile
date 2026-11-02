# Base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install Flask directly
RUN pip install --no-cache-dir flask flask-cors psycopg2-binary

# Copy application files
COPY . .

# Expose Flask port
EXPOSE 5000

# Start Flask
CMD ["python", "app.py"]
