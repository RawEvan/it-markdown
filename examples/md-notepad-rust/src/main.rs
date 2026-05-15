use eframe::egui;
use pulldown_cmark::{html, Parser};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[derive(Default, Serialize, Deserialize)]
pub struct WidgetState {
    pub buttons: HashMap<String, ButtonState>,
    pub sliders: HashMap<String, f64>,
    pub checkboxes: HashMap<String, bool>,
    pub radios: HashMap<String, String>,
    pub collapses: HashMap<String, bool>,
    pub tabs: HashMap<String, String>,
}

#[derive(Default, Serialize, Deserialize)]
pub struct ButtonState {
    pub clicked: bool,
    pub label: String,
}

#[derive(Default)]
struct AppState {
    file_path: Option<PathBuf>,
    original_content: String,
    content: String,
    html_content: String,
    widget_state: WidgetState,
    dirty: bool,
    message: String,
    show_save_dialog: bool,
}

pub fn parse_interactive_widgets(content: &str) -> (String, WidgetState) {
    let mut state = WidgetState::default();
    let mut output = String::new();
    let mut in_code_block = false;
    let lines: Vec<&str> = content.lines().collect();
    let mut idx = 0;

    while idx < lines.len() {
        let line = lines[idx];

        if line.starts_with("```") {
            if in_code_block {
                output.push_str(&format!("{}\n", line));
                in_code_block = false;
            } else {
                output.push_str(&format!("{}\n", line));
                in_code_block = true;
            }
            idx += 1;
            continue;
        }

        if in_code_block {
            output.push_str(&format!("{}\n", line));
            idx += 1;
            continue;
        }

        let mut processed = false;

        if let Some(widget) = parse_button(line) {
            let id = widget.id.clone();
            output.push_str(&format!("<button id=\"{}\">{}</button>\n", id, widget.label));
            state.buttons.insert(id, ButtonState { clicked: false, label: widget.label });
            idx += 1;
            processed = true;
        } else if let Some(widget) = parse_slider(line) {
            let id = widget.id.clone();
            let value = widget.default.unwrap_or(widget.min.unwrap_or(0.0));
            output.push_str(&format!(
                "<slider id=\"{}\" min=\"{}\" max=\"{}\" value=\"{}\"></slider>\n",
                id,
                widget.min.unwrap_or(0.0),
                widget.max.unwrap_or(100.0),
                value
            ));
            state.sliders.insert(id, value);
            idx += 1;
            processed = true;
        } else if let Some(widget) = parse_checkbox(line) {
            let id = widget.id.clone();
            output.push_str(&format!(
                "<checkbox id=\"{}\" checked=\"{}\">{}</checkbox>\n",
                id,
                widget.checked.unwrap_or(false),
                widget.label
            ));
            state.checkboxes.insert(id, widget.checked.unwrap_or(false));
            idx += 1;
            processed = true;
        } else if let Some(widget) = parse_radio(line) {
            let id = widget.id.clone();
            let checked = widget.options.first().cloned().unwrap_or_default();
            let options_str = widget.options.join("|");
            output.push_str(&format!(
                "<radio id=\"{}\" options=\"{}\" selected=\"{}\"></radio>\n",
                id, options_str, checked
            ));
            state.radios.insert(id, checked);
            idx += 1;
            processed = true;
        } else if let Some((widget, next_idx)) = parse_collapse(content, idx) {
            let id = widget.id.clone();
            output.push_str(&format!("<collapse id=\"{}\" title=\"{}\">{}</collapse>\n", id, widget.title, widget.body));
            state.collapses.insert(id, false);
            idx = next_idx;
            processed = true;
        } else if let Some(widget) = parse_tab(line) {
            let id = widget.id.clone();
            let first_tab = widget.tabs.first().cloned().unwrap_or_default();
            let tabs_str = widget.tabs.join("|");
            output.push_str(&format!(
                "<tab id=\"{}\" tabs=\"{}\" selected=\"{}\"></tab>\n",
                id, tabs_str, first_tab
            ));
            state.tabs.insert(id, first_tab);
            idx += 1;
            processed = true;
        }

        if !processed {
            output.push_str(&format!("{}\n", line));
            idx += 1;
        }
    }

    (output, state)
}

