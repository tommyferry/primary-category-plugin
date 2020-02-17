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

	$taxonomies = get_taxonomies( $args );

	/**
	 * Filter the list of taxonomies
	 *
	 * @hook pcp_primary_term_taxonomies
	 *
	 * @param {string[]} An array of taxonomy names that will be given a primary term.
	 *
	 * @return {string[]} The filtered list of taxonomy names.
	 */
	return apply_filters( 'pcp_primary_term_taxonomies', $taxonomies );
}
