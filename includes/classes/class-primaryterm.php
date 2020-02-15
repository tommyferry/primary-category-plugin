<?php
/**
 * Primary Term class file.
 *
 * @package PrimaryCategoryPlugin
 */

namespace PrimaryCategoryPlugin;

/**
 * Class for handling a post's primary term.
 */
class PrimaryTerm {

	/**
	 * The Post ID.
	 *
	 * @var int
	 */
	protected $post_id;

	/**
	 * The Taxonomy Name.
	 *
	 * @var string
	 */
	protected $taxonomy_name;

	/**
	 * The post meta key to store the taxonomy ID against.
	 *
	 * @var string
	 */
	protected $meta_key;

	/**
	 * Constructor for a PrimaryTerm.
	 *
	 * @param int    $post_id The post ID.
	 * @param string $taxonomy_name The taxonomy name.
	 */
	public function __construct( int $post_id, string $taxonomy_name ) {
		$this->post_id       = $post_id;
		$this->taxonomy_name = $taxonomy_name;
		$this->meta_key      = 'pcp_primary_' . $taxonomy_name . '_id';
	}

	/**
	 * Get the ID of the post's primary term.
	 *
	 * @return integer The primary term ID.
	 */
	public function get_primary_term() : int {
		$primary_term_id = get_post_meta( $this->post_id, $this->meta_key, true );

		// Bail early - no term ID found.
		if ( empty( $primary_term_id ) ) {
			return 0;
		}

		return $primary_term_id;
	}

	/**
	 * Set the post's primary term, by term ID.
	 *
	 * @param integer $new_primary_term_id The new primary term ID.
	 *
	 * @return boolean True on successful update, false on failure.
	 */
	public function set_primary_term( int $new_primary_term_id ) : bool {
		return (bool) update_post_meta( $this->post_id, $this->meta_key, $new_primary_term_id );
	}
}
