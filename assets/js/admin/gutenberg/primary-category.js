const { __ } = wp.i18n;
const { createElement: el, Fragment } = wp.element;
const { SelectControl, PanelRow } = wp.components;
const { withSelect, withDispatch } = wp.data;


/**
 * Maps meta values into props passed to Primary Category dropdown component.
 *
 * @param {Object} select
 */
const mapSelectToProps = ( select ) => {
	const coreEditorMeta = select( 'core/editor' ).getEditedPostAttribute( 'meta' );
	return { primaryCategory: coreEditorMeta[ 'pcp_primary_category_id' ] }; // eslint-disable-line camelcase
};

/**
 * Maps update functions into props passed to Primary Category dropdown component.
 *
 * @param {Object} dispatch
 */
const mapDispatchToProps = ( dispatch ) => {
	return {
		setMetaFieldValue: ( value ) => {
			dispatch( 'core/editor' ).editPost(
				{ meta: { pcp_primary_category_id: parseInt( value ) } } // eslint-disable-line camelcase
			);
		}
	};
};


/**
 * Creates a dropdown menu from a list of taxonomy term IDs.
 *
 * @param {Objects} props A props object.
 *
 * @return {Object} The dropdown menu element.
 */
const getPrimaryCategoryDropdown = ( props ) => {
	const {
		terms,
		primaryCategory
	} = props;

	return el(
		SelectControl,
		{
			label: __( 'Primary Category' ),
			options: getTermOptions( terms ),
			value: primaryCategory,
			onChange: ( newValue ) => {
				props.setMetaFieldValue( newValue );
			}
		}
	);
};

// Defines Primary Category dropdown with metadata mapped in.
const PrimaryCategoryDropdownWithData = withSelect( mapSelectToProps )( getPrimaryCategoryDropdown );

// Defines Primary Category dropdown with metadata & dispatch actions mapped in.
const PrimaryCategoryDropdownWithDataAndActions = withDispatch( mapDispatchToProps )( PrimaryCategoryDropdownWithData );

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
			el(
				PanelRow,
				{},
				el(
					PrimaryCategoryDropdownWithDataAndActions,
					props
				)
			)
		);
	};
};

wp.hooks.addFilter(
	'editor.PostTaxonomyType',
	'primary-category-plugin',
	addPrimaryCategoryDropdownUI
);
