// @wordpress
import { __ } from '@wordpress/i18n'
import { registerFormatType } from '@wordpress/rich-text'

// components
import { HighlighterToolbar } from './inlineColors'

// color and background formats
[
  { name: 'text-color', title: 'Text Color' },
  { name: 'background-color', title: 'Highlight' },
].forEach(({name, title}) => registerFormatType(`tinypixel/${name}`, {
  title,
  tagName: 'span',
  attributes: {
    style: 'style',
  },
  edit: () => (null),
}))

// toolbar container format
registerFormatType('tinypixel/color-tools', {
  title: __('Text Color'),
  tagName: 'span',
  className: 'has-inline-highlighting',
  attributes: {
    style: 'style',
  },
  edit: ({isActive, value, onChange, activeAttributes}) => (
    <HighlighterToolbar
      colorName='highlight-text-color'
      backgroundName='highlight-background-color'
      isActive={isActive}
      value={value}
      onChange={onChange}
      activeAttributes={activeAttributes} />
  ),
})