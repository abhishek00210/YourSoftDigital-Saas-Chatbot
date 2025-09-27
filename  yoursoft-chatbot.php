<?php
/**
 * Plugin Name:       YourSoft Digital Chatbot
 * Description:       Integrates the YourSoft Digital AI Chatbot with your WordPress site.
 * Version:           1.0.0
 * Author:            YourSoft Digital
 * Author URI:        https://yoursoftdigital.ca/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       yoursoft-chatbot
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

/**
 * Add the settings page to the WordPress admin menu.
 */
function ysd_chatbot_add_admin_menu() {
    add_options_page(
        'YourSoft Chatbot Settings',
        'YourSoft Chatbot',
        'manage_options',
        'yoursoft-chatbot',
        'ysd_chatbot_options_page_html'
    );
}
add_action('admin_menu', 'ysd_chatbot_add_admin_menu');

/**
 * Register the settings field where the Chatbot ID will be stored.
 */
function ysd_chatbot_settings_init() {
    register_setting('ysd_chatbot_options_group', 'ysd_chatbot_id');
}
add_action('admin_init', 'ysd_chatbot_settings_init');

/**
 * Render the HTML for the settings page.
 */
function ysd_chatbot_options_page_html() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <p>Enter your Chatbot ID to activate the chatbot on your website. You can find your Chatbot ID in your YourSoft Digital dashboard.</p>
        <form action="options.php" method="post">
            <?php
            // output security fields for the registered setting "ysd_chatbot_options_group"
            settings_fields('ysd_chatbot_options_group');
            ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Chatbot ID</th>
                    <td>
                        <input type="text" name="ysd_chatbot_id" value="<?php echo esc_attr(get_option('ysd_chatbot_id')); ?>" size="40" placeholder="Enter your Chatbot ID here" />
                    </td>
                </tr>
            </table>
            <?php
            // output save settings button
            submit_button('Save Settings');
            ?>
        </form>
    </div>
    <?php
}

/**
 * Inject the chatbot widget script into the website's footer.
 */
function ysd_chatbot_inject_widget_script() {
    // Get the saved Chatbot ID from the database.
    $chatbot_id = get_option('ysd_chatbot_id');

    // Only add the script if a Chatbot ID has been saved.
    if (!empty($chatbot_id)) {
        // IMPORTANT: Replace 'https://your-domain.com' with your actual production URL.
        $script_url = 'https://your-soft-digital-saas-chatbot.vercel.app/api/widget/' . esc_js($chatbot_id);
        echo '<script src="' . esc_url($script_url) . '" async></script>';
    }
}
// Use the 'wp_footer' hook to add the script to the bottom of the page.
add_action('wp_footer', 'ysd_chatbot_inject_widget_script');