<?php
/**
 * Plugin Name: Primary Category Plugin
 * Plugin URI:  https://example.com
 * Description: Adds the ability to set a primary category for posts.
 * Version:     1.0.0
 * Author:      Tommy Ferry
 * Author URI:  https://example.com
 * Text Domain: primary-category-plugin
 * Domain Path: /languages
 *
 * @package PrimaryCategoryPlugin
 */

// Useful global constants.
define( 'PRIMARY_CATEGORY_PLUGIN_VERSION', '1.0.0' );
define( 'PRIMARY_CATEGORY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'PRIMARY_CATEGORY_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'PRIMARY_CATEGORY_PLUGIN_INC', PRIMARY_CATEGORY_PLUGIN_PATH . 'includes/' );

// Include files.
require_once PRIMARY_CATEGORY_PLUGIN_INC . 'functions/utils.php';
require_once PRIMARY_CATEGORY_PLUGIN_INC . 'functions/core.php';
require_once PRIMARY_CATEGORY_PLUGIN_INC . 'functions/filters.php';

// Activation/Deactivation.
register_activation_hook( __FILE__, '\PrimaryCategoryPlugin\Core\activate' );
register_deactivation_hook( __FILE__, '\PrimaryCategoryPlugin\Core\deactivate' );

// Bootstrap.
PrimaryCategoryPlugin\Core\setup();
PrimaryCategoryPlugin\Filters\add_filters();

// Require Composer autoloader if it exists.
if ( file_exists( PRIMARY_CATEGORY_PLUGIN_PATH . '/vendor/autoload.php' ) ) {
	require_once PRIMARY_CATEGORY_PLUGIN_PATH . 'vendor/autoload.php';
}
