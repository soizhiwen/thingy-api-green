su -
apt -y install nginx

systemctl status nginx

mkdir -p /var/www/soizhiwen.com/html
chown -R $USER:$USER /var/www/soizhiwen.com/html
chmod -R 755 /var/www/soizhiwen.com

nano /var/www/soizhiwen.com/html/index.html
: '
<html>
    <head>
        <title>Welcome to your_domain</title>
    </head>
    <body>
        <h1>Success! Your Nginx server is successfully configured for <em>your_domain</em>. </h1>
<p>This is a sample page.</p>
    </body>
</html>
'


nano /etc/nginx/sites-available/soizhiwen.com
: '
server {
        listen 80;
        listen [::]:80;

        root /var/www/soizhiwen.com/html;
        index index.html index.htm index.nginx-debian.html;

        server_name soizhiwen.com www.soizhiwen.com;

        location / {
                try_files $uri $uri/ /index.html;
        }

        location /api/ {
                proxy_pass http://localhost:8080/;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}
'

rm /etc/nginx/sites-enabled/soizhiwen.com

ln -s /etc/nginx/sites-available/soizhiwen.com /etc/nginx/sites-enabled/

nano /etc/nginx/nginx.conf
: '
http {
    ...
    server_names_hash_bucket_size 64;
    ...
}
'

nginx -t

systemctl restart nginx
