<?php
/**
 * Core plugin functionality.
 *
 * @package PrimaryCategoryPlugin
 */

namespace PrimaryCategoryPlugin\Filters;

/**
 * Adds all registered filters.
 *
 * @return void
 */
function add_filters() {
	$n = function( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// Register primary category meta key.
	add_action( 'init', $n( 'register_all_primary_term_post_meta' ), 10, 0 );
}


/**
 * Register primary category meta key for use in the Gutenberg editor.
 *
 * @param string $post_type Optional. The post type to register the meta key for. Default 'post'.
 * @param string $taxonomy Optional. The taxonomy name to register a meta key for. Default 'category'.
 * @return boolean True if the meta key was successfully registered, false if not.
 */
function register_primary_term_meta( string $post_type = 'post', string $taxonomy = 'category' ) : bool {
	return register_post_meta(
		$post_type,
		'pcp_primary_' . $taxonomy . '_id',
		array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'integer',
		)
	);
}


/**
 * Register primary category meta keys for all valid taxonomies.
 *
 * @return void
 */
function register_all_primary_term_post_meta() {
	$taxonomies = get_taxonomies(
		array(
			'public' => true,
		)
	);

	// Bail early - no (public) taxonomies found.
	if ( ! is_array( $taxonomies ) || empty( $taxonomies ) ) {
		return;
	}

	// Register each taxonomy term meta (for posts only).
	foreach ( $taxonomies as $taxonomy ) {
		register_primary_term_meta( 'post', $taxonomy );
	}
}
