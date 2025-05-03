FROM python:3.13-slim AS builder

RUN mkdir /app

WORKDIR /app

# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1 

RUN pip install --upgrade pip

COPY requ.txt /app/

RUN pip install -r requ.txt

FROM python:3.13-slim

# RUN useradd -m -r -D appuser && \
#    mkdir /app && \
#    chown -R appuser /app

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

WORKDIR /app
 
# Copy application code
COPY --chown=appuser:appuser . .

# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1 

# USER appuser

EXPOSE 8000


RUN ["python", "manage.py", "makemigrations", "background_task"]



RUN ["python", "manage.py", "createcachetable"]

RUN ["python", "manage.py", "migrate"]

CMD python manage.py process_tasks & gunicorn --preload --bind 0.0.0.0:8000 backend.wsgi:application 
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]