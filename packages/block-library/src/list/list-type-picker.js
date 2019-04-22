/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Dashicon, BaseControl, Button, Dropdown, NavigableMenu } from '@wordpress/components';

function ListTypePicker( {
	listTypes = [],
	onChange,
	value,
} ) {
	if ( ! listTypes.length ) {
		return null;
	}

	const currentType = listTypes.find( ( listType ) => listType.type === value );
	const currentListTypeName = ( currentType && currentType.name );

	return (
		<BaseControl label={ __( 'List Type' ) }>
			<div className="components-list-type-picker__buttons">
				{ ( listTypes.length > 0 ) &&
					<Dropdown
						className="components-list-type-picker__dropdown"
						contentClassName="components-list-type-picker__dropdown-content"
						position="bottom"
						renderToggle={ ( { isOpen, onToggle } ) => (
							<Button
								className="components-list-type-picker__selector"
								isLarge
								onClick={ onToggle }
								aria-expanded={ isOpen }
								aria-label={ sprintf(
									/* translators: %s: list type name */
									__( 'List Type: %s' ), currentListTypeName
								) }
							>
								{ currentListTypeName }
							</Button>
						) }
						renderContent={ () => (
							<NavigableMenu>
								{ map( listTypes, ( { name, type } ) => {
									const isSelected = ( value === type || ( ! value && name === 'decimal' ) );

									return (
										<Button
											key={ name }
											onClick={ () => onChange( type ) }

											role="menuitemradio"
											aria-checked={ isSelected }
										>
											{ isSelected && <Dashicon icon="saved" /> }
											<span className="components-list-type-picker__dropdown-text-size" >
												{ name }
											</span>
										</Button>
									);
								} ) }
							</NavigableMenu>
						) }
					/>
				}

			</div>

		</BaseControl>
	);
}

export default ListTypePicker;