#[derive(Debug, Clone)]
pub struct ButtonWidget {
    pub id: String,
    pub label: String,
}

#[derive(Debug, Clone)]
pub struct SliderWidget {
    pub id: String,
    pub min: Option<f64>,
    pub max: Option<f64>,
    pub default: Option<f64>,
}

#[derive(Debug, Clone)]
pub struct CheckboxWidget {
    pub id: String,
    pub label: String,
    pub checked: Option<bool>,
}

#[derive(Debug, Clone)]
pub struct RadioWidget {
    pub id: String,
    pub options: Vec<String>,
}

#[derive(Debug, Clone)]
pub struct CollapseWidget {
    pub id: String,
    pub title: String,
    pub body: String,
}

#[derive(Debug, Clone)]
pub struct TabWidget {
    pub id: String,
    pub tabs: Vec<String>,
}

pub fn parse_button(line: &str) -> Option<ButtonWidget> {
    let line = line.trim();
    let rest = if let Some(r) = line.strip_prefix("[button:") {
        r
    } else if let Some(r) = line.strip_prefix("[Button:") {
        r
    } else {
        return None;
    };

    let rest = rest.strip_suffix(']')?;
    let parts: Vec<&str> = rest.splitn(2, ':').collect();
    if parts.len() != 2 {
        return None;
    }

    Some(ButtonWidget {
        id: parts[0].trim().to_string(),
        label: parts[1].trim().to_string(),
    })
}

pub fn parse_slider(line: &str) -> Option<SliderWidget> {
    let line = line.trim();
    let rest = if let Some(r) = line.strip_prefix("[slider:") {
        r
    } else if let Some(r) = line.strip_prefix("[Slider:") {
        r
    } else {
        return None;
    };

    let rest = rest.strip_suffix(']')?;

    let parts: Vec<&str> = rest.split(':').collect();
    if parts.is_empty() {
        return None;
    }

    let id = parts[0].trim().to_string();
    let mut min = None;
    let mut max = None;
    let mut default = None;

    for part in &parts[1..] {
        let kv: Vec<&str> = part.split('=').collect();
        if kv.len() == 2 {
            match kv[0].trim() {
                "min" => min = kv[1].trim().parse().ok(),
                "max" => max = kv[1].trim().parse().ok(),
                "default" | "value" => default = kv[1].trim().parse().ok(),
                _ => {}
            }
        }
    }

    Some(SliderWidget { id, min, max, default })
}

pub fn parse_checkbox(line: &str) -> Option<CheckboxWidget> {
    let line = line.trim();
    let rest = if let Some(r) = line.strip_prefix("[checkbox:") {
        r
    } else if let Some(r) = line.strip_prefix("[Checkbox:") {
        r
    } else {
        return None;
    };

    let rest = rest.strip_suffix(']')?;

    let parts: Vec<&str> = rest.splitn(2, ':').collect();
    if parts.len() != 2 {
        return None;
    }

    let id = parts[0].trim().to_string();
    let label = parts[1].trim().to_string();

    Some(CheckboxWidget {
        id,
        label,
        checked: None,
    })
}

pub fn parse_radio(line: &str) -> Option<RadioWidget> {
    let line = line.trim();
    let rest = if let Some(r) = line.strip_prefix("[radio:") {
        r
    } else if let Some(r) = line.strip_prefix("[Radio:") {
        r
    } else {
        return None;
    };

    let rest = rest.strip_suffix(']')?;

    let parts: Vec<&str> = rest.splitn(2, ':').collect();
    if parts.len() != 2 {
        return None;
    }

    let id = parts[0].trim().to_string();
    let options: Vec<String> = parts[1].split('|').map(|s| s.trim().to_string()).collect();

    Some(RadioWidget { id, options })
}

