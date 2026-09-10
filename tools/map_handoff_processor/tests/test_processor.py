import importlib.util
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "process_handoff.py"
SPEC = importlib.util.spec_from_file_location("process_handoff", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(MODULE)


class ProcessorUnitTests(unittest.TestCase):
    def test_normalizes_known_landmark_anomalies(self):
        cases = {
            "manhattan_bridge_transparent": "landmark_manhattan_bridge",
            "american_seamens_institute_transparent": "landmark_american_seamens_institute",
            "St. Anthony": "landmark_st_anthony",
            "St. Patrick’s Cathedral": "landmark_st_patricks_cathedral",
            "Little Ch. Around the Corner": "landmark_little_church_around_the_corner",
        }
        for source, expected in cases.items():
            self.assertEqual(MODULE.runtime_landmark_id(source), expected)

    def test_price_is_deterministic_and_stays_inside_tier(self):
        for tier, (low, high) in MODULE.PRICE_BANDS.items():
            first = MODULE.deterministic_price("seed", tier, "M0 0L1 1Z")
            second = MODULE.deterministic_price("seed", tier, "M0 0L1 1Z")
            self.assertEqual(first, second)
            self.assertGreaterEqual(first, low)
            self.assertLessEqual(first, high)
            self.assertEqual(first % MODULE.PRICE_STEP, 0)

    def test_target_size_caps_long_edge_without_changing_target_ratio_materially(self):
        width, height = MODULE.target_size((4096, 4096), (800, 400))
        self.assertEqual((width, height), (2048, 1024))


if __name__ == "__main__":
    unittest.main()
