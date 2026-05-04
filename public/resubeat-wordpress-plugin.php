<?php
/**
 * Plugin Name: ResuBeat - AI Resume Builder
 * Plugin URI: https://ais-pre-x2qihy6cpquhygiukgmts5-458304802800.asia-east1.run.app
 * Description: Use the shortcode [resubeat] to embed the AI Resume Builder on any WordPress page or post.
 * Version: 1.0.0
 * Author: ResuBeat
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

function resubeat_embed_shortcode($atts) {
    // Shared App URL for the iframe
    $app_url = 'https://ais-pre-x2qihy6cpquhygiukgmts5-458304802800.asia-east1.run.app/';
    
    // Setup iframe wrapper with responsive styling
    $html = '<div class="resubeat-wrapper" style="width: 100%; height: 100vh; min-height: 950px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin: 20px 0; background: #f5f5f4;">';
    $html .= '<iframe src="' . esc_url($app_url) . '" width="100%" height="100%" style="border: none;"></iframe>';
    $html .= '</div>';

    return $html;
}

// Register the shortcode
add_shortcode('resubeat', 'resubeat_embed_shortcode');
