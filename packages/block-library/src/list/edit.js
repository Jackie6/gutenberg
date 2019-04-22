/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { RichText, InspectorControls } from '@wordpress/block-editor';
import { Fragment, useState } from '@wordpress/element';
import { BaseControl, PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ListTypePicker from './list-type-picker';

export default function ListEdit( {
	attributes,
	insertBlocksAfter,
	setAttributes,
	mergeBlocks,
	onReplace,
	className,
} ) {
	const { ordered, values } = attributes;
	const [ startValue, setStartValue ] = useState( '' );
	const [ reversed, setReversed ] = useState( false );
	const [ listType, setListType ] = useState( 'list-type-decimal' );

	const listTypes = [
		{
			name: __( 'Decimal' ),
			type: 'list-type-decimal',
		},
		{
			name: __( 'Lower alpha' ),
			type: 'list-type-lower-alpha',
		},
		{
			name: __( 'Upper alpha' ),
			type: 'list-type-upper-alpha',
		},
		{
			name: __( 'Lower roman' ),
			type: 'list-type-lower-roman',
		},
		{
			name: __( 'Upper roman' ),
			type: 'list-type-upper-roman',
		},
	];

	return (
		<Fragment>
			<RichText
				identifier="values"
				multiline="li"
				tagName={ ordered ? 'ol' : 'ul' }
				onChange={ ( nextValues ) => setAttributes( { values: nextValues } ) }
				value={ values }
				start={ startValue }
				reversed={ reversed }
				wrapperClassName="block-library-list"
				className={ classnames( className, listType ) }
				placeholder={ __( 'Write list…' ) }
				onMerge={ mergeBlocks }
				unstableOnSplit={
					insertBlocksAfter ?
						( before, after, ...blocks ) => {
							if ( ! blocks.length ) {
								blocks.push( createBlock( 'core/paragraph' ) );
							}

							if ( after !== '<li></li>' ) {
								blocks.push( createBlock( 'core/list', {
									ordered,
									values: after,
								} ) );
							}

							setAttributes( { values: before } );
							insertBlocksAfter( blocks );
						} :
						undefined
				}
				onRemove={ () => onReplace( [] ) }
				onTagNameChange={ ( tag ) => setAttributes( { ordered: tag === 'ol' } ) }
			/>
			{
				ordered &&
				<InspectorControls>
					<PanelBody title={ __( 'Ordered List Settings' ) }>
						<ListTypePicker
							listTypes={ listTypes }
							value={ listType }
							onChange={ ( newListType ) => {
								setListType( newListType );
							} }
						/>
						<BaseControl label={ __( 'Start Value' ) } >
							<input
								type="number"
								onChange={ ( event ) => {
									let inputStartValue = parseInt( event.target.value, 10 );
									if ( isNaN( inputStartValue ) ) {
										inputStartValue = '';
									}
									setStartValue( inputStartValue );
								} }
								value={ startValue }
								step="1"
							/>
						</BaseControl>
						<ToggleControl
							label={ __( 'Reverse List' ) }
							checked={ !! reversed }
							onChange={ ( ) => {
								setReversed( ! reversed );
							} }
						/>
					</PanelBody>
				</InspectorControls>
			}
		</Fragment>
	);
}
