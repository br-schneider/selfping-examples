import importlib.util
import io
import os
import pathlib
import sys
import unittest
from contextlib import redirect_stdout, redirect_stderr
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("notify_job", pathlib.Path(__file__).parents[1] / "examples" / "notify_job.py")
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


class WrapperTests(unittest.TestCase):
    def test_success_is_quiet(self):
        with patch.dict(os.environ, {}, clear=True), patch.object(sys, "argv", ["notify_job.py", sys.executable, "-c", "pass"]), patch.object(runner, "notify") as notify:
            self.assertEqual(runner.main(), 0)
            notify.assert_not_called()

    def test_dry_failure_preserves_exit_and_never_sends(self):
        with patch.dict(os.environ, {}, clear=True), patch.object(sys, "argv", ["notify_job.py", sys.executable, "-c", "import sys; sys.exit(7)"]), patch("urllib.request.urlopen") as request, redirect_stdout(io.StringIO()):
            self.assertEqual(runner.main(), 7)
            request.assert_not_called()

    def test_notification_failure_preserves_job_exit(self):
        with patch.dict(os.environ, {"SELFPING_SEND": "1", "SELFPING_API_KEY": "sp_fixture_only"}, clear=True), patch.object(sys, "argv", ["notify_job.py", sys.executable, "-c", "import sys; sys.exit(7)"]), patch("urllib.request.urlopen", side_effect=TimeoutError()), redirect_stderr(io.StringIO()):
            self.assertEqual(runner.main(), 7)
