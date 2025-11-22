FROM php:8.5-fpm-alpine AS base

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
RUN apk add \
    git curl zip unzip libpng-dev oniguruma-dev libxml2-dev libpq-dev linux-headers icu-dev
# Install PHP extensions
RUN docker-php-ext-install mbstring exif pcntl bcmath sockets pdo pdo_mysql intl

# Copy PHP config files
COPY docker/php/conf.d/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY docker/php/conf.d/realpath.ini /usr/local/etc/php/conf.d/realpath.ini
COPY docker/php/conf.d/fpm.conf  /usr/local/etc/php-fpm.d/zz-docker.conf


# =========================================
# 🧰 Dev stage — mounts local code
# =========================================
FROM base AS dev
# Set environment (overridden at runtime by Docker Compose)
ENV APP_ENV=dev
ENV APP_DEBUG=1

# Install Composer (for local dev)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer


FROM base AS prod
# Set environment (overridden at runtime by Docker Compose)
ENV APP_ENV=prod
ENV APP_DEBUG=0

# Copy Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy project files
COPY ./backend .

# Install production dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --no-progress \
 && php bin/console cache:clear --env=prod

RUN php bin/console cache:clear --env=prod --no-debug
RUN php bin/console cache:warmup --env=prod

# Set proper permissions for cache/logs
RUN chown -R www-data:www-data var
