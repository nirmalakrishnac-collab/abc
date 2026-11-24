<?php
session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();
require_once __DIR__ . '/config.php';

$auth_file = __DIR__ . '/data/admin-auth.php';
$auth_data = ['owner_hash' => '', 'blogger_hash' => ''];
if (file_exists($auth_file)) {
    $loaded_auth = @include $auth_file;
    if (is_string($loaded_auth)) {
        $auth_data['owner_hash'] = $loaded_auth;
    } elseif (is_array($loaded_auth)) {
        $auth_data['owner_hash'] = (string)($loaded_auth['owner_hash'] ?? '');
        $auth_data['blogger_hash'] = (string)($loaded_auth['blogger_hash'] ?? '');
    }
}
if ($auth_data['owner_hash'] === '') {
    $auth_data['owner_hash'] = password_hash('spark123', PASSWORD_DEFAULT);
    $seed_php = "<?php\nreturn " . var_export($auth_data, true) . ";\n";
    @file_put_contents($auth_file, $seed_php, LOCK_EX);
}
$has_password = true;
$has_blogger_password = $auth_data['blogger_hash'] !== '';
$is_logged_in = !empty($_SESSION['spark_client_authed']);
$user_role = $is_logged_in ? (($_SESSION['spark_role'] ?? 'owner') === 'blogger' ? 'blogger' : 'owner') : null;
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(24));
}
$csrf = $_SESSION['csrf_token'];

$flash_ok = '';
$flash_err = '';