pub fn parse_collapse(content: &str, start_idx: usize) -> Option<(CollapseWidget, usize)> {
    let lines: Vec<&str> = content.lines().collect();
    if start_idx >= lines.len() {
        return None;
    }

    let line = lines[start_idx].trim();
    let rest = if let Some(r) = line.strip_prefix("[collapse:") {
        r
    } else if let Some(r) = line.strip_prefix("[Collapse:") {
        r
    } else {
        return None;
    };

    let rest = rest.strip_suffix(']')?;

    let parts: Vec<&str> = rest.splitn(2, ':').collect();
    if parts.len() != 2 {
        return None;
    }

    let id = parts[0].trim().to_string();
    let title = parts[1].trim().to_string();

    let mut body_lines = Vec::new();
    let mut idx = start_idx + 1;
    while idx < lines.len() {
        let next_line = lines[idx].trim();
        if next_line.is_empty() {
            break;
        }
        if next_line.starts_with('[') && (next_line.contains(":button:") || next_line.contains(":slider:") ||
           next_line.contains(":checkbox:") || next_line.contains(":radio:") ||
           next_line.contains(":collapse:") || next_line.contains(":tab:")) {
            break;
        }
        body_lines.push(lines[idx].to_string());
        idx += 1;
    }

    Some((CollapseWidget {
        id,
        title,
        body: body_lines.join("\n"),
    }, idx))
}

pub fn parse_tab(line: &str) -> Option<TabWidget> {
    let line = line.trim();
    let rest = if let Some(r) = line.strip_prefix("[tab:") {
        r
    } else if let Some(r) = line.strip_prefix("[Tab:") {
        r
    } else {
        return None;
    };

    let rest = rest.strip_suffix(']')?;

    let parts: Vec<&str> = rest.splitn(2, ':').collect();
    if parts.len() != 2 {
        return None;
    }

    let id = parts[0].trim().to_string();
    let tabs: Vec<String> = parts[1].split('|').map(|s| s.trim().to_string()).collect();

    Some(TabWidget { id, tabs })
}

