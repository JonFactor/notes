FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /backend
COPY requ.txt /backend/
RUN pip install -r requ.txt
EXPOSE  8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]