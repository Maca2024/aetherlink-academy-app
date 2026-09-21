#!/usr/bin/env python3
"""Targeted tests for the first-hook path boundary."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).with_name("protect_output.py")
SHELL_WRAPPER = Path(__file__).with_name("protect-output.sh")


class ProtectOutputHookTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name) / "project"
        self.root.mkdir()
        (self.root / "participant-output" / "nested").mkdir(parents=True)
        self.outside = Path(self.temp_dir.name) / "outside"
        self.outside.mkdir()
        self.env = os.environ.copy()
        self.env["CLAUDE_PROJECT_DIR"] = str(self.root)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def run_hook(self, fixture: object, *, cwd: Path | None = None, env: dict[str, str] | None = None) -> subprocess.CompletedProcess[str]:
        raw = fixture if isinstance(fixture, str) else json.dumps(fixture)
        return subprocess.run(
            [sys.executable, str(SCRIPT)],
            input=raw,
            text=True,
            capture_output=True,
            cwd=str(cwd or self.root),
            env=env or self.env,
            check=False,
        )

    def assert_exit(self, expected: int, fixture: object, **kwargs: object) -> None:
        result = self.run_hook(fixture, **kwargs)
        self.assertEqual(expected, result.returncode, result.stderr)

    def test_valid_nested_output_is_allowed(self) -> None:
        self.assert_exit(0, {"tool_input": {"file_path": "participant-output/nested/report.md"}})

    def test_parent_traversal_is_denied(self) -> None:
        self.assert_exit(2, {"tool_input": {"file_path": "participant-output/../README.md"}})

    def test_absolute_outside_path_is_denied(self) -> None:
        self.assert_exit(2, {"tool_input": {"file_path": str(self.outside / "participant-output" / "demo.md")}})

    def test_symlink_escape_is_denied(self) -> None:
        link = self.root / "participant-output" / "escape"
        try:
            link.symlink_to(self.outside, target_is_directory=True)
        except (NotImplementedError, OSError) as exc:
            self.skipTest(f"symlinks unavailable: {exc}")
        self.assert_exit(2, {"tool_input": {"file_path": "participant-output/escape/demo.md"}})

    def test_malformed_json_is_denied(self) -> None:
        self.assert_exit(2, "{not-json")

    def test_missing_path_is_denied(self) -> None:
        self.assert_exit(2, {"tool_input": {}})

    def test_relative_path_uses_project_env_when_cwd_differs(self) -> None:
        self.assert_exit(0, {"tool_input": {"file_path": "participant-output/from-another-cwd.md"}}, cwd=self.outside)

    def test_fallback_uses_hook_cwd_without_project_env(self) -> None:
        env = self.env.copy()
        env.pop("CLAUDE_PROJECT_DIR")
        self.assert_exit(0, {"tool_input": {"file_path": "participant-output/from-hook-cwd.md"}}, env=env)

    @unittest.skipIf(os.name == "nt", "bash wrapper is not available on native Windows")
    def test_shell_wrapper_delegates_to_python_boundary(self) -> None:
        result = subprocess.run(
            ["bash", str(SHELL_WRAPPER)],
            input=json.dumps({"tool_input": {"file_path": "participant-output/wrapped.md"}}),
            text=True,
            capture_output=True,
            cwd=str(self.root),
            env=self.env,
            check=False,
        )
        self.assertEqual(0, result.returncode, result.stderr)
        result = subprocess.run(
            ["bash", str(SHELL_WRAPPER)],
            input=json.dumps({"tool_input": {"file_path": "participant-output/../README.md"}}),
            text=True,
            capture_output=True,
            cwd=str(self.root),
            env=self.env,
            check=False,
        )
        self.assertEqual(2, result.returncode, result.stderr)


if __name__ == "__main__":
    unittest.main()
