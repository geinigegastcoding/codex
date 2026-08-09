export const pythonHarness = String.raw`
import ast
import contextlib
import io
import json
import traceback

BLOCKED_IMPORTS = {'js', 'pyodide', 'micropip', 'os', 'sys', 'subprocess', 'socket', 'pathlib', 'shutil', 'ctypes', 'multiprocessing'}

def normalize(value):
    if isinstance(value, tuple):
        return [normalize(item) for item in value]
    if isinstance(value, list):
        return [normalize(item) for item in value]
    if isinstance(value, set):
        return sorted(normalize(item) for item in value)
    if isinstance(value, dict):
        return {str(key): normalize(item) for key, item in value.items()}
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return repr(value)

def close_number(actual, expected, tolerance):
    if isinstance(actual, (int, float)) and isinstance(expected, (int, float)):
        return abs(actual - expected) <= tolerance
    if isinstance(actual, list) and isinstance(expected, list) and len(actual) == len(expected):
        return all(close_number(a, e, tolerance) for a, e in zip(actual, expected))
    if isinstance(actual, dict) and isinstance(expected, dict) and actual.keys() == expected.keys():
        return all(close_number(actual[key], expected[key], tolerance) for key in actual)
    return actual == expected

def compare(actual, expected, mode, tolerance):
    actual = normalize(actual)
    expected = normalize(expected)
    if mode == 'unordered':
        return sorted(actual, key=repr) == sorted(expected, key=repr)
    if mode == 'set-equivalent':
        return set(map(repr, actual)) == set(map(repr, expected))
    if mode == 'case-insensitive':
        return str(actual).lower() == str(expected).lower()
    if mode == 'numeric-tolerance':
        return close_number(actual, expected, tolerance)
    return actual == expected

def run_course_tests(user_code, tests_json, allowed_json):
    tests = json.loads(tests_json)
    allowed = set(json.loads(allowed_json))
    output = io.StringIO()
    try:
        tree = ast.parse(user_code)
        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                names = [alias.name.split('.')[0] for alias in node.names] if isinstance(node, ast.Import) else [(node.module or '').split('.')[0]]
                for name in names:
                    if name in BLOCKED_IMPORTS or name not in allowed:
                        return {'status': 'blocked-import', 'tests': [], 'stdout': '', 'error': f'Import {name!r} is not allowed in this exercise.'}
    except SyntaxError as error:
        return {'status': 'syntax-error', 'tests': [], 'stdout': '', 'error': error.msg, 'line': error.lineno}

    namespace = {'__name__': '__learner__'}
    try:
        with contextlib.redirect_stdout(output), contextlib.redirect_stderr(output):
            exec(compile(tree, '<learner>', 'exec'), namespace)
    except Exception as error:
        return {'status': 'runtime-error', 'tests': [], 'stdout': output.getvalue()[:32768], 'error': f'{type(error).__name__}: {error}'}

    results = []
    for test in tests:
        try:
            function = namespace.get(test['functionName'])
            if not callable(function):
                results.append({'name': test['name'], 'passed': False, 'message': f"Define a callable named {test['functionName']}."})
                continue
            expected_exception = test.get('expectedException')
            try:
                actual = function(*test.get('args', []))
            except Exception as error:
                if expected_exception and type(error).__name__ == expected_exception:
                    results.append({'name': test['name'], 'passed': True, 'message': f'Raised {expected_exception} as expected.'})
                else:
                    results.append({'name': test['name'], 'passed': False, 'message': f'{type(error).__name__}: {error}'})
                continue
            if expected_exception:
                results.append({'name': test['name'], 'passed': False, 'message': f'Expected {expected_exception}, but no exception was raised.'})
                continue
            expected = test.get('expected')
            passed = compare(actual, expected, test.get('comparison', 'exact'), test.get('tolerance', 1e-9))
            results.append({'name': test['name'], 'passed': passed, 'message': 'Passed.' if passed else f'Expected {expected!r}, received {normalize(actual)!r}.'})
        except Exception as error:
            results.append({'name': test.get('name', 'test'), 'passed': False, 'message': f'Checker error: {type(error).__name__}: {error}'})

    captured = output.getvalue()
    if len(captured) > 32768:
        return {'status': 'runtime-error', 'tests': results, 'stdout': captured[:32768], 'error': 'Your program printed more than 32 KB. Remove debug output or check for a runaway loop.'}
    return {'status': 'passed' if all(result['passed'] for result in results) else 'failed', 'tests': results, 'stdout': captured}

json.dumps(run_course_tests(USER_CODE, TESTS_JSON, ALLOWED_JSON))
`