fn render_content(ui: &mut egui::Ui, state: &mut AppState) {
    ui.vertical(|ui| {
        let lines: Vec<&str> = state.original_content.lines().collect();
        let mut idx = 0;

        while idx < lines.len() {
            let line = lines[idx];
            let mut processed = false;

            if let Some(widget) = parse_button(line) {
                let id = widget.id.clone();
                let button_state = state.widget_state.buttons.entry(id.clone()).or_insert_with(|| {
                    ButtonState { clicked: false, label: widget.label.clone() }
                });
                ui.horizontal(|ui| {
                    let clicked = ui.button(&widget.label).clicked();
                    if clicked {
                        button_state.clicked = true;
                        state.dirty = true;
                        state.message = format!("Button '{}' clicked!", id);
                    }
                    if button_state.clicked {
                        ui.label("✓ Clicked");
                    }
                });
                idx += 1;
                processed = true;
            } else if let Some(widget) = parse_slider(line) {
                let id = widget.id.clone();
                let min = widget.min.unwrap_or(0.0);
                let max = widget.max.unwrap_or(100.0);
                let value = state.widget_state.sliders.entry(id.clone()).or_insert(widget.default.unwrap_or(min));
                ui.horizontal(|ui| {
                    let mut slider_value = *value;
                    ui.add(egui::Slider::new(&mut slider_value, min..=max).text(&id));
                    if (*value - slider_value).abs() > 0.01 {
                        *value = slider_value;
                        state.dirty = true;
                        state.message = format!("Slider '{}' changed to {:.1}", id, slider_value);
                    }
                    ui.label(format!(" = {:.1}", *value));
                });
                idx += 1;
                processed = true;
            } else if let Some(widget) = parse_checkbox(line) {
                let id = widget.id.clone();
                let checked = state.widget_state.checkboxes.entry(id.clone()).or_insert(false);
                let was_checked = *checked;
                let response = ui.checkbox(checked, format!("[{}] {}", id, widget.label));
                if response.clicked() && *checked != was_checked {
                    state.dirty = true;
                    state.message = format!("Checkbox '{}' toggled to {}", id, checked);
                }
                idx += 1;
                processed = true;
            } else if let Some(widget) = parse_radio(line) {
                let id = widget.id.clone();
                let selected = state.widget_state.radios.entry(id.clone()).or_insert_with(|| {
                    widget.options.first().cloned().unwrap_or_default()
                });
                let prev_selected = selected.clone();
                ui.group(|ui| {
                    ui.label(format!("[{}]", id));
                    for option in &widget.options {
                        ui.radio_value(selected, option.clone(), option);
                    }
                });
                if *selected != prev_selected {
                    state.dirty = true;
                    state.message = format!("Radio '{}' changed to {}", id, selected);
                }
                idx += 1;
                processed = true;
            } else if let Some((widget, next_idx)) = parse_collapse(&state.original_content, idx) {
                let id = widget.id.clone();
                let expanded = state.widget_state.collapses.entry(id.clone()).or_insert(false);
                let was_expanded = *expanded;
                let response = ui.collapsing(format!("[{}] {}", id, widget.title), |ui| {
                    ui.label(&widget.body);
                });
                *expanded = response.openness > 0.0;
                if *expanded != was_expanded {
                    state.dirty = true;
                    state.message = format!("Collapse '{}' {}", id, if *expanded { "expanded" } else { "collapsed" });
                }
                idx = next_idx;
                processed = true;
            } else if let Some(widget) = parse_tab(line) {
                let id = widget.id.clone();
                let selected = state.widget_state.tabs.entry(id.clone()).or_insert_with(|| {
                    widget.tabs.first().cloned().unwrap_or_default()
                });
                let prev_selected = selected.clone();
                ui.group(|ui| {
                    ui.label(format!("[{}]", id));
                    ui.horizontal(|ui| {
                        for tab in &widget.tabs {
                            ui.selectable_value(selected, tab.clone(), tab);
                        }
                    });
                });
                if *selected != prev_selected {
                    state.dirty = true;
                    state.message = format!("Tab '{}' changed to {}", id, selected);
                }
                idx += 1;
                processed = true;
            }

            if !processed {
                let mut text = line.to_string();
                text = text.replace("**", "");
                text = text.replace("*", "");
                text = text.replace("`", "");

                if text.starts_with("# ") {
                    ui.heading(text.trim_start_matches("# ").replace("# ", " "));
                } else if text.starts_with("## ") {
                    ui.heading(text.trim_start_matches("## "));
                } else if text.starts_with("```") {
                    ui.label(format!("{}...", text.trim_matches('`')));
                } else if !text.trim().is_empty() {
                    ui.label(text);
                } else {
                    ui.add_space(8.0);
                }
                idx += 1;
            }
        }
    });
}

fn save_interactions_to_file(_path: &PathBuf, _original: &str, state: &WidgetState) -> std::io::Result<String> {
    let mut output = String::new();

    for (id, button_state) in &state.buttons {
        if button_state.clicked {
            output.push_str(&format!("[button:{}: Clicked]\n", id));
        }
    }

    for (id, &value) in &state.sliders {
        output.push_str(&format!("[slider:{}:default={}]\n", id, value));
    }

    for (id, &checked) in &state.checkboxes {
        output.push_str(&format!("[checkbox:{}: Checked = {}]\n", id, checked));
    }

    for (id, selected) in &state.radios {
        output.push_str(&format!("[radio:{}: {}]\n", id, selected));
    }

    for (id, &expanded) in &state.collapses {
        output.push_str(&format!("[collapse:{}: {}]\n", id, if expanded { "Expanded" } else { "Collapsed" }));
    }

    for (id, selected) in &state.tabs {
        output.push_str(&format!("[tab:{}: {}]\n", id, selected));
    }

    Ok(output)
}

