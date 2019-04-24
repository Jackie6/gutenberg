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
import { Fragment } from '@wordpress/element';
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
	const { ordered, values, reversed, start, type, description } = attributes;

	const listTypes = [
		{
			name: __( 'Decimal' ),
			type: '1',
			description: 'list-type-decimal',
		},
		{
			name: __( 'Lower alpha' ),
			type: 'a',
			description: 'list-type-lower-alpha',
		},
		{
			name: __( 'Upper alpha' ),
			type: 'A',
			description: 'list-type-upper-alpha',
		},
		{
			name: __( 'Lower roman' ),
			type: 'i',
			description: 'list-type-lower-roman',
		},
		{
			name: __( 'Upper roman' ),
			type: 'I',
			description: 'list-type-upper-roman',
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
				start={ start }
				reversed={ reversed }
				type={ type }
				wrapperClassName="block-library-list"
				className={ ordered ? classnames( className, description ) : className }
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
							value={ type }
							onChange={ ( newType, newDescription ) => {
								setAttributes( { type: newType, description: newDescription } );
							} }
						/>
						<BaseControl label={ __( 'Start Value' ) } >
							<input
								type="number"
								onChange={ ( event ) => {
									setAttributes( { start: parseInt( event.target.value, 10 ) } );
								} }
								value={ start }
								step="1"
							/>
						</BaseControl>
						<ToggleControl
							label={ __( 'Reverse List' ) }
							checked={ !! reversed }
							onChange={ ( ) => {
								setAttributes( { reversed: ! reversed } );
							} }
						/>
					</PanelBody>
				</InspectorControls>
			}
		</Fragment>
	);
}
