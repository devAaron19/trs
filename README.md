## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **PHP** >= 8.1
- **Composer** (latest version)
- **Node.js** >= 16.x
- **npm** or **yarn**
- **MySQL** or **PostgreSQL**
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/your-project-name.git](https://github.com/devAaron19/trs.git)
cd trs
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the environment file and configure your settings:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

### 5. Database Configuration

Update your `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 6. Database Migration

Run the database migrations:

```bash
php artisan migrate
```

Optionally, seed the database with sample data:

```bash
php artisan db:seed
```

## Development

### Running the Application

Start the Laravel development server:

```bash
php artisan serve
```

In a separate terminal, compile and watch for Vue.js changes:

```bash
npm run dev
```

Your application will be available at `http://localhost:8000`

### Building for Production

To build assets for production:

```bash
npm run build
```

## Additional Artisan Commands

### Cache Management

Clear application cache:
```bash
php artisan cache:clear
```

Clear configuration cache:
```bash
php artisan config:clear
```

Clear route cache:
```bash
php artisan route:clear
```

Clear view cache:
```bash
php artisan view:clear
```

### Database Commands

Reset and re-run all migrations:
```bash
php artisan migrate:refresh
```

Reset database and run seeders:
```bash
php artisan migrate:refresh --seed
```

Create a new migration:
```bash
php artisan make:migration create_table_name
```

Create a new model:
```bash
php artisan make:model ModelName -m
```

## Project Structure

```
├── app/                    # Laravel application code
├── bootstrap/              # Application bootstrap files
├── config/                 # Configuration files
├── database/               # Database migrations and seeders
├── public/                 # Public assets and entry point
├── resources/
│   ├── js/                 # Vue.js components and JavaScript
│   ├── css/                # Stylesheets
│   └── views/              # Blade templates
├── routes/                 # Application routes
├── storage/                # Application storage
├── tests/                  # Test files
├── vendor/                 # Composer dependencies
├── node_modules/           # NPM dependencies
├── .env                    # Environment variables
├── composer.json           # PHP dependencies
├── package.json            # JavaScript dependencies
└── vite.config.js          # Vite configuration
```

## Common Issues and Solutions

### Permission Issues

If you encounter permission issues with storage or cache directories:

```bash
sudo chown -R $USER:www-data storage
sudo chown -R $USER:www-data bootstrap/cache
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### Node.js Version Issues

If you encounter Node.js compatibility issues, consider using Node Version Manager (nvm):

```bash
nvm install 23
nvm use 23
```

**Happy coding! 🚀**
