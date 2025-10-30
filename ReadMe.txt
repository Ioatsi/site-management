This is a decoupled CRUD assignement for Victus by Ioannis Tsilikas. 
This project includes a Laravel backend and Angular frontend.
I have already placed the Angular build files in the public Laravel folder.
In order to run the project do the following:

cd backend

Create a .env file in the backend folder(you can use the .env.example file) and set the database credentials
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_username
    DB_PASSWORD=your_password

composer install
php artisan migrate
php artisan serve

Open a browser and go to http://localhost:8000/index.html