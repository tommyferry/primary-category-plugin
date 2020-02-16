const { __ } = wp.i18n;
const { createElement: el, Fragment } = wp.element;
const { SelectControl, PanelRow } = wp.components;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;


/**
 * Creates a dropdown menu from provided props.
 *
 * @param {Objects} props A props object.
 *
 * @return {Object} The dropdown menu element.
 */
const getPrimaryCategoryDropdown = compose(
	withDispatch( ( dispatch, props ) => {
		return {
			setMetaFieldValue: ( value ) => {
				dispatch( 'core/editor' ).editPost(
					{ meta: { [ props.fieldName ]: parseInt( value ) } }
				);
			}
		};
	} ),
	withSelect( ( select, props ) => {
		const coreEditorMeta = select( 'core/editor' ).getEditedPostAttribute( 'meta' );
		return { primaryCategory: coreEditorMeta[ props.fieldName ] };
	} )
)( props => {
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
} );

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
 * Creates the Primary Category setting panel element.
 *
 * @param {Objects} props The props object.
 */
const getPrimaryCategoryPanel = ( props ) => {
	return el(
		PanelRow,
		{},
		el(
			getPrimaryCategoryDropdown,
			{
				fieldName: 'pcp_primary_category_id', // eslint-disable-line camelcase
				...props
			}
		)
	);
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
			return el( OriginalComponent, props );
		}

		const originalComponentUI  = el( OriginalComponent, props );
		const primaryCategoryPanel = getPrimaryCategoryPanel( props );

		return el( Fragment, {}, originalComponentUI, primaryCategoryPanel );
	};
};

wp.hooks.addFilter(
	'editor.PostTaxonomyType',
	'primary-category-plugin',
	addPrimaryCategoryDropdownUI
);
