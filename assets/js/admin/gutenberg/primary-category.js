const { __, sprintf } = wp.i18n;
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
		const {
			taxonomy: {
				slug: taxonomyName,
				labels: { singular_name } // eslint-disable-line camelcase
			}
		} = props;

		// Creates an array of term entity objects (if they exist).
		const terms = props.terms.reduce( ( termArr, termId ) => {
			const term = select( 'core' ).getEntityRecord( 'taxonomy', taxonomyName, termId );
			if ( term ){
				termArr.push( term );
			}
			return termArr;
		}, [] );

		return { [`primary${singular_name}`]: coreEditorMeta[ props.fieldName ], terms }; // eslint-disable-line camelcase
	} )
)( props => {
	const {
		terms,
		taxonomy: {
			labels: { singular_name } // eslint-disable-line camelcase
		}
	} = props;

	return el(
		SelectControl,
		{
			label: sprintf(
				__( 'Primary %s', 'primary-category-plugin' ),
				singular_name // eslint-disable-line camelcase
			),
			options: [
				{
					value: null,
					label: sprintf(
						__( 'Select a Primary %s', 'primary-category-plugin' ),
						singular_name // eslint-disable-line camelcase
					)
				},
				...getTermOptions( terms )
			],
			value: props[`primary${singular_name}`], // eslint-disable-line camelcase
			onChange: ( newValue ) => {
				props.setMetaFieldValue( newValue );
			}
		}
	);
} );

/**
 * Creates options array for a SelectControl.
 *
 * @link: https://developer.wordpress.org/block-editor/components/select-control/
 *
 * @param {Object[]} terms An array of taxonomy objects.
 *
 * @return {Object[]} An array of option objects.
 */
const getTermOptions = ( terms ) => {
	return terms.map( term => ( { value: term.id, label: term.name } ) );
};

/**
 * Creates the Primary Term setting panel element.
 *
 * @param {Objects} props The props object.
 */
const getPrimaryTermPanel = ( props ) => {
	const { taxonomy: { slug: taxonomyName } } = props;
	return el(
		PanelRow,
		{},
		el(
			getPrimaryTermDropdown,
			{
				fieldName: `pcp_primary_${taxonomyName}_id`, // eslint-disable-line camelcase
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
