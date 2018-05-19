# Prevago
---

1. Install apache2
``` sudo apt-get install apache2```
2. Install php7.1
```
sudo apt-get install python-software-properties
sudo add-apt-repository ppa:ondrej/php
# update apt-get
sudo apt-get update
sudo apt-get install -y php7.1
php –version
```
3. Install Requirments
```
# install modules
sudo apt-cache search php7*
sudo apt-get install php7.1-mysql php7.1-gd php7.1-curl php7.1-json php7.1-cgi php7.1-uuid php7.1-mcrypt php7.1-mcrypt php7.1-zip php7.1-xml php7.1-mbstring openssl php-common
```
4. Install Composer [link](https://getcomposer.org/download/)
```
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/local/bin/composer
```
5. Install Laravel by composer
```
composer global require "laravel/installer" 
```
**Make sure to place the $HOME/.composer/vendor/bin directory (or the equivalent directory for your OS) in your $PATH so the laravel executable can be located by your system.**

In my case: 

```export PATH=$PATH:$HOME/.config/composer/vendor/bin```

6. Install [mysql](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-14-04)
If you have no particular needs, just install by apt-get.
```
wget https://dev.mysql.com/get/mysql-apt-config_0.8.10-1_all.deb
sudo dpkg -i mysql-apt-config_0.6.0-1_all.deb
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
mysql --version
```

7. Install [phpmyadmin](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-phpmyadmin-on-ubuntu-16-04)
```
sudo apt-get update
sudo apt-get install phpmyadmin php-mbstring php-gettext
```
**Warning: When the first prompt appears, apache2 is highlighted, but not selected. If you do not hit Space to select Apache, the installer will not move the necessary files during installation. Hit Space, Tab, and then Enter to select Apache.**

**Enable mcrypt and mbstring**
```
sudo phpenmod mcrypt
sudo phpenmod mbstring
```

8. Permission issues
Make sure public, storage, bootstrap/cache is open and writable by laravel.

9. Configuration
```php artisan key:generate```

10. Setup .env
change your database type, user name, and password to your own.


Ref:
[laravel](https://laravel.com/docs/5.3)
[composer](https://getcomposer.org/doc/00-intro.md)
