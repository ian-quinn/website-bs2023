[![wakatime](https://wakatime.com/badge/user/b04d35f7-79c6-4b67-9dd8-73bd60f22c2f/project/014e5d44-6447-447b-a840-532c1566a863.svg)](https://wakatime.com/badge/user/b04d35f7-79c6-4b67-9dd8-73bd60f22c2f/project/014e5d44-6447-447b-a840-532c1566a863)

Backup repository for the bs2023 website. Just recreate it in case that I am out of town.

```bash
$ yum -y install python3
$ yum -y install git supervisor nginx
$ cd /home
$ git clone https://github.com/ian-quinn/biscuit.git
$ cd biscuit
$ python3 -m venv venv
$ source venv/bin/activate
(venv) $ pip install -r requirements.txt
# check the environment by: flask run
(venv) $ flask db init
(venv) $ flask db migrate -m "init"
(venv) $ flask db upgrade
# check 127.0.0.1:5000 works smoothly
(venv) $ pip install gunicorn
(venv) $ deactivate
$ cp /home/biscuit/deployment/supervisor/biscuit.ini /etc/supervisord.d/biscuit.ini
$ cp /home/biscuit/deployment/nginx/biscuit.conf /etc/nginx/conf.d/biscuit.conf
# $ chmod o+w /etc/nginx/conf.d if you dont have accessibility
# make sure the path in .conf directs to right SSL certificate
# make sure the port 80 443 are not blocked by the firewalld, SeLinux, or your server provider
$ systemctl start supervisord
$ systemctl start nginx
```

Debug 
```bash
# keep nginx listening to the 8000 port
$ systemctl stop supervisord
$ cd /home/biscuit
$ source venv/bin/activate
# use the same command in supervisor settings .ini
$ gunicorn -b localhost:8000 -w 4 oven:app
# then play with bs2023.org and keep an eye on prompt
```


requirements.txt
```
Flask==2.1.1
Flask-Migrate==3.1.0
Flask-SQLAlchemy==2.5.1
Flask-WTF==1.0.1
Flask-Mail==0.9.1
python-dotenv==0.20.0
email-validator==1.1.3
```