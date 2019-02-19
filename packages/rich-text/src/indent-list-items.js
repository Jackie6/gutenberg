/**
 * Internal dependencies
 */

import { LINE_SEPARATOR } from './special-characters';
import { normaliseFormats } from './normalise-formats';
import { getLineIndex } from './get-line-index';

/**
 * Gets the line index of the first previous list item with higher indentation.
 *
 * @param {Object} value      Value to search.
 * @param {number} lineIndex  Line index of the list item to compare with.
 *
 * @return {boolean} The line index.
 */
function getTargetLevelLineIndex( { text, lineFormats }, lineIndex ) {
	const startFormats = lineFormats[ lineIndex ] || [];

	let index = lineIndex;

	while ( index-- >= 0 ) {
		if ( text[ index ] !== LINE_SEPARATOR ) {
			continue;
		}

		const formatsAtIndex = lineFormats[ index ] || [];

		// Return the first line index that is one level higher. If the level is
		// lower or equal, there is no result.
		if ( formatsAtIndex.length === startFormats.length + 1 ) {
			return index;
		} else if ( formatsAtIndex.length <= startFormats.length ) {
			return;
		}
	}
}

/**
 * Indents any selected list items if possible.
 *
 * @param {Object} value      Value to change.
 * @param {Object} rootFormat
 *
 * @return {Object} The changed value.
 */
export function indentListItems( value, rootFormat ) {
	const lineIndex = getLineIndex( value );

	// There is only one line, so the line cannot be indented.
	if ( lineIndex === undefined ) {
		return value;
	}

	const { text, lineFormats, end } = value;
	const previousLineIndex = getLineIndex( value, lineIndex );
	const formatsAtLineIndex = lineFormats[ lineIndex ] || [];
	const formatsAtPreviousLineIndex = lineFormats[ previousLineIndex ] || [];

	// The the indentation of the current line is greater than previous line,
	// then the line cannot be furter indented.
	if ( formatsAtLineIndex.length > formatsAtPreviousLineIndex.length ) {
		return value;
	}

	const newFormats = lineFormats.slice();
	const targetLevelLineIndex = getTargetLevelLineIndex( value, lineIndex );

	for ( let index = lineIndex; index < end; index++ ) {
		if ( text[ index ] !== LINE_SEPARATOR ) {
			continue;
		}

		// Get the previous list, and if there's a child list, take over the
		// formats. If not, duplicate the last level and create a new level.
		if ( targetLevelLineIndex ) {
			const targetFormats = lineFormats[ targetLevelLineIndex ] || [];
			newFormats[ index ] = targetFormats.concat(
				( newFormats[ index ] || [] ).slice( targetFormats.length - 1 )
			);
		} else {
			const targetFormats = lineFormats[ previousLineIndex ] || [];
			const lastformat = targetFormats[ targetFormats.length - 1 ] || rootFormat;

			newFormats[ index ] = targetFormats.concat(
				[ lastformat ],
				( newFormats[ index ] || [] ).slice( targetFormats.length )
			);
		}
	}

	return normaliseFormats( {
		...value,
		lineFormats: newFormats,
	} );
}
