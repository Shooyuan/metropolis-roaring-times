class_name RuntimeSmokeTests
extends RefCounted


static func run(include_intentional_failure: bool) -> Array[String]:
	var failures: Array[String] = []
	_expect_equal(
		failures,
		ProjectSettings.get_setting("application/config/name"),
		"Metropolis: Roaring Times",
		"Project display name must use the approved title."
	)
	_expect_equal(
		failures,
		ProjectSettings.get_setting("application/run/main_scene"),
		"res://scenes/main/main.tscn",
		"The approved minimum main scene must be configured."
	)
	_expect_equal(
		failures,
		ProjectSettings.get_setting("rendering/renderer/rendering_method"),
		"gl_compatibility",
		"The project must use the Compatibility renderer."
	)
	_expect_true(
		failures,
		ResourceLoader.exists("res://scenes/main/main.tscn", "PackedScene"),
		"The main scene must load as a PackedScene."
	)

	if include_intentional_failure:
		_expect_true(failures, false, "Intentional isolated failure demonstration.")

	return failures


static func _expect_true(failures: Array[String], condition: bool, message: String) -> void:
	if not condition:
		failures.append(message)


static func _expect_equal(failures: Array[String], actual: Variant, expected: Variant, message: String) -> void:
	if actual != expected:
		failures.append("%s Expected %s, received %s." % [message, expected, actual])
