su -
apt -y install certbot python3-certbot-nginx

cat /etc/nginx/sites-available/soizhiwen.com | \
    grep server_name

certbot --nginx -d soizhiwen.com -d www.soizhiwen.com

systemctl status certbot.timer

certbot renew --dry-run
