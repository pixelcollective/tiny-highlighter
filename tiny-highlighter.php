<?php

/**
 * Plugin Name: Tiny Highlighter
 * Description: Adds inline text highlight to Block Editor toolbar
 */

namespace TinyPixel\Blocks;

add_action('enqueue_block_editor_assets', function () {
    $plugin_deps = [
        'wp-editor',
        'wp-element',
        'wp-plugins',
        'wp-dom-ready',
        'wp-edit-post'
    ];

    wp_enqueue_script('tinypixel/tiny-highlighter', plugin_dir_url(__FILE__) .'/dist/tiny-highlighter.js', $plugin_deps, '', null, true);
});
