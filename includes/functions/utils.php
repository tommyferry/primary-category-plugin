<?php
/**
 * Utility functions.
 *
 * @package PrimaryCategoryPlugin
 */

namespace PrimaryCategoryPlugin\Utils;

/**
 * Retrieves the names of all taxonomies that can have a primary term set.
 *
 * @return string[] An array of taxonomy names.
 */
function get_primary_term_taxonomies() {
	$args = array(
		'public' => true,
	);

	return get_taxonomies( $args );
}
