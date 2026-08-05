extends Control

const PERSISTENCE_PATH := "user://m0g_runtime_probe.txt"
const AUTO_QUIT_ARGUMENT := "--m0g-auto-quit"

@onready var status_label: Label = %StatusLabel
@onready var platform_label: Label = %PlatformLabel


func _ready() -> void:
	var visit_count := _increment_persistence_probe()
	var platform_name := "Web" if OS.has_feature("web") else "Native"
	status_label.text = "Runtime ready · persistence visit %d" % visit_count
	platform_label.text = "%s · Compatibility · single-thread Web target" % platform_name
	print("M0G_RUNTIME_READY platform=%s persistence_visit=%d" % [platform_name, visit_count])

	if AUTO_QUIT_ARGUMENT in OS.get_cmdline_user_args():
		get_tree().quit.call_deferred(0)


func _increment_persistence_probe() -> int:
	var previous_count := 0
	if FileAccess.file_exists(PERSISTENCE_PATH):
		var previous_text := FileAccess.get_file_as_string(PERSISTENCE_PATH).strip_edges()
		if previous_text.is_valid_int():
			previous_count = maxi(0, previous_text.to_int())

	var next_count := previous_count + 1
	var probe_file := FileAccess.open(PERSISTENCE_PATH, FileAccess.WRITE)
	if probe_file == null:
		push_error("M0G persistence probe could not open %s (error %s)." % [PERSISTENCE_PATH, FileAccess.get_open_error()])
		return previous_count

	probe_file.store_string(str(next_count))
	probe_file.close()
	return next_count


func _on_exit_button_pressed() -> void:
	get_tree().quit(0)
