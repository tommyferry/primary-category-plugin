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
		'public'   => true,
		'_builtin' => true,
	);

	/**
	 * Filter the arguments used to get taxonomies that can have a primary term.
	 *
	 * See {@link: https://developer.wordpress.org/reference/functions/get_taxonomies/}
	 *
	 * @hook pcp_primary_term_taxonomy_args
	 *
	 * @param {array} An array of arguments (as used by get_taxonomies).
	 *
	 * @return {array} The filtered arguments array.
	 */
	$taxonomies = get_taxonomies( apply_filters( 'pcp_primary_term_taxonomies_args', $args ) );

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
