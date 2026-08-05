extends SceneTree

const RuntimeTests := preload("res://tests/test_runtime.gd")
const FAILURE_ARGUMENT := "--intentional-failure"


func _init() -> void:
	var include_intentional_failure := FAILURE_ARGUMENT in OS.get_cmdline_user_args()
	var failures := RuntimeTests.run(include_intentional_failure)

	if failures.is_empty():
		print("M0G_TESTS_PASS count=4")
		quit(0)
		return

	for failure in failures:
		printerr("M0G_TEST_FAILURE: %s" % failure)
	printerr("M0G_TESTS_FAIL count=%d" % failures.size())
	quit(1)
