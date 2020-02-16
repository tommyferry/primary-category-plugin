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
const getPrimaryTermDropdown = compose(
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

		// Creates an array of term entity objects (if they exist).
		const terms = props.terms.reduce( ( termArr, termId ) => {
			const term = select( 'core' ).getEntityRecord( 'taxonomy', 'category', termId );
			if ( term ){
				termArr.push( term );
			}
			return termArr;
		}, [] );

		return { primaryCategory: coreEditorMeta[ props.fieldName ], terms };
	} )
)( props => {
	const {
		primaryCategory,
		terms
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
 * @param {Object[]} terms An array of taxonomy objects.
 *
 * @return {Object[]} An array of option objects.
 */
const getTermOptions = ( terms ) => {
	const termObjects = terms.map( term => ( { value: term.id, label: term.name } ) );

	return [
		{ value: null, label: __( 'Select a Primary Category' ) },
		...termObjects
	];
};

/**
 * Creates the Primary Term setting panel element.
 *
 * @param {Objects} props The props object.
 */
const getPrimaryTermPanel = ( props ) => {
	return el(
		PanelRow,
		{},
		el(
			getPrimaryTermDropdown,
			{
				fieldName: 'pcp_primary_category_id', // eslint-disable-line camelcase
				...props
			}
		)
	);
};

/**
 * Adds a Primary Taxonomy Term dropdown selector to the Gutenberg UI.
 *
 * @param {Object} OriginalComponent The original Gutenberg category UI component.
 */
const addPrimaryTaxonomyTermDropdownUI = ( OriginalComponent ) => {
	return ( props ) => {
		// Focus on categories for now.
		if ( 'category' !== props.slug ) {
			return el( OriginalComponent, props );
		}

		const originalComponentUI  = el( OriginalComponent, props );
		const primaryTermPanel = getPrimaryTermPanel( props );
		return el( Fragment, {}, originalComponentUI, primaryTermPanel );
	};
};

wp.hooks.addFilter(
	'editor.PostTaxonomyType',
	'primary-category-plugin',
	addPrimaryTaxonomyTermDropdownUI
);
