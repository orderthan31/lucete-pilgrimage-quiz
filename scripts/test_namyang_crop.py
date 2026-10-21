"""Run with python3 -m unittest discover -s scripts -p 'test_namyang_crop.py'."""
import json
import math
from pathlib import Path
import unittest

from namyang_crop import subject_crop


class SubjectCropTests(unittest.TestCase):
    def assert_subject_kept(self, width, height, subject, box):
        x1, y1, x2, y2 = box
        self.assertGreaterEqual(x1, -1e-6)
        self.assertGreaterEqual(y1, -1e-6)
        self.assertLessEqual(x2, width + 1e-6)
        self.assertLessEqual(y2, height + 1e-6)
        self.assertAlmostEqual((x2 - x1) / (y2 - y1), 16 / 9)
        self.assertLessEqual(x1, subject[0] * width + 1e-6)
        self.assertLessEqual(y1, subject[1] * height + 1e-6)
        self.assertGreaterEqual(x2, subject[2] * width - 1e-6)
        self.assertGreaterEqual(y2, subject[3] * height - 1e-6)

    def test_sanctuary_cross_panels_and_altar_survive_every_motion_phase(self):
        roi = (.34, .005, .84, .45)
        for frame in range(576):
            phase = frame * math.tau / 576
            box = subject_crop(1194, 1085, 16 / 9,
                               zoom=1.012 + .010 * math.sin(phase),
                               subject=roi, focus=(.58, .25),
                               pan=(.004 * math.sin(phase), .003 * math.cos(phase)))
            self.assert_subject_kept(1194, 1085, roi, box)
            self.assertLessEqual(box[1], .005 * 1085 + 1e-6)

    def test_zoom_is_reduced_instead_of_cutting_full_landscape(self):
        roi = (0, 0, 1, 1)
        box = subject_crop(1920, 1080, 16 / 9, zoom=1.5, subject=roi)
        self.assertEqual(box, (0, 0, 1920, 1080))

    def test_wide_architecture_stays_in_frame_with_arbitrary_pan(self):
        roi = (.05, .1, .95, .9)
        for pan in ((-.5, -.5), (.5, .5), (0, 0)):
            box = subject_crop(2400, 1350, 16 / 9, zoom=1.02, subject=roi, pan=pan)
            self.assert_subject_kept(2400, 1350, roi, box)

    def test_live_manifest_subjects_are_safe_at_all_rendered_phases(self):
        manifest = json.loads((Path(__file__).resolve().parents[1] / 'public/media/namyang-background.sources.json').read_text())
        frames = manifest['fps'] * manifest['duration_seconds']
        self.assertEqual(len(manifest['sources']), 3)
        for index, source in enumerate(manifest['sources']):
            for frame in range(frames):
                phase = math.tau * frame / frames + index * .8
                box = subject_crop(source['width'], source['height'], manifest['width'] / manifest['height'],
                                   zoom=1.012 + .010 * math.sin(phase),
                                   subject=source['subject_bbox'], focus=source['focal_point'],
                                   pan=(.004 * math.sin(phase), .003 * math.cos(phase)))
                self.assert_subject_kept(source['width'], source['height'], source['subject_bbox'], box)

    def test_portrait_full_subject_requires_a_different_source(self):
        with self.assertRaisesRegex(ValueError, 'cannot fit'):
            subject_crop(1536, 1707, 16 / 9, subject=(0, 0, 1, 1))

    def test_invalid_and_nonfinite_inputs_are_rejected(self):
        for subject in ((.5, 0, .4, 1), (0, -.1, 1, 1), (0, 0, 1, float('nan'))):
            with self.assertRaises(ValueError):
                subject_crop(1920, 1080, 16 / 9, subject=subject)
        with self.assertRaises(ValueError):
            subject_crop(0, 1080, 16 / 9)


if __name__ == '__main__':
    unittest.main()