function handle_php_image_upload(string $field_name, string $uploads_dir, string &$err): ?string {
    if (empty($_FILES[$field_name]) || $_FILES[$field_name]['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    $f = $_FILES[$field_name];
    if ($f['error'] !== UPLOAD_ERR_OK) {
        $err = 'File upload error. Please try a smaller photo.';
        return null;
    }
    if ($f['size'] > 5 * 1024 * 1024) {
        $err = 'Image must be under 5 MB.';
        return null;
    }
    $info = @getimagesize($f['tmp_name']);
    if ($info === false) {
        $err = 'Only valid JPG, PNG, or WEBP photos are allowed.';
        return null;
    }
    $ext_map = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
    if (!isset($ext_map[$info[2]])) {
        $err = 'Only JPG, PNG, or WEBP photos are supported.';
        return null;
    }
    $ext = $ext_map[$info[2]];
    $filename = bin2hex(random_bytes(12)) . '.' . $ext;
    $dest = $uploads_dir . '/' . $filename;
    if (!@move_uploaded_file($f['tmp_name'], $dest)) {
        $err = 'Could not save uploaded file. Check uploads/ folder permissions.';
        return null;
    }
    return 'uploads/' . $filename;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $posted_csrf = (string)($_POST['csrf_token'] ?? '');
    if (!hash_equals($csrf, $posted_csrf)) {
        $flash_err = 'Security verification failed. Please reload and try again.';
    } else {
        $action = (string)($_POST['action'] ?? '');

        if ($action === 'setup_password' && !$has_password) {
            $p1 = (string)($_POST['password'] ?? '');
            $p2 = (string)($_POST['confirm_password'] ?? '');
            $bp = trim((string)($_POST['blogger_password'] ?? ''));
            if (strlen($p1) < 8) {
                $flash_err = 'Please create an Owner password of at least 8 characters.';
            } elseif ($p1 !== $p2) {
                $flash_err = 'Owner passwords do not match.';
            } elseif ($bp !== '' && strlen($bp) < 8) {
                $flash_err = 'Client Blogs-Only password must be at least 8 characters (or leave blank).';
            } elseif ($bp !== '' && $bp === $p1) {
                $flash_err = 'Client Blogs-Only password must differ from the Owner password.';
            } else {
                $new_auth = [
                    'owner_hash' => password_hash($p1, PASSWORD_DEFAULT),
                    'blogger_hash' => $bp !== '' ? password_hash($bp, PASSWORD_DEFAULT) : '',
                ];
                $php_code = "<?php\nreturn " . var_export($new_auth, true) . ";\n";
                if (@file_put_contents($auth_file, $php_code, LOCK_EX) !== false) {
                    session_regenerate_id(true);
                    $_SESSION['spark_client_authed'] = true;
                    $_SESSION['spark_role'] = 'owner';
                    $has_password = true;
                    $has_blogger_password = $new_auth['blogger_hash'] !== '';
                    $auth_data = $new_auth;
                    $is_logged_in = true;
                    $user_role = 'owner';
                    $flash_ok = 'Dashboard passwords saved! You are signed in as Owner (Full Access).';
                } else {
                    $flash_err = 'Could not write auth file inside data/ directory.';
                }
            }
        } elseif ($action === 'login' && $has_password) {
            $p = (string)($_POST['password'] ?? '');
            if ($auth_data['owner_hash'] !== '' && password_verify($p, $auth_data['owner_hash'])) {
                session_regenerate_id(true);
                $_SESSION['spark_client_authed'] = true;
                $_SESSION['spark_role'] = 'owner';
                $is_logged_in = true;
                $user_role = 'owner';
            } elseif ($auth_data['blogger_hash'] !== '' && password_verify($p, $auth_data['blogger_hash'])) {
                session_regenerate_id(true);
                $_SESSION['spark_client_authed'] = true;
                $_SESSION['spark_role'] = 'blogger';
                $is_logged_in = true;
                $user_role = 'blogger';
            } else {
                $flash_err = 'Incorrect password. Please try again.';
            }
        } elseif ($action === 'logout') {
            $_SESSION['spark_client_authed'] = false;
            unset($_SESSION['spark_role']);
            $is_logged_in = false;
            $user_role = null;
        } elseif ($is_logged_in) {
            $cms_payload = [
                'config' => $spa_config,
                'welcome_offer' => $welcome_offer,
                'services' => $services,
                'gallery_items' => $gallery_items,
                'offers' => $offers,
                'blogs' => $blogs,
            ];

            if ($action === 'save_blog') {
                $title = trim((string)($_POST['title'] ?? ''));
                $category = trim((string)($_POST['category'] ?? 'Wellness Guide')) ?: 'Wellness Guide';
                $author = trim((string)($_POST['author'] ?? 'Spark Spa Desk')) ?: 'Spark Spa Desk';
                $excerpt = trim((string)($_POST['excerpt'] ?? ''));
                $content = trim((string)($_POST['content'] ?? ''));
                $status = ($_POST['status'] ?? 'published') === 'draft' ? 'draft' : 'published';
                $edit_id = trim((string)($_POST['edit_blog_id'] ?? ''));

                $uploaded = handle_php_image_upload('cover_photo', $uploads_dir, $flash_err);
                if ($flash_err === '' && strlen($title) >= 3 && strlen($content) >= 15) {
                    $slug = strtolower(trim((string)preg_replace('/[^a-zA-Z0-9]+/', '-', $title), '-')) . '-' . substr(bin2hex(random_bytes(3)), 0, 4);
                    $words = count(preg_split('/\s+/', $content));
                    $read_time = max(1, (int)ceil($words / 180)) . ' min read';
                    $auto_excerpt = $excerpt !== '' ? $excerpt : mb_substr($content, 0, 165) . '...';

                    if ($edit_id !== '') {
                        foreach ($cms_payload['blogs'] as &$b) {
                            if (($b['id'] ?? '') === $edit_id) {
                                $b['title'] = $title;
                                $b['category'] = $category;
                                $b['author'] = $author;
                                $b['excerpt'] = $auto_excerpt;
                                $b['content'] = $content;
                                $b['status'] = $status;
                                $b['read_time'] = $read_time;
                                if ($uploaded) { $b['image'] = $uploaded; }
                                break;
                            }
                        }
                        unset($b);
                        $flash_ok = 'Blog article updated!';
                    } else {
                        array_unshift($cms_payload['blogs'], [
                            'id' => 'blog-' . bin2hex(random_bytes(4)),
                            'slug' => $slug,
                            'title' => $title,
                            'category' => $category,
                            'excerpt' => $auto_excerpt,
                            'content' => $content,
                            'image' => $uploaded ?: 'images/hero_spa_sanctuary_1795110762237.jpg',
                            'alt' => $title . ' — Spark Spa Electronic City',
                            'author' => $author,
                            'published_at' => date('Y-m-d'),
                            'read_time' => $read_time,
                            'status' => $status,
                        ]);
                        $flash_ok = 'Blog article published live!';
                    }
                    save_cms_data($cms_payload);
                    $blogs = $cms_payload['blogs'];
                } elseif ($flash_err === '') {
                    $flash_err = 'Please provide a blog title and article content.';
                }
            } elseif ($action === 'delete_blog') {
                $del_id = (string)($_POST['blog_id'] ?? '');
                $cms_payload['blogs'] = array_values(array_filter($cms_payload['blogs'], fn($b) => ($b['id'] ?? '') !== $del_id));
                save_cms_data($cms_payload);
                $blogs = $cms_payload['blogs'];
                $flash_ok = 'Blog post deleted.';
            } elseif ($action === 'upload_gallery') {
                $g_title = trim((string)($_POST['title'] ?? ''));
                $g_cat = (string)($_POST['space_category'] ?? 'interiors');
                if (!in_array($g_cat, ['interiors', 'suites', 'rituals'], true)) { $g_cat = 'interiors'; }
                $g_caption = trim((string)($_POST['caption'] ?? ''));
                $uploaded = handle_php_image_upload('gallery_photo', $uploads_dir, $flash_err);
                if ($flash_err === '' && $uploaded && strlen($g_title) >= 2) {
                    $label_map = ['interiors' => 'Luxury Spa Interiors', 'suites' => 'Therapy Suites', 'rituals' => 'Wellness Experience'];
                    array_unshift($cms_payload['gallery_items'], [
                        'id' => 'gal-' . bin2hex(random_bytes(4)),
                        'title' => $g_title,
                        'space_category' => $g_cat,
                        'category_label' => $label_map[$g_cat],
                        'caption' => $g_caption ?: 'Captured inside Spark Spa, Electronic City, Bangalore.',
                        'image' => $uploaded,
                        'alt' => $g_title . ' — Spark Spa Electronic City',
                        'span' => 'md:col-span-4',
                    ]);
                    save_cms_data($cms_payload);
                    $gallery_items = $cms_payload['gallery_items'];
                    $flash_ok = 'Photo uploaded to live Gallery!';
                } elseif ($flash_err === '') {
                    $flash_err = 'Please choose an image and enter a photo title.';
                }
            } elseif ($action === 'delete_gallery') {
                $del_id = (string)($_POST['gallery_id'] ?? '');
                $cms_payload['gallery_items'] = array_values(array_filter($cms_payload['gallery_items'], fn($g) => ($g['id'] ?? '') !== $del_id));
                save_cms_data($cms_payload);
                $gallery_items = $cms_payload['gallery_items'];
                $flash_ok = 'Gallery photo removed.';
            } elseif ($action === 'update_service') {
                if ($user_role !== 'owner') {
                    $flash_err = 'Access denied. Blogs & Photos Only accounts cannot edit services or prices.';
                } else {
                    $sid = (string)($_POST['service_id'] ?? '');
                    $uploaded = handle_php_image_upload('service_photo', $uploads_dir, $flash_err);
                    if ($flash_err === '') {
                        foreach ($cms_payload['services'] as &$s) {
                            if (($s['id'] ?? '') === $sid) {
                                $s['name'] = trim((string)($_POST['name'] ?? $s['name'])) ?: $s['name'];
                                $s['duration'] = trim((string)($_POST['duration'] ?? $s['duration'])) ?: $s['duration'];
                                $s['price'] = trim((string)($_POST['price'] ?? $s['price'])) ?: $s['price'];
                                $s['description'] = trim((string)($_POST['description'] ?? $s['description'])) ?: $s['description'];
                                if ($uploaded) { $s['image'] = $uploaded; }
                                break;
                            }
                        }
                        unset($s);
                        save_cms_data($cms_payload);
                        $services = $cms_payload['services'];
                        $flash_ok = 'Service updated!';
                    }
                }
            } elseif ($action === 'add_service') {
                if ($user_role !== 'owner') {
                    $flash_err = 'Access denied. Blogs & Photos Only accounts cannot add services.';
                } else {
                    $sname = trim((string)($_POST['name'] ?? ''));
                    $scat = (string)($_POST['category'] ?? 'massage');
                    if (!in_array($scat, ['massage', 'salon', 'holistic'], true)) { $scat = 'massage'; }
                    $sdur = trim((string)($_POST['duration'] ?? 'Duration: Custom Session')) ?: 'Duration: Custom Session';
                    $sprice = trim((string)($_POST['price'] ?? 'Tariff: Price Upon Enquiry')) ?: 'Tariff: Price Upon Enquiry';
                    $sdesc = trim((string)($_POST['description'] ?? ''));
                    $uploaded = handle_php_image_upload('service_photo', $uploads_dir, $flash_err);
                    if ($flash_err === '' && strlen($sname) >= 2 && strlen($sdesc) >= 6) {
                        $cat_labels = ['massage' => 'Classic Bodywork', 'salon' => 'Hair & Beauty Salon', 'holistic' => 'Holistic & Couples'];
                        $fallback_img = $scat === 'salon' ? 'images/salon_hair_styling_1795541015663.jpg' : 'images/therapy_swedish_action_1795111730062.jpg';
                        array_unshift($cms_payload['services'], [
                            'id' => 'svc-' . bin2hex(random_bytes(4)),
                            'index' => str_pad((string)(count($cms_payload['services']) + 1), 2, '0', STR_PAD_LEFT),
                            'name' => $sname,
                            'category' => $scat,
                            'category_label' => $cat_labels[$scat],
                            'description' => $sdesc,
                            'duration' => $sdur,
                            'price' => $sprice,
                            'image' => $uploaded ?: $fallback_img,
                            'alt' => $sname . ' at ' . $spa_config['brand_name'] . ' Electronic City Bangalore',
                        ]);
                        save_cms_data($cms_payload);
                        $services = $cms_payload['services'];
                        $flash_ok = 'New service published live to website!';
                    } elseif ($flash_err === '') {
                        $flash_err = 'Please enter service name and short description.';
                    }
                }
            } elseif ($action === 'delete_service') {
                if ($user_role !== 'owner') {
                    $flash_err = 'Access denied. Blogs & Photos Only accounts cannot remove services.';
                } else {
                    $del_id = (string)($_POST['service_id'] ?? '');
                    $cms_payload['services'] = array_values(array_filter($cms_payload['services'], fn($s) => ($s['id'] ?? '') !== $del_id));
                    save_cms_data($cms_payload);
                    $services = $cms_payload['services'];
                    $flash_ok = 'Service removed from website.';
                }
            } elseif ($action === 'save_settings') {
                if ($user_role !== 'owner') {
                    $flash_err = 'Access denied. Blogs & Photos Only accounts cannot edit business settings.';
                } else {
                    $wa_digits = preg_replace('/\D+/', '', (string)($_POST['whatsapp_number'] ?? ''));
                    $phone_disp = trim((string)($_POST['phone_display'] ?? $spa_config['phone_display']));
                    $phone_digits = preg_replace('/\D+/', '', $phone_disp);
                    $cms_payload['config']['brand_name'] = trim((string)($_POST['brand_name'] ?? $spa_config['brand_name'])) ?: $spa_config['brand_name'];
                    $cms_payload['config']['hours'] = trim((string)($_POST['hours'] ?? $spa_config['hours'])) ?: $spa_config['hours'];
                    $cms_payload['config']['address_line_2'] = trim((string)($_POST['address_line_2'] ?? $spa_config['address_line_2'])) ?: $spa_config['address_line_2'];
                    $cms_payload['config']['street_note'] = trim((string)($_POST['street_note'] ?? $spa_config['street_note'])) ?: $spa_config['street_note'];
                    if (strlen($wa_digits) >= 10) { $cms_payload['config']['whatsapp_number'] = $wa_digits; }
                    $cms_payload['config']['phone_display'] = $phone_disp;
                    if (strlen($phone_digits) >= 10) { $cms_payload['config']['phone_href'] = 'tel:+' . $phone_digits; }
                    $cms_payload['welcome_offer']['title'] = trim((string)($_POST['offer_title'] ?? $welcome_offer['title'])) ?: $welcome_offer['title'];
                    $cms_payload['welcome_offer']['offer_code'] = trim((string)($_POST['offer_code'] ?? $welcome_offer['offer_code'])) ?: $welcome_offer['offer_code'];
                    save_cms_data($cms_payload);
                    $spa_config = $cms_payload['config'];
                    $welcome_offer = $cms_payload['welcome_offer'];
                    $flash_ok = 'Business settings & WhatsApp number saved!';
                }
            } elseif ($action === 'save_blogger_password') {
                if ($user_role !== 'owner') {
                    $flash_err = 'Access denied. Only the Owner can manage the Client Blogs-Only password.';
                } else {
                    $bp = trim((string)($_POST['blogger_password'] ?? ''));
                    if (strlen($bp) < 8) {
                        $flash_err = 'Client Blogs-Only password must be at least 8 characters.';
                    } elseif ($auth_data['owner_hash'] !== '' && password_verify($bp, $auth_data['owner_hash'])) {
                        $flash_err = 'Client Blogs-Only password must differ from your Owner password.';
                    } else {
                        $auth_data['blogger_hash'] = password_hash($bp, PASSWORD_DEFAULT);
                        $php_code = "<?php\nreturn " . var_export($auth_data, true) . ";\n";
                        if (@file_put_contents($auth_file, $php_code, LOCK_EX) !== false) {
                            $has_blogger_password = true;
                            $flash_ok = 'Client Blogs & Photos Only password saved! Share this password with your client.';
                        } else {
                            $flash_err = 'Could not update auth file inside data/ directory.';
                        }
                    }
                }
            } elseif ($action === 'update_owner_password') {
                if ($user_role !== 'owner') {
                    $flash_err = 'Access denied. Only the Owner can change the Owner password.';
                } else {
                    $np = (string)($_POST['new_owner_password'] ?? '');
                    $cp = (string)($_POST['confirm_owner_password'] ?? '');
                    if (strlen($np) < 8) {
                        $flash_err = 'New Owner password must be at least 8 characters.';
                    } elseif ($np !== $cp) {
                        $flash_err = 'New Owner passwords do not match.';
                    } elseif ($auth_data['blogger_hash'] !== '' && password_verify($np, $auth_data['blogger_hash'])) {
                        $flash_err = 'Owner password must differ from the Client Blogs-Only password.';
                    } else {
                        $auth_data['owner_hash'] = password_hash($np, PASSWORD_DEFAULT);
                        $php_code = "<?php\nreturn " . var_export($auth_data, true) . ";\n";
                        if (@file_put_contents($auth_file, $php_code, LOCK_EX) !== false) {
                            $flash_ok = 'Owner password updated successfully!';
                        } else {
                            $flash_err = 'Could not write updated password inside data/ directory.';
                        }
                    }
                }
            }
        }
    }
}

$tab = (string)($_GET['tab'] ?? 'blogs');
$allowed_tabs = $user_role === 'blogger' ? ['blogs', 'gallery'] : ['blogs', 'gallery', 'services', 'settings'];
if (!in_array($tab, $allowed_tabs, true)) { $tab = 'blogs'; }

$edit_blog = null;
if (!empty($_GET['edit_blog'])) {
    foreach ($blogs as $b) {
        if (($b['id'] ?? '') === $_GET['edit_blog']) { $edit_blog = $b; break; }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Client Content Studio | <?= e($spa_config['brand_name']) ?></title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F6F1E7; color: #1C1512; }
    h1, h2, h3, .font-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
  </style>
</head>
<body class="min-h-screen">
  <header class="bg-[#1C1512] text-[#FAF6EE] border-b border-[#D9B263]/30 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <div>
        <p class="font-serif text-xl font-medium"><?= e($spa_config['brand_name']) ?> · Client Studio</p>
        <p class="text-[11px] text-[#DFD3C0]">
          <?php if ($user_role === 'blogger'): ?>
            Signed in: Blogs &amp; Photos Only
          <?php elseif ($user_role === 'owner'): ?>
            Signed in: Owner (Full Access)
          <?php else: ?>
            Private Blog, Photo &amp; Content Dashboard
          <?php endif; ?>
        </p>
      </div>
      <div class="flex items-center gap-3">
        <a href="index.php" class="px-3.5 py-2 rounded-md border border-[#D9B263]/40 text-xs sm:text-sm font-medium text-[#E8C57B] hover:bg-[#D9B263] hover:text-[#1C1512]">&larr; View Live Website</a>
        <?php if ($is_logged_in): ?>
        <form method="POST">
          <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
          <input type="hidden" name="action" value="logout" />
          <button type="submit" class="px-3.5 py-2 rounded-md bg-[#5C1728] text-[#FAF6EE] text-xs sm:text-sm font-medium cursor-pointer">Sign Out</button>
        </form>
        <?php endif; ?>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <?php if (!$is_logged_in): ?>
      <div class="max-w-md mx-auto mt-8 bg-white border border-[#C69749]/35 rounded-xl p-8 shadow-md">
        <h1 class="font-serif text-3xl font-medium text-[#1C1512]"><?= $has_password ? 'Client Portal Sign In' : 'Set Up Dashboard Passwords' ?></h1>
        <p class="mt-2 text-sm text-[#524740]">
          <?= $has_password
              ? 'Enter your Owner Password (full access) OR your Client Blogs-Only Password (upload blogs & photos only).'
              : 'Set your Owner Password (full dashboard) and optionally create a separate Client Blogs-Only Password for your client.' ?>
        </p>
        <?php if ($has_password && $has_blogger_password): ?>
        <div class="mt-4 px-3.5 py-2.5 rounded-md bg-[#F3EBD9] border border-[#C69749]/35 text-xs text-[#1C1512]">
          <strong class="text-[#5C1728]">Blogs &amp; Photos Only Login Active:</strong> Signing in with the Blogs-Only password only allows publishing blogs and uploading gallery photos.
        </div>
        <?php endif; ?>
        <?php if ($flash_err): ?><p role="alert" class="mt-4 text-xs font-semibold text-red-700"><?= e($flash_err) ?></p><?php endif; ?>
        <form method="POST" class="mt-6 space-y-4">
          <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
          <input type="hidden" name="action" value="<?= $has_password ? 'login' : 'setup_password' ?>" />
          <div>
            <label class="block text-xs font-medium mb-1"><?= $has_password ? 'Owner or Client Blogs-Only Password' : 'Owner Password — Full Access (min 8 chars)' ?></label>
            <input type="password" name="password" required class="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
          </div>
          <?php if (!$has_password): ?>
          <div>
            <label class="block text-xs font-medium mb-1">Confirm Owner Password</label>
            <input type="password" name="confirm_password" required class="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
          </div>
          <div class="pt-3 border-t border-[#C69749]/25">
            <label class="block text-xs font-medium mb-1">Client Blogs &amp; Photos Only Password (Optional, min 8 chars)</label>
            <p class="text-[11px] text-[#524740] mb-1.5">Give this separate password to your client so they can only upload blogs and gallery photos.</p>
            <input type="password" name="blogger_password" placeholder="Optional separate password for client" class="w-full px-3.5 py-2.5 min-h-[44px] bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
          </div>
          <?php endif; ?>
          <button type="submit" class="w-full py-3 bg-[#5C1728] hover:bg-[#4A1120] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer">
            <?= $has_password ? 'Unlock Dashboard' : 'Save Passwords & Enter' ?>
          </button>
        </form>
      </div>
    <?php else: ?>
      <?php if ($flash_ok): ?><div class="mb-6 px-4 py-3 rounded-lg bg-[#1B4D3E] text-[#FAF6EE] text-sm font-medium"><?= e($flash_ok) ?></div><?php endif; ?>
      <?php if ($flash_err): ?><div class="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-300 text-red-800 text-sm font-medium"><?= e($flash_err) ?></div><?php endif; ?>

      <?php if ($user_role === 'blogger'): ?>
      <div class="mb-6 px-4 py-3 rounded-lg bg-[#F3EBD9] border border-[#C69749]/40 text-xs sm:text-sm text-[#1C1512]">
        <strong>Blogs &amp; Photos Access Mode:</strong> You can publish/edit blog articles with cover photos and upload photos to the Gallery. Services, prices, and WhatsApp settings are locked to the Owner.
      </div>
      <?php endif; ?>

      <div class="flex flex-wrap gap-2 border-b border-[#C69749]/30 pb-4 mb-8">
        <a href="?tab=blogs" class="px-4 py-2.5 rounded-md text-sm font-medium <?= $tab === 'blogs' ? 'bg-[#5C1728] text-[#FAF6EE]' : 'bg-white border border-[#C69749]/30 text-[#524740]' ?>">Blogs &amp; Articles</a>
        <a href="?tab=gallery" class="px-4 py-2.5 rounded-md text-sm font-medium <?= $tab === 'gallery' ? 'bg-[#5C1728] text-[#FAF6EE]' : 'bg-white border border-[#C69749]/30 text-[#524740]' ?>">Photo Gallery Upload</a>
        <?php if ($user_role === 'owner'): ?>
        <a href="?tab=services" class="px-4 py-2.5 rounded-md text-sm font-medium <?= $tab === 'services' ? 'bg-[#5C1728] text-[#FAF6EE]' : 'bg-white border border-[#C69749]/30 text-[#524740]' ?>">Services</a>
        <a href="?tab=settings" class="px-4 py-2.5 rounded-md text-sm font-medium <?= $tab === 'settings' ? 'bg-[#5C1728] text-[#FAF6EE]' : 'bg-white border border-[#C69749]/30 text-[#524740]' ?>">Business &amp; WhatsApp</a>
        <?php endif; ?>
      </div>

      <?php if ($tab === 'blogs'): ?>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form method="POST" enctype="multipart/form-data" class="lg:col-span-6 bg-white border border-[#C69749]/30 rounded-xl p-6 space-y-4">
          <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
          <input type="hidden" name="action" value="save_blog" />
          <input type="hidden" name="edit_blog_id" value="<?= e($edit_blog['id'] ?? '') ?>" />
          <h2 class="font-serif text-2xl font-medium"><?= $edit_blog ? 'Edit Blog Article' : 'Publish New Blog Article' ?></h2>
          <input type="text" name="title" required placeholder="Article Title *" value="<?= e($edit_blog['title'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="text" name="category" placeholder="Category" value="<?= e($edit_blog['category'] ?? 'Massage Therapy') ?>" class="px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            <input type="text" name="author" placeholder="Author" value="<?= e($edit_blog['author'] ?? 'Spark Spa Desk') ?>" class="px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            <select name="status" class="px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm">
              <option value="published" <?= ($edit_blog['status'] ?? 'published') === 'published' ? 'selected' : '' ?>>Published</option>
              <option value="draft" <?= ($edit_blog['status'] ?? '') === 'draft' ? 'selected' : '' ?>>Draft</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium mb-1">Upload Blog Cover Photo (JPG, PNG, WEBP)</label>
            <input type="file" name="cover_photo" accept="image/jpeg,image/png,image/webp" class="w-full text-xs" />
          </div>
          <input type="text" name="excerpt" placeholder="Short summary (1–2 sentences)" value="<?= e($edit_blog['excerpt'] ?? '') ?>" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
          <textarea name="content" rows="6" required placeholder="Full article content..." class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"><?= e($edit_blog['content'] ?? '') ?></textarea>
          <button type="submit" class="w-full py-3 bg-[#1B4D3E] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer"><?= $edit_blog ? 'Update Blog Article' : 'Publish Blog Article' ?></button>
        </form>

        <div class="lg:col-span-6 space-y-4">
          <h3 class="font-serif text-2xl font-medium">All Articles (<?= count($blogs) ?>)</h3>
          <?php foreach ($blogs as $b):
            $img = is_safe_asset_path((string)$b['image']) ? $b['image'] : 'images/hero_spa_sanctuary_1795110762237.jpg';
          ?>
          <div class="flex gap-4 bg-white border border-[#C69749]/25 rounded-xl p-4">
            <img src="<?= e($img) ?>" alt="" class="w-24 h-20 object-cover rounded-lg bg-[#EFE7D8] shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-xs font-medium text-[#8F6422]"><?= e($b['category']) ?> · <?= e($b['status']) ?></p>
              <h4 class="font-serif text-lg font-medium truncate"><?= e($b['title']) ?></h4>
              <div class="mt-2 flex items-center gap-4 text-xs">
                <a href="?tab=blogs&edit_blog=<?= rawurlencode($b['id']) ?>" class="font-semibold text-[#5C1728] hover:underline">Edit</a>
                <form method="POST" class="inline">
                  <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
                  <input type="hidden" name="action" value="delete_blog" />
                  <input type="hidden" name="blog_id" value="<?= e($b['id']) ?>" />
                  <button type="submit" class="text-red-700 hover:underline cursor-pointer">Delete</button>
                </form>
              </div>
            </div>
          </div>
          <?php endforeach; ?>
        </div>
      </div>

      <?php elseif ($tab === 'gallery'): ?>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form method="POST" enctype="multipart/form-data" class="lg:col-span-5 bg-white border border-[#C69749]/30 rounded-xl p-6 space-y-4">
          <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
          <input type="hidden" name="action" value="upload_gallery" />
          <h2 class="font-serif text-2xl font-medium">Upload Spa Photo</h2>
          <div>
            <label class="block text-xs font-medium mb-1">Choose Photo (JPG, PNG, WEBP) *</label>
            <input type="file" name="gallery_photo" required accept="image/jpeg,image/png,image/webp" class="w-full text-xs" />
          </div>
          <input type="text" name="title" required placeholder="Photo Title *" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
          <select name="space_category" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm">
            <option value="interiors">Luxury Interiors</option>
            <option value="suites">Massage Suites</option>
            <option value="rituals">Thermal &amp; Rituals</option>
          </select>
          <textarea name="caption" rows="2" placeholder="Photo caption..." class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"></textarea>
          <button type="submit" class="w-full py-3 bg-[#5C1728] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer">Upload to Gallery</button>
        </form>
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <?php foreach ($gallery_items as $g):
            $img = is_safe_asset_path((string)$g['image']) ? $g['image'] : 'images/hero_spa_sanctuary_1795110762237.jpg';
          ?>
          <div class="bg-white border border-[#C69749]/25 rounded-xl overflow-hidden">
            <img src="<?= e($img) ?>" alt="" class="w-full aspect-[16/10] object-cover" />
            <div class="p-4 flex items-center justify-between">
              <div class="min-w-0">
                <p class="text-[11px] text-[#8F6422]"><?= e($g['category_label']) ?></p>
                <p class="font-serif text-lg truncate"><?= e($g['title']) ?></p>
              </div>
              <form method="POST">
                <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
                <input type="hidden" name="action" value="delete_gallery" />
                <input type="hidden" name="gallery_id" value="<?= e($g['id']) ?>" />
                <button type="submit" class="text-xs text-red-700 hover:underline cursor-pointer">Remove</button>
              </form>
            </div>
          </div>
          <?php endforeach; ?>
        </div>
      </div>

      <?php elseif ($tab === 'services' && $user_role === 'owner'): ?>
      <div class="space-y-8">
        <form method="POST" enctype="multipart/form-data" class="bg-white border border-[#C69749]/35 rounded-xl p-6 space-y-4 max-w-2xl">
          <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
          <input type="hidden" name="action" value="add_service" />
          <h2 class="font-serif text-2xl font-medium">Add New Spa or Salon Service</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" name="name" required placeholder="Service Name *" class="px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            <select name="category" class="px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm">
              <option value="massage">Spa Massage Category</option>
              <option value="salon">Hair &amp; Beauty Salon Category</option>
              <option value="holistic">Holistic &amp; Couples Category</option>
            </select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" name="duration" value="Duration: Custom Session" class="px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            <input type="text" name="price" value="Tariff: Price Upon Enquiry" class="px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
          </div>
          <textarea name="description" rows="2" required placeholder="Short service description *" class="w-full px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm"></textarea>
          <input type="file" name="service_photo" accept="image/jpeg,image/png,image/webp" class="w-full text-xs" />
          <button type="submit" class="px-5 py-2.5 bg-[#5C1728] text-[#FAF6EE] text-xs sm:text-sm font-semibold rounded-md cursor-pointer">Add Service</button>
        </form>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <?php foreach ($services as $s): ?>
          <div class="bg-white border border-[#C69749]/30 rounded-xl p-6 space-y-3">
            <form method="POST" enctype="multipart/form-data" class="space-y-3">
              <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
              <input type="hidden" name="action" value="update_service" />
              <input type="hidden" name="service_id" value="<?= e($s['id']) ?>" />
              <div class="flex items-center justify-between text-[11px] font-medium text-[#8F6422]">
                <span><?= e($s['index']) ?> · <?= ($s['category'] ?? '') === 'salon' ? 'Salon Service' : 'Spa Service' ?></span>
              </div>
              <input type="text" name="name" value="<?= e($s['name']) ?>" class="w-full px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm font-semibold" />
              <div class="grid grid-cols-2 gap-3">
                <input type="text" name="duration" value="<?= e($s['duration']) ?>" class="px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-xs" />
                <input type="text" name="price" value="<?= e($s['price']) ?>" class="px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-xs" />
              </div>
              <textarea name="description" rows="2" class="w-full px-3 py-2 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-xs"><?= e($s['description']) ?></textarea>
              <input type="file" name="service_photo" accept="image/jpeg,image/png,image/webp" class="w-full text-xs" />
              <button type="submit" class="px-4 py-2 bg-[#1B4D3E] text-[#FAF6EE] text-xs font-semibold rounded-md cursor-pointer">Save Service</button>
            </form>
            <form method="POST" class="pt-1">
              <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
              <input type="hidden" name="action" value="delete_service" />
              <input type="hidden" name="service_id" value="<?= e($s['id']) ?>" />
              <button type="submit" class="text-xs text-red-700 hover:underline cursor-pointer">Delete Service</button>
            </form>
          </div>
          <?php endforeach; ?>
        </div>
      </div>

      <?php elseif ($tab === 'settings' && $user_role === 'owner'): ?>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form method="POST" class="lg:col-span-7 bg-white border border-[#C69749]/30 rounded-xl p-6 space-y-4">
          <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
          <input type="hidden" name="action" value="save_settings" />
          <h2 class="font-serif text-2xl font-medium">Business &amp; WhatsApp Settings</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium mb-1">WhatsApp Number (digits only)</label>
              <input type="text" name="whatsapp_number" value="<?= e($spa_config['whatsapp_number']) ?>" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1">Display Phone</label>
              <input type="text" name="phone_display" value="<?= e($spa_config['phone_display']) ?>" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium mb-1">Brand Name</label>
              <input type="text" name="brand_name" value="<?= e($spa_config['brand_name']) ?>" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1">Opening Hours</label>
              <input type="text" name="hours" value="<?= e($spa_config['hours']) ?>" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium mb-1">Address Line</label>
            <input type="text" name="address_line_2" value="<?= e($spa_config['address_line_2']) ?>" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
          </div>
          <div>
            <label class="block text-xs font-medium mb-1">Street Landmark Note</label>
            <input type="text" name="street_note" value="<?= e($spa_config['street_note']) ?>" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium mb-1">Welcome Offer Title</label>
              <input type="text" name="offer_title" value="<?= e($welcome_offer['title']) ?>" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1">Welcome Offer Code</label>
              <input type="text" name="offer_code" value="<?= e($welcome_offer['offer_code']) ?>" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            </div>
          </div>
          <button type="submit" class="px-6 py-3 bg-[#1B4D3E] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer">Save Settings</button>
        </form>

        <div class="lg:col-span-5 space-y-6">
          <form method="POST" class="bg-white border border-[#C69749]/35 rounded-xl p-6 space-y-4">
            <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
            <input type="hidden" name="action" value="update_owner_password" />
            <h2 class="font-serif text-2xl font-medium text-[#1C1512]">Update Owner Password</h2>
            <p class="text-xs text-[#524740]">Change your Owner (Full Access) login password anytime.</p>
            <div>
              <label class="block text-xs font-medium mb-1">New Owner Password (min 8 chars)</label>
              <input type="password" name="new_owner_password" required placeholder="Enter new owner password" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1">Confirm New Owner Password</label>
              <input type="password" name="confirm_owner_password" required placeholder="Re-enter new owner password" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            </div>
            <button type="submit" class="w-full py-3 bg-[#1C1512] hover:bg-[#332722] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer">Update Owner Password</button>
          </form>

          <form method="POST" class="bg-white border border-[#C69749]/35 rounded-xl p-6 space-y-4">
            <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>" />
            <input type="hidden" name="action" value="save_blogger_password" />
            <h2 class="font-serif text-2xl font-medium text-[#1C1512]">Client Access: Blogs &amp; Photos Only</h2>
            <p class="text-xs sm:text-sm text-[#524740] leading-relaxed">
              Set a separate <strong>Client Blogs-Only Password</strong> so your client can log into <code>client-dashboard.php</code> ONLY to upload blogs and gallery photos—without access to prices or WhatsApp settings.
            </p>
            <p class="text-xs text-[#524740]">
              Status: <strong class="<?= $has_blogger_password ? 'text-[#1B4D3E]' : 'text-[#5C1728]' ?>"><?= $has_blogger_password ? 'Active (Blogs-Only Password Set)' : 'Not Yet Set' ?></strong>
            </p>
            <div>
              <label class="block text-xs font-medium mb-1"><?= $has_blogger_password ? 'New Client Blogs-Only Password (min 8 chars)' : 'Create Client Blogs-Only Password (min 8 chars)' ?></label>
              <input type="password" name="blogger_password" required placeholder="Separate password for client" class="w-full px-3.5 py-2.5 bg-[#FAF6EE] border border-[#1C1512]/20 rounded-md text-sm" />
            </div>
            <button type="submit" class="w-full py-3 bg-[#5C1728] hover:bg-[#4A1120] text-[#FAF6EE] text-sm font-semibold rounded-md cursor-pointer">
              <?= $has_blogger_password ? 'Update Client Blogs-Only Password' : 'Enable Client Blogs-Only Login' ?>
            </button>
          </form>
        </div>
      </div>
      <?php endif; ?>
    <?php endif; ?>
  </main>
</body>
</html>
