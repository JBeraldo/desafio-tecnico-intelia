FROM php:8.4.8-fpm AS base

WORKDIR /var/www

# Environment configuration
ENV PHP_OPCACHE_ENABLE="0" \
    PHP_OPCACHE_VALIDATE_TIMESTAMPS="0" \
    PHP_OPCACHE_MAX_ACCELERATED_FILES="10000" \
    PHP_OPCACHE_MEMORY_CONSUMPTION="192" \
    PHP_OPCACHE_MAX_WASTED_PERCENTAGE="10" \
    PHP_OPCACHE_JIT_BUFFER_SIZE="0" \
    PHP_OPCACHE_JIT="0"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libpq-dev \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install mbstring exif pcntl bcmath sockets opcache pdo pdo_pgsql

# Copy PHP config files
COPY docker/php/conf.d/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY docker/php/conf.d/realpath.ini /usr/local/etc/php/conf.d/realpath.ini


# =========================================
# 🧰 Dev stage — mounts local code
# =========================================
FROM base AS dev

# Install Composer (for local dev)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer


FROM base AS prod

# Copy Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy project files
COPY ./backend .

# Install production dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress \
 && php bin/console cache:clear --env=prod

# Set proper permissions for cache/logs
RUN chown -R www-data:www-data var