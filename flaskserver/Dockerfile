FROM python:3.7-slim
WORKDIR /flaskserver

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install six==1.11.0 scikit-learn==0.22.2.post1

CMD gunicorn --bind 0.0.0.0:5000 --reload --access-logfile - app:app