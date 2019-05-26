// @wordpress
import { __ } from '@wordpress/i18n'
import { Component } from '@wordpress/element'
import { select } from '@wordpress/data'
import { BlockControls } from '@wordpress/editor'
import { applyFormat, removeFormat, getActiveFormat } from '@wordpress/rich-text'
import {
  Toolbar,
  IconButton,
  Popover,
  ColorPalette } from '@wordpress/components'

// packages
import { get } from 'lodash'
import { injectGlobal } from 'emotion'
import tw from 'tailwind.macro'

// components
import { HighlighterIcon } from './highlighterIcon'

// styled components
const PopoverContent = tw.div`p-3`
const PopoverLabel = tw.div`pb-2 font-bold font-sans`

/**
 * Inject styled globals
 *
 * ColorPaletteControl is all fucked up so...
 * @link https://github.com/WordPress/gutenberg/issues/13018
 */
injectGlobal`
  .tinypixel-highlighter__content {
    .components-color-palette {
      display: flex;
      justify-content: space-around;
      max-width: 100%;

      &__custom-color {
        display: none;
      }

      &__custom-clear-wrapper {
        width: auto;
      }
    }
  }
`

/**
 * Highlighter Toolbar Component
 *
 * Toolbar/popover component which provide author
 * the ability to set inline background and color
 * styles on selected text.
 *
 */
class HighlighterToolbar extends Component {
  constructor() {
    super(...arguments)

    this.state = {
      openPopover: false,
      colors: get(select('core/block-editor').getSettings(), ['colors']),
      activeColor: getActiveFormat(this.props.value, this.props.colorName),
      activeBackground: getActiveFormat(this.props.value, this.props.backgroundName),
    }

    this.handleColor = this.handleColor.bind(this)
    this.handleBackground = this.handleBackground.bind(this)
    this.handlePopover = this.handlePopover.bind(this)
    this.handlePopoverClickOutside = this.handlePopoverClickOutside.bind(this)
  }

  /**
   * Popover handlers
   */
  handlePopover() {
    this.setState({openPopover: !this.state.openPopover})
  }

  handlePopoverClickOutside(onClick) {
    const colorPaletteEl = document.querySelector('.tinypixel-highlighter__content'),
          toggleEl = document.querySelector('.tinypixel-highlighter__toggle')

    toggleEl.contains(onClick.target) || (colorPaletteEl && !colorPaletteEl.contains(onClick.target)) &&
      this.setState({
        openPopover: !this.state.openPopover,
      })
  }

  /**
   * Color value handlers
   */
  handleColor(color) {
    color ? this.setColor(color)
          : this.unsetColor()
  }

  setColor(color) {
    this.props.onChange(applyFormat(this.props.value, {
      type: this.props.colorName,
      attributes: {
        style: `color:${color}`,
      },
    }))

    this.setState({ activeColor: color })

    this.state.activeColor.attributes.style.replace(
      new RegExp(`^color:\\s*`), ''
    )
  }

  unsetColor() {
    this.props.onChange(
      removeFormat(this.props.value, this.props.colorName)
    )

    this.setState({ activeColor: '' })
  }

  /**
   * Background value handlers
   */
  handleBackground(background) {
    background ? this.setBackground(background)
      : this.unsetBackground()
  }

  setBackground(background) {
    this.props.onChange(applyFormat(this.props.value, {
      type: this.props.backgroundName,
      attributes: {
        style: `background-color:${background}`,
      },
    }))

    this.setState({ activeBackground: background })

    this.state.activeBackground.attributes.style.replace(
      new RegExp(`^background-color:\\s*`), ''
    )
  }

  unsetBackground() {
    this.props.onChange(
      removeFormat(this.props.value, this.props.backgroundName)
    )

    this.setState({ activeBackground: '' })
  }

  /**
   * Render component
   */
  render() {
    return (
      <BlockControls>
        <Toolbar className="components-dropdown-menu">

          <IconButton
            className="components-dropdown-menu__toggle tinypixel-highlighter__toggle"
            icon={<HighlighterIcon />}
            aria-haspopup="true"
            label={__('Highlight', 'tinypixel')}
            tooltip={__('Highlight', 'tinypixel')}
            onClick={this.handlePopover}>
            <span className="components-dropdown-menu__indicator" />
          </IconButton>

          {this.state.openPopover && (
            <Popover
              position="bottom center"
              focusOnMount="container"
              onClickOutside={this.handlePopoverClickOutside}>
              <PopoverContent className="tinypixel-highlighter__content">

                <PopoverLabel className="tinypixel-highlighter__label">{
                  __('Text Color', 'tinypixel')
                }</PopoverLabel>

                <ColorPalette
                  colors={this.state.colors}
                  value={this.state.activeColor}
                  onChange={this.handleColor} />

                <PopoverLabel className="tinypixel-highlighter__label">{
                  __('Highlight Color', 'tinypixel')
                }</PopoverLabel>

                <ColorPalette
                  colors={this.state.colors}
                  value={this.state.activeBackground}
                  onChange={this.handleBackground} />

              </PopoverContent>
            </Popover>
          )}

        </Toolbar>
      </BlockControls>
    )
  }
}

export { HighlighterToolbar }