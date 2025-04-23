FROM python
WORKDIR /backend
COPY requ.txt /backend/
RUN pip install -r requ.txt
COPY . /backend/
EXPOSE  8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]