impl eframe::App for AppState {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        egui::TopBottomPanel::top("toolbar").show(ctx, |ui| {
            ui.horizontal(|ui| {
                if ui.button("Open").clicked() {
                    if let Some(path) = rfd::FileDialog::new()
                        .add_filter("Markdown", &["md", "markdown", "imd"])
                        .pick_file()
                    {
                        if let Ok(content) = fs::read_to_string(&path) {
                            self.file_path = Some(path);
                            self.original_content = content.clone();
                            let (parsed, widgets) = parse_interactive_widgets(&content);
                            self.widget_state = widgets;
                            let parser = Parser::new(&parsed);
                            let mut html_output = String::new();
                            html::push_html(&mut html_output, parser);
                            self.html_content = html_output;
                            self.content = content;
                            self.dirty = false;
                            self.message = "File loaded".to_string();
                        }
                    }
                }

                if ui.button("Save").clicked() {
                    if let Some(ref path) = self.file_path {
                        let interaction_output = save_interactions_to_file(path, &self.original_content, &self.widget_state).unwrap_or_default();
                        let full_content = format!("{}\n\n---\n\n# Interaction Results\n\n{}", self.original_content, interaction_output);
                        if fs::write(path, &full_content).is_ok() {
                            self.dirty = false;
                            self.message = "Saved!".to_string();
                        }
                    } else {
                        self.show_save_dialog = true;
                    }
                }

                if ui.button("Save As...").clicked() {
                    if let Some(path) = rfd::FileDialog::new()
                        .add_filter("Markdown", &["md", "markdown"])
                        .save_file()
                    {
                        let interaction_output = save_interactions_to_file(&path, &self.original_content, &self.widget_state).unwrap_or_default();
                        let full_content = format!("{}\n\n---\n\n# Interaction Results\n\n{}", self.original_content, interaction_output);
                        if fs::write(&path, &full_content).is_ok() {
                            self.file_path = Some(path);
                            self.dirty = false;
                            self.message = "Saved as new file!".to_string();
                        }
                    }
                }

                if self.dirty {
                    ui.label("● Modified");
                }

                ui.separator();

                if !self.message.is_empty() {
                    ui.label(&self.message);
                }
            });
        });

        egui::CentralPanel::default().show(ctx, |ui| {
            egui::ScrollArea::vertical().show(ui, |ui| {
                render_content(ui, self);
            });
        });
    }
}

fn main() -> eframe::Result<()> {
    env_logger::init();

    let args: Vec<String> = std::env::args().collect();
    let initial_file = args.get(1).map(PathBuf::from);

    let mut state = AppState::default();

    if let Some(ref path) = initial_file {
        if let Ok(content) = fs::read_to_string(path) {
            state.file_path = Some(path.clone());
            state.original_content = content.clone();
            let (parsed, widgets) = parse_interactive_widgets(&content);
            state.widget_state = widgets;
            let parser = Parser::new(&parsed);
            let mut html_output = String::new();
            html::push_html(&mut html_output, parser);
            state.html_content = html_output;
            state.content = content;
            state.dirty = false;
            state.message = format!("Loaded: {}", path.display());
        }
    }

    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_inner_size([1000.0, 700.0])
            .with_min_inner_size([600.0, 400.0])
            .with_title("MD Notepad - Interactive Markdown Editor"),
        ..Default::default()
    };

    eframe::run_native(
        "MD Notepad",
        options,
        Box::new(|_cc| Ok(Box::new(state))),
    )
}