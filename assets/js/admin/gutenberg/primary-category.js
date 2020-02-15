const { __ } = wp.i18n;
const { createElement: el, Fragment } = wp.element;
const { SelectControl, PanelRow } = wp.components;

/**
 * Creates a dropdown menu from a list of taxonomy term IDs.
 *
 * @param {number[]} terms An array of taxonomy term IDs.
 *
 * @return {Object} The dropdown menu element.
 */
const getPrimaryCategoryDropdown = ( terms ) => {
	return el(
		SelectControl,
		{
			label: __( 'Primary Category' ),
			options: getTermOptions( terms ),
			// value: primaryTerm, // TODO: Handle value changes.
			onChange: ( content ) => {
				console.log( 'content changed to ', content );
			}
		}
	);
};


/**
 * Creates options array for a SelectControl. Includes an initial default object.
 *
 * @link: https://developer.wordpress.org/block-editor/components/select-control/
 *
 * @param {number[]} terms An array of taxonomy term IDs.
 *
 * @return {Object[]} An array of option objects.
 */
const getTermOptions = ( terms ) => {
	const termObjects = terms.map( term => {
		return { value: term, label: term };
	} );

	return [
		{ value: null, label: __( 'Primary Category' ), disabled: true },
		...termObjects
	];
};


/**
 * Adds a Primary Category dropdown selector to the default Gutenberg category UI.
 *
 * @param {Object} OriginalComponent The original Gutenberg category UI component.
 */
const addPrimaryCategoryDropdownUI = ( OriginalComponent ) => {
	return ( props ) => {
		// Focus on categories for now.
		if ( 'category' !== props.slug ) {
			return el(
				OriginalComponent,
				props
			);
		}

		return el(
			Fragment,
			{},
			el( OriginalComponent, props ),
			el( PanelRow, {}, getPrimaryCategoryDropdown( props.terms ) )
		);
	};
};

wp.hooks.addFilter(
	'editor.PostTaxonomyType',
	'primary-category-plugin',
	addPrimaryCategoryDropdownUI
);
