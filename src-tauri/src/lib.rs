pub mod models;
pub mod git;
pub mod fs_ops;

use git::{
    git_branches, git_checkout, git_commit, git_create_branch,
    git_history, git_init, git_show_file_at_commit, git_status,
    git_get_user_config, git_set_user_config,
};
use fs_ops::{
    create_file, delete_file, read_file, save_diagram_png, scan_project,
    select_directory, write_file,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            #[cfg(target_os = "linux")]
            {
                use tauri::Manager;
                if let Some(window) = app.get_webview_window("main") {
                    let win = window.clone();
                    let _ = window.with_webview(move |w| {
                        use webkit2gtk::WebViewExt;
                        let inner = w.inner();
                        let w_clone = win.clone();
                        inner.connect_zoom_level_notify(move |wv| {
                            let level = wv.zoom_level();
                            if (level - 1.0).abs() > 0.001 {
                                wv.set_zoom_level(1.0);
                                let delta = (level - 1.0) * 1.5;
                                let _ = w_clone.eval(&format!(
                                    "window.__onWebKitPinchZoom && window.__onWebKitPinchZoom({})",
                                    delta
                                ));
                            }
                        });
                    });
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            select_directory,
            scan_project,
            read_file,
            write_file,
            create_file,
            delete_file,
            save_diagram_png,
            git_status,
            git_init,
            git_branches,
            git_checkout,
            git_create_branch,
            git_commit,
            git_history,
            git_show_file_at_commit,
            git_get_user_config,
            git_set_user_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
