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
import { BaseControl, PanelBody, ToggleControl, SelectControl } from '@wordpress/components';

export default function ListEdit( {
	attributes,
	insertBlocksAfter,
	setAttributes,
	mergeBlocks,
	onReplace,
	className,
} ) {
	const { ordered, values, reversed, start, type } = attributes;

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
				className={ ( ordered && type ) ? classnames( className, 'ol-type-is-' + type ) : className }
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
				onTagNameChange={ ( tag ) => {
					setAttributes( { ordered: tag === 'ol' } );
					if ( tag !== 'ol' ) {
						setAttributes( { start: null, reversed: null, type: null } );
					}
				} }
			/>
			{
				ordered &&
				<InspectorControls>
					<PanelBody title={ __( 'Ordered List Settings' ) }>
						<SelectControl
							label={ __( 'List Type' ) }
							value={ type ? type : '1' }
							options={ [
								{ label: 'Decimal', value: '1' },
								{ label: 'Lower alpha', value: 'a' },
								{ label: 'Upper alpha', value: 'A' },
								{ label: 'Lower alpha', value: 'i' },
								{ label: 'Upper alpha', value: 'I' },
							] }
							onChange={ ( nextType ) => {
								setAttributes( { type: nextType } );
							} }
						/>
						<BaseControl label={ __( 'Start Value' ) } >
							<input
								type="number"
								onChange={ ( event ) => {
									setAttributes( { start: parseInt( event.target.value, 10 ) } );
									if ( isNaN( parseInt( event.target.value, 10 ) ) ) {
										setAttributes( { start: null } );
									}
								} }
								value={ start ? start : '' }
								step="1"
							/>
						</BaseControl>
						<ToggleControl
							label={ __( 'Reverse List' ) }
							checked={ reversed }
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
