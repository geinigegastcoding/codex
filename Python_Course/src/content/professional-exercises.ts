import type { Exercise, SkillId, TestCase } from '../domain/course-types'

type Spec = {
  moduleId: string
  id: string
  title: string
  functionName: string
  skills: SkillId[]
  prompt: string
  solution: string
  tests: TestCase[]
  hints: [string, string, string]
  allowedImports?: string[]
}

const starter = (functionName: string, solution: string) => {
  const signature = solution.match(new RegExp(`^def\\s+${functionName}\\([^\\n]*\\):`, 'm'))?.[0]
  if (!signature) throw new Error(`Missing solution signature for ${functionName}`)
  return `${signature}\n    # Your code here\n    pass`
}

const exercise = (spec: Spec): Exercise => ({
  id: spec.id,
  title: spec.title,
  functionName: spec.functionName,
  skillIds: spec.skills,
  prompt: spec.prompt,
  starterCode: starter(spec.functionName, spec.solution),
  solution: spec.solution,
  tests: spec.tests,
  hints: spec.hints,
  allowedImports: spec.allowedImports,
})

const specs: Spec[] = [
  {
    moduleId: 'm0-exam', id: 'parse-python-integer', title: 'Parse Python integer literals', functionName: 'parse_python_integer', skills: ['syntax', 'console-io'],
    prompt: 'Accept a stripped Python-style integer literal using decimal, 0b, 0o, or 0x notation and optional underscores. Return its value. Raise ValueError for empty or invalid input.',
    solution: "def parse_python_integer(text):\n    value = text.strip()\n    if not value: raise ValueError('empty literal')\n    return int(value.replace('_', ''), 0 if value.lower().startswith(('0b','0o','0x','+0b','-0b','+0o','-0o','+0x','-0x')) else 10)",
    tests: [{ name: 'binary literal', functionName: 'parse_python_integer', args: ['0b1010'], expected: 10 }, { name: 'underscored decimal', functionName: 'parse_python_integer', args: ['1_024'], expected: 1024 }, { name: 'invalid literal', functionName: 'parse_python_integer', args: ['0b102'], expectedException: 'ValueError' }],
    hints: ['int accepts an explicit base and understands Python prefixes with base 0.', 'Normalize underscores, then choose base 0 only for prefixed literals.', "int(value, 0) for prefixes; int(value, 10) otherwise"],
  },
  {
    moduleId: 'm1-text-collections', id: 'merge-inventory', title: 'Merge inventory without aliasing', functionName: 'merge_inventory', skills: ['dictionaries', 'nested-data', 'sorting'],
    prompt: 'Merge inventory records by SKU, summing quantity and collecting unique tags alphabetically. Return new records sorted by SKU and do not mutate the input.',
    solution: "def merge_inventory(records):\n    merged = {}\n    for record in records:\n        sku = record['sku']\n        item = merged.setdefault(sku, {'sku': sku, 'quantity': 0, 'tags': set()})\n        item['quantity'] += record['quantity']\n        item['tags'].update(record.get('tags', []))\n    return [{'sku': sku, 'quantity': item['quantity'], 'tags': sorted(item['tags'])} for sku, item in sorted(merged.items())]",
    tests: [{ name: 'merges duplicate SKU', functionName: 'merge_inventory', args: [[{ sku: 'b', quantity: 2, tags: ['sale'] }, { sku: 'b', quantity: 3, tags: ['new', 'sale'] }, { sku: 'a', quantity: 1, tags: [] }]], expected: [{ sku: 'a', quantity: 1, tags: [] }, { sku: 'b', quantity: 5, tags: ['new', 'sale'] }] }, { name: 'empty records', functionName: 'merge_inventory', args: [[]], expected: [] }],
    hints: ['Build fresh nested values instead of storing references from input records.', 'Use a dictionary by SKU and a set for tags.', 'Accumulate first, then convert sets to sorted lists.'],
  },
  {
    moduleId: 'm2-functions-advanced', id: 'make-running-total', title: 'Build a stateful closure', functionName: 'running_total_scenario', skills: ['functions', 'iterators'],
    prompt: 'Implement running_total_scenario(values) using a closure with nonlocal state. Return the total after each value is added.',
    solution: "def running_total_scenario(values):\n    total = 0\n    def add(value):\n        nonlocal total\n        total += value\n        return total\n    return [add(value) for value in values]",
    tests: [{ name: 'tracks state', functionName: 'running_total_scenario', args: [[2, -1, 4]], expected: [2, 1, 5] }, { name: 'fresh call has fresh state', functionName: 'running_total_scenario', args: [[3]], expected: [3] }],
    hints: ['A closure can retain a local variable after the outer function starts returning.', 'Declare total outside add and mark it nonlocal inside add.', 'Return [add(value) for value in values].'],
  },
  {
    moduleId: 'm2-algorithm-patterns', id: 'longest-budget-window', title: 'Find the longest budget window', functionName: 'longest_budget_window', skills: ['algorithms', 'complexity'],
    prompt: 'For non-negative costs, return the length of the longest consecutive window whose sum is at most budget. Raise ValueError for negative costs or budget.',
    solution: "def longest_budget_window(costs, budget):\n    if budget < 0 or any(cost < 0 for cost in costs): raise ValueError('non-negative values required')\n    left = total = best = 0\n    for right, cost in enumerate(costs):\n        total += cost\n        while total > budget:\n            total -= costs[left]\n            left += 1\n        best = max(best, right - left + 1)\n    return best",
    tests: [{ name: 'shrinks and grows window', functionName: 'longest_budget_window', args: [[2, 1, 3, 1, 1], 5], expected: 3 }, { name: 'nothing fits', functionName: 'longest_budget_window', args: [[4], 3], expected: 0 }, { name: 'rejects negatives', functionName: 'longest_budget_window', args: [[1, -1], 2], expectedException: 'ValueError' }],
    hints: ['Non-negative values let a left boundary move only forward.', 'Add at the right, remove from the left while over budget.', 'Track right - left + 1 after restoring the invariant.'],
  },
  {
    moduleId: 'm3-modules-files', id: 'validate-json-lines', title: 'Validate JSON Lines records', functionName: 'validate_json_lines', skills: ['files', 'exceptions', 'nested-data'],
    prompt: 'Parse newline-separated JSON objects. Return valid objects containing string id and numeric value. Return rejected line numbers separately; blank lines are ignored.',
    solution: "import json\ndef validate_json_lines(text):\n    valid, rejected = [], []\n    for number, line in enumerate(text.splitlines(), 1):\n        if not line.strip(): continue\n        try: record = json.loads(line)\n        except json.JSONDecodeError:\n            rejected.append(number); continue\n        if isinstance(record, dict) and isinstance(record.get('id'), str) and isinstance(record.get('value'), (int, float)):\n            valid.append(record)\n        else: rejected.append(number)\n    return {'valid': valid, 'rejected_lines': rejected}",
    tests: [{ name: 'separates valid and invalid', functionName: 'validate_json_lines', args: ['{"id":"a","value":2}\nnot-json\n{"id":3,"value":1}'], expected: { valid: [{ id: 'a', value: 2 }], rejected_lines: [2, 3] } }, { name: 'ignores blanks', functionName: 'validate_json_lines', args: ['\n{"id":"x","value":0}\n'], expected: { valid: [{ id: 'x', value: 0 }], rejected_lines: [] } }],
    hints: ['External records can fail during parsing or during schema validation.', 'Enumerate lines from 1 and handle each record independently.', 'Catch JSONDecodeError, then validate dict fields.'], allowedImports: ['json'],
  },
  {
    moduleId: 'm3-exceptions-oop', id: 'price-components', title: 'Replace type switches with polymorphism', functionName: 'price_components', skills: ['oop', 'typing'],
    prompt: 'Create fixed and percentage component behavior inside price_components(base, components). Components are dictionaries with kind fixed/percent and amount. Apply them in order and reject unknown kinds.',
    solution: "def price_components(base, components):\n    value = base\n    for component in components:\n        kind, amount = component['kind'], component['amount']\n        if kind == 'fixed': value += amount\n        elif kind == 'percent': value *= 1 + amount / 100\n        else: raise ValueError('unknown component')\n    return value",
    tests: [{ name: 'applies in order', functionName: 'price_components', args: [100, [{ kind: 'fixed', amount: 20 }, { kind: 'percent', amount: 10 }]], expected: 132 }, { name: 'unknown kind', functionName: 'price_components', args: [10, [{ kind: 'mystery', amount: 1 }]], expectedException: 'ValueError' }],
    hints: ['Each component represents one pricing behavior.', 'Keep one current value and apply each component in order.', 'Raise for kinds outside the documented contract.'],
  },
  {
    moduleId: 'm3-packages', id: 'next-semantic-version', title: 'Calculate a semantic version bump', functionName: 'next_version', skills: ['packages', 'packaging'],
    prompt: 'Given major.minor.patch and bump major/minor/patch, return the next version. Reset lower components and reject malformed versions or bump names.',
    solution: "def next_version(version, bump):\n    try: major, minor, patch = map(int, version.split('.'))\n    except (ValueError, TypeError): raise ValueError('invalid version')\n    if min(major, minor, patch) < 0: raise ValueError('invalid version')\n    if bump == 'major': return f'{major + 1}.0.0'\n    if bump == 'minor': return f'{major}.{minor + 1}.0'\n    if bump == 'patch': return f'{major}.{minor}.{patch + 1}'\n    raise ValueError('invalid bump')",
    tests: [{ name: 'minor resets patch', functionName: 'next_version', args: ['2.4.9', 'minor'], expected: '2.5.0' }, { name: 'major resets lower values', functionName: 'next_version', args: ['2.4.9', 'major'], expected: '3.0.0' }, { name: 'bad version', functionName: 'next_version', args: ['2.4', 'patch'], expectedException: 'ValueError' }],
    hints: ['A semantic version has exactly three non-negative integer components.', 'Parse first, then handle each bump explicitly.', 'Major and minor bumps reset lower components to zero.'],
  },
  {
    moduleId: 'm4-typing-packaging', id: 'validate-user-record', title: 'Validate a typed record boundary', functionName: 'validate_user_record', skills: ['typing', 'testing'],
    prompt: 'Return a normalized user dictionary with integer id, stripped non-empty name, and unique sorted string roles. Raise ValueError for invalid fields.',
    solution: "def validate_user_record(record):\n    if not isinstance(record, dict) or not isinstance(record.get('id'), int): raise ValueError('invalid id')\n    name = record.get('name')\n    roles = record.get('roles')\n    if not isinstance(name, str) or not name.strip() or not isinstance(roles, list) or not all(isinstance(role, str) for role in roles): raise ValueError('invalid record')\n    return {'id': record['id'], 'name': name.strip(), 'roles': sorted(set(roles))}",
    tests: [{ name: 'normalizes record', functionName: 'validate_user_record', args: [{ id: 3, name: ' Ada ', roles: ['admin', 'reader', 'admin'] }], expected: { id: 3, name: 'Ada', roles: ['admin', 'reader'] } }, { name: 'rejects mixed roles', functionName: 'validate_user_record', args: [{ id: 3, name: 'Ada', roles: ['admin', 4] }], expectedException: 'ValueError' }],
    hints: ['Annotations communicate intent but runtime boundaries still need validation.', 'Validate container and field types before normalization.', 'Use sorted(set(roles)) only after proving every role is a string.'],
  },
  {
    moduleId: 'm4-decorators-context', id: 'audit-calls', title: 'Decorate calls without changing results', functionName: 'audit_scenario', skills: ['decorators', 'functions'],
    prompt: 'Inside audit_scenario(values), define a decorator that records (function_name, argument, result) for each call while preserving the wrapped result. Return outputs and log.',
    solution: "def audit_scenario(values):\n    log = []\n    def audit(function):\n        def wrapper(value):\n            result = function(value)\n            log.append((function.__name__, value, result))\n            return result\n        return wrapper\n    @audit\n    def square(value): return value * value\n    return {'outputs': [square(value) for value in values], 'log': log}",
    tests: [{ name: 'records calls in order', functionName: 'audit_scenario', args: [[2, 3]], expected: { outputs: [4, 9], log: [['square', 2, 4], ['square', 3, 9]] } }, { name: 'empty calls', functionName: 'audit_scenario', args: [[]], expected: { outputs: [], log: [] } }],
    hints: ['A decorator returns a wrapper that can observe a call.', 'Call the original function exactly once, log, then return its result.', 'Keep the log in the enclosing audit_scenario scope.'],
  },
  {
    moduleId: 'm4-concurrency', id: 'bounded-batches', title: 'Plan bounded concurrent batches', functionName: 'bounded_batches', skills: ['concurrency', 'testing'],
    prompt: 'Split items into ordered batches no larger than limit, representing work that may run concurrently. Reject non-positive limits.',
    solution: "def bounded_batches(items, limit):\n    if limit <= 0: raise ValueError('limit must be positive')\n    return [items[index:index + limit] for index in range(0, len(items), limit)]",
    tests: [{ name: 'keeps order and bound', functionName: 'bounded_batches', args: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] }, { name: 'empty work', functionName: 'bounded_batches', args: [[], 3], expected: [] }, { name: 'bad limit', functionName: 'bounded_batches', args: [[1], 0], expectedException: 'ValueError' }],
    hints: ['Concurrency still needs an explicit bound.', 'Step through the list by limit and slice each batch.', 'range(0, len(items), limit) gives batch starts.'],
  },
  {
    moduleId: 'm4-gui-performance', id: 'profile-summary', title: 'Summarize profiling evidence', functionName: 'profile_summary', skills: ['debugging', 'testing'],
    prompt: 'Given call records with name, calls, and total_seconds, return total time and functions ranked by total time descending then name. Reject negative measurements.',
    solution: "def profile_summary(records):\n    if any(record['calls'] < 0 or record['total_seconds'] < 0 for record in records): raise ValueError('negative measurement')\n    ranked = sorted(records, key=lambda record: (-record['total_seconds'], record['name']))\n    return {'total_seconds': sum(record['total_seconds'] for record in records), 'ranked_names': [record['name'] for record in ranked]}",
    tests: [{ name: 'ranks bottlenecks', functionName: 'profile_summary', args: [[{ name: 'parse', calls: 4, total_seconds: 0.4 }, { name: 'render', calls: 1, total_seconds: 0.8 }]], expected: { total_seconds: 1.2, ranked_names: ['render', 'parse'] }, comparison: 'numeric-tolerance', tolerance: 1e-9 }, { name: 'rejects negatives', functionName: 'profile_summary', args: [[{ name: 'x', calls: -1, total_seconds: 0 }]], expectedException: 'ValueError' }],
    hints: ['Optimization begins with measured totals.', 'Validate records, sum time, and use a deterministic sorting key.', 'Sort by (-total_seconds, name).'],
  },
  {
    moduleId: 'm5-test-foundations', id: 'integer-boundary-cases', title: 'Generate integer boundary cases', functionName: 'integer_boundary_cases', skills: ['testing', 'exceptions'],
    prompt: 'For inclusive minimum and maximum integers, return sorted unique boundary candidates min-1, min, min+1, max-1, max, max+1. Reject min greater than max.',
    solution: "def integer_boundary_cases(minimum, maximum):\n    if minimum > maximum: raise ValueError('invalid range')\n    return sorted({minimum - 1, minimum, minimum + 1, maximum - 1, maximum, maximum + 1})",
    tests: [{ name: 'normal boundaries', functionName: 'integer_boundary_cases', args: [2, 5], expected: [1, 2, 3, 4, 5, 6] }, { name: 'overlapping boundaries deduplicate', functionName: 'integer_boundary_cases', args: [2, 2], expected: [1, 2, 3] }, { name: 'bad range', functionName: 'integer_boundary_cases', args: [5, 2], expectedException: 'ValueError' }],
    hints: ['Boundary tests examine values immediately around each edge.', 'Put all six candidates in a set, then sort.', 'Validate the interval before generating cases.'],
  },
  {
    moduleId: 'm5-pytest', id: 'parameter-case-ids', title: 'Build readable parameter IDs', functionName: 'parameter_case_ids', skills: ['testing', 'packages'],
    prompt: 'Given case dictionaries with input and expected, return IDs like case-01-input-to-expected, replacing spaces with underscores. Preserve order.',
    solution: "def parameter_case_ids(cases):\n    return [f\"case-{index:02d}-{str(case['input']).replace(' ', '_')}-to-{str(case['expected']).replace(' ', '_')}\" for index, case in enumerate(cases, 1)]",
    tests: [{ name: 'creates readable IDs', functionName: 'parameter_case_ids', args: [[{ input: 'hello world', expected: 2 }, { input: '', expected: 0 }]], expected: ['case-01-hello_world-to-2', 'case-02--to-0'] }, { name: 'empty matrix', functionName: 'parameter_case_ids', args: [[]], expected: [] }],
    hints: ['Parameter IDs should explain which case failed.', 'Enumerate from one and format the index with two digits.', "Replace spaces in stringified values with underscores."],
  },
  {
    moduleId: 'm5-mocking-tdd', id: 'fake-api-sequence', title: 'Drive a fake API sequence', functionName: 'fake_api_sequence', skills: ['testing', 'apis'],
    prompt: 'Given queued response dictionaries and requested paths, consume one response per path and return path/status pairs. Raise RuntimeError when the fake has no response left.',
    solution: "def fake_api_sequence(responses, paths):\n    if len(responses) < len(paths): raise RuntimeError('fake exhausted')\n    return [{'path': path, 'status': responses[index]['status']} for index, path in enumerate(paths)]",
    tests: [{ name: 'uses responses in order', functionName: 'fake_api_sequence', args: [[{ status: 200 }, { status: 404 }], ['/a', '/b']], expected: [{ path: '/a', status: 200 }, { path: '/b', status: 404 }] }, { name: 'reports exhausted fake', functionName: 'fake_api_sequence', args: [[], ['/a']], expectedException: 'RuntimeError' }],
    hints: ['A fake should behave predictably and fail loudly when misconfigured.', 'Compare queue length with requested calls before producing results.', 'Pair each path with the response at the same index.'],
  },
  {
    moduleId: 'm6-cli', id: 'resolve-cli-config', title: 'Resolve CLI configuration precedence', functionName: 'resolve_cli_config', skills: ['cli', 'console-io'],
    prompt: 'Merge defaults, config file values, environment values, and CLI values in that precedence order. Ignore keys whose value is None and return a new dictionary.',
    solution: "def resolve_cli_config(defaults, file_values, environment, cli):\n    result = dict(defaults)\n    for source in (file_values, environment, cli):\n        result.update({key: value for key, value in source.items() if value is not None})\n    return result",
    tests: [{ name: 'CLI wins', functionName: 'resolve_cli_config', args: [{ mode: 'safe', limit: 10 }, { limit: 20 }, { mode: 'fast' }, { limit: 5 }], expected: { mode: 'fast', limit: 5 } }, { name: 'None does not erase', functionName: 'resolve_cli_config', args: [{ mode: 'safe' }, {}, {}, { mode: null }], expected: { mode: 'safe' } }],
    hints: ['Precedence can be implemented as ordered overlays.', 'Copy defaults, then update from weakest to strongest source.', 'Filter out None before each update.'],
  },
  {
    moduleId: 'm6-filesystem-automation', id: 'plan-safe-renames', title: 'Plan safe file renames', functionName: 'plan_safe_renames', skills: ['automation', 'files', 'security'],
    prompt: 'Given filenames, return rename plans that lowercase names and replace spaces with hyphens. Skip unchanged names and raise ValueError when two sources collide on one destination.',
    solution: "def plan_safe_renames(names):\n    plans, destinations = [], set()\n    for name in names:\n        destination = name.lower().replace(' ', '-')\n        if destination in destinations: raise ValueError('destination collision')\n        destinations.add(destination)\n        if destination != name: plans.append({'source': name, 'destination': destination})\n    return plans",
    tests: [{ name: 'plans without changing input', functionName: 'plan_safe_renames', args: [['My Report.csv', 'notes.md']], expected: [{ source: 'My Report.csv', destination: 'my-report.csv' }] }, { name: 'detects collision', functionName: 'plan_safe_renames', args: [['A B.txt', 'a-b.txt']], expectedException: 'ValueError' }],
    hints: ['A dry run should detect conflicts before touching files.', 'Calculate every destination and track which ones are already claimed.', 'Only return plans whose source and destination differ.'],
  },
  {
    moduleId: 'm6-logging-scheduling', id: 'retry-delays', title: 'Calculate bounded retry delays', functionName: 'retry_delays', skills: ['logging', 'automation', 'exceptions'],
    prompt: 'Return exponential delays base_seconds * 2**attempt capped at max_seconds for attempts retries. Reject negative retries or non-positive timing values.',
    solution: "def retry_delays(retries, base_seconds, max_seconds):\n    if retries < 0 or base_seconds <= 0 or max_seconds <= 0: raise ValueError('invalid retry policy')\n    return [min(max_seconds, base_seconds * (2 ** attempt)) for attempt in range(retries)]",
    tests: [{ name: 'backs off and caps', functionName: 'retry_delays', args: [5, 2, 10], expected: [2, 4, 8, 10, 10] }, { name: 'no retries', functionName: 'retry_delays', args: [0, 2, 10], expected: [] }, { name: 'bad base', functionName: 'retry_delays', args: [2, 0, 10], expectedException: 'ValueError' }],
    hints: ['Retry policy is deterministic routing, not an AI judgment call.', 'Generate one delay per retry attempt and cap each independently.', 'min(max_seconds, base_seconds * 2 ** attempt)'],
  },
  {
    moduleId: 'm7-networking', id: 'parse-http-target', title: 'Parse an HTTP target safely', functionName: 'parse_http_target', skills: ['networking', 'apis', 'security'],
    prompt: 'Using urllib.parse, accept only http/https URLs with a hostname. Return scheme, lowercase host, port (explicit or default), path (at least /), and query. Reject credentials and fragments.',
    solution: "from urllib.parse import urlsplit\ndef parse_http_target(url):\n    parsed = urlsplit(url)\n    if parsed.scheme not in ('http', 'https') or not parsed.hostname or parsed.username or parsed.password or parsed.fragment: raise ValueError('invalid target')\n    return {'scheme': parsed.scheme, 'host': parsed.hostname.lower(), 'port': parsed.port or (443 if parsed.scheme == 'https' else 80), 'path': parsed.path or '/', 'query': parsed.query}",
    tests: [{ name: 'parses HTTPS target', functionName: 'parse_http_target', args: ['https://Example.com/data?page=2'], expected: { scheme: 'https', host: 'example.com', port: 443, path: '/data', query: 'page=2' } }, { name: 'rejects credentials', functionName: 'parse_http_target', args: ['https://user:pass@example.com/'], expectedException: 'ValueError' }],
    hints: ['URL parsing is safer than splitting strings by punctuation.', 'Validate scheme, hostname, credentials, and fragment before returning fields.', 'Use 443 for HTTPS and 80 for HTTP when port is absent.'], allowedImports: ['urllib'],
  },
  {
    moduleId: 'm7-sqlite-formats', id: 'apply-ledger-transaction', title: 'Apply a ledger transaction atomically', functionName: 'apply_ledger_transaction', skills: ['sql', 'databases', 'exceptions'],
    prompt: 'Given balances and transfer dictionaries, apply all transfers to a copy. Reject missing accounts, non-positive amounts, or insufficient funds; on rejection the input must remain unchanged.',
    solution: "def apply_ledger_transaction(balances, transfers):\n    result = dict(balances)\n    for transfer in transfers:\n        source, destination, amount = transfer['from'], transfer['to'], transfer['amount']\n        if source not in result or destination not in result or amount <= 0 or result[source] < amount: raise ValueError('invalid transfer')\n        result[source] -= amount\n        result[destination] += amount\n    return result",
    tests: [{ name: 'applies complete transaction', functionName: 'apply_ledger_transaction', args: [{ a: 10, b: 2 }, [{ from: 'a', to: 'b', amount: 4 }]], expected: { a: 6, b: 6 } }, { name: 'rejects overdraft', functionName: 'apply_ledger_transaction', args: [{ a: 1, b: 2 }, [{ from: 'a', to: 'b', amount: 4 }]], expectedException: 'ValueError' }],
    hints: ['Transaction work should happen on isolated state until every rule succeeds.', 'Copy balances before applying transfers.', 'Validate each transfer before subtracting or adding.'],
  },
  {
    moduleId: 'm7-security', id: 'build-integrity-manifest', title: 'Build an integrity manifest', functionName: 'build_integrity_manifest', skills: ['security', 'files'],
    prompt: 'Given path-to-text content, return path, UTF-8 byte count, and SHA-256 digest records sorted by path. Reject absolute paths and parent traversal segments.',
    solution: "import hashlib\ndef build_integrity_manifest(files):\n    records = []\n    for path, text in files.items():\n        parts = path.replace('\\\\', '/').split('/')\n        if path.startswith(('/', '\\\\')) or '..' in parts: raise ValueError('unsafe path')\n        data = text.encode('utf-8')\n        records.append({'path': path, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})\n    return sorted(records, key=lambda record: record['path'])",
    tests: [{ name: 'hashes deterministically', functionName: 'build_integrity_manifest', args: [{ 'b.txt': 'β', 'a.txt': 'a' }], expected: [{ path: 'a.txt', bytes: 1, sha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' }, { path: 'b.txt', bytes: 2, sha256: 'f44e64e75f3948e9f73f8dfa94721c4ce8cbb4f265c4790c702b2d41cfbf2753' }] }, { name: 'rejects traversal', functionName: 'build_integrity_manifest', args: [{ '../secret.txt': 'x' }], expectedException: 'ValueError' }],
    hints: ['Integrity evidence combines identity, size, and a cryptographic digest.', 'Validate relative paths before encoding content.', 'Use hashlib.sha256(data).hexdigest().'], allowedImports: ['hashlib'],
  },
  {
    moduleId: 'm8-numpy', id: 'matrix-multiply-pure', title: 'Multiply matrices from first principles', functionName: 'matrix_multiply', skills: ['numpy', 'linear-algebra'],
    prompt: 'Multiply two rectangular matrices represented by nested lists. Raise ValueError for empty, ragged, or incompatible shapes.',
    solution: "def matrix_multiply(a, b):\n    if not a or not b or any(len(row) != len(a[0]) for row in a) or any(len(row) != len(b[0]) for row in b) or len(a[0]) != len(b): raise ValueError('invalid shapes')\n    return [[sum(a[row][k] * b[k][column] for k in range(len(b))) for column in range(len(b[0]))] for row in range(len(a))]",
    tests: [{ name: 'multiplies rectangular matrices', functionName: 'matrix_multiply', args: [[[1, 2, 3], [4, 5, 6]], [[1, 2], [0, 1], [1, 0]]], expected: [[4, 4], [10, 13]] }, { name: 'rejects incompatible shapes', functionName: 'matrix_multiply', args: [[[1, 2]], [[1, 2]]], expectedException: 'ValueError' }],
    hints: ['Output shape is rows of A by columns of B.', 'Each output cell is a dot product of one row and one column.', 'Validate rectangular shapes before the nested computation.'],
  },
  {
    moduleId: 'm8-pandas', id: 'group-sales-records', title: 'Group table records', functionName: 'group_sales_records', skills: ['pandas', 'data-analysis'],
    prompt: 'Group sales rows by region, returning count, total, and average per region sorted alphabetically. Reject missing regions or non-numeric amounts.',
    solution: "def group_sales_records(rows):\n    groups = {}\n    for row in rows:\n        region, amount = row.get('region'), row.get('amount')\n        if not isinstance(region, str) or not isinstance(amount, (int, float)): raise ValueError('invalid row')\n        group = groups.setdefault(region, {'count': 0, 'total': 0})\n        group['count'] += 1; group['total'] += amount\n    return [{'region': region, 'count': value['count'], 'total': value['total'], 'average': value['total'] / value['count']} for region, value in sorted(groups.items())]",
    tests: [{ name: 'groups and aggregates', functionName: 'group_sales_records', args: [[{ region: 'west', amount: 10 }, { region: 'east', amount: 4 }, { region: 'west', amount: 6 }]], expected: [{ region: 'east', count: 1, total: 4, average: 4 }, { region: 'west', count: 2, total: 16, average: 8 }] }, { name: 'rejects bad amount', functionName: 'group_sales_records', args: [[{ region: 'west', amount: 'many' }]], expectedException: 'ValueError' }],
    hints: ['This is the explicit-loop equivalent of groupby plus aggregation.', 'Keep count and total for each region.', 'Derive average only after all rows are accumulated.'],
  },
  {
    moduleId: 'm8-data-engineering', id: 'validate-pipeline-batch', title: 'Validate a pipeline batch', functionName: 'validate_pipeline_batch', skills: ['databases', 'testing', 'pandas'],
    prompt: 'Deduplicate records by id, keeping the record with the greatest updated_at string. Return accepted records sorted by id and rejected source indexes for missing required fields.',
    solution: "def validate_pipeline_batch(records):\n    accepted, rejected = {}, []\n    for index, record in enumerate(records):\n        if not isinstance(record.get('id'), str) or not isinstance(record.get('updated_at'), str) or 'value' not in record:\n            rejected.append(index); continue\n        current = accepted.get(record['id'])\n        if current is None or record['updated_at'] > current['updated_at']: accepted[record['id']] = dict(record)\n    return {'accepted': [accepted[key] for key in sorted(accepted)], 'rejected_indexes': rejected}",
    tests: [{ name: 'keeps latest records', functionName: 'validate_pipeline_batch', args: [[{ id: 'b', updated_at: '2026-01-01', value: 1 }, { id: 'b', updated_at: '2026-02-01', value: 2 }, { value: 3 }]], expected: { accepted: [{ id: 'b', updated_at: '2026-02-01', value: 2 }], rejected_indexes: [2] } }, { name: 'empty batch', functionName: 'validate_pipeline_batch', args: [[]], expected: { accepted: [], rejected_indexes: [] } }],
    hints: ['A reproducible batch records both accepted and rejected input.', 'Use a dictionary by id and compare update timestamps.', 'Sort dictionary keys for deterministic output.'],
  },
  {
    moduleId: 'm9-inference', id: 'mean-confidence-interval', title: 'Calculate a mean confidence interval', functionName: 'mean_confidence_interval', skills: ['statistics', 'data-analysis'],
    prompt: 'Using a supplied critical_value, return mean, standard error, lower, and upper for a numeric sample using sample standard deviation. Require at least two values.',
    solution: "def mean_confidence_interval(values, critical_value):\n    if len(values) < 2 or critical_value <= 0: raise ValueError('invalid sample')\n    mean = sum(values) / len(values)\n    variance = sum((value - mean) ** 2 for value in values) / (len(values) - 1)\n    standard_error = (variance ** 0.5) / (len(values) ** 0.5)\n    margin = critical_value * standard_error\n    return {'mean': mean, 'standard_error': standard_error, 'lower': mean - margin, 'upper': mean + margin}",
    tests: [{ name: 'calculates interval', functionName: 'mean_confidence_interval', args: [[1, 2, 3, 4], 2], expected: { mean: 2.5, standard_error: 0.6454972244, lower: 1.2090055513, upper: 3.7909944487 }, comparison: 'numeric-tolerance', tolerance: 1e-6 }, { name: 'rejects tiny sample', functionName: 'mean_confidence_interval', args: [[1], 2], expectedException: 'ValueError' }],
    hints: ['Inference distinguishes sample spread from uncertainty in the mean.', 'Use n-1 for sample variance and divide standard deviation by sqrt(n).', 'margin = critical_value * standard_error.'],
  },
  {
    moduleId: 'm9-visualization', id: 'choose-chart-form', title: 'Choose an honest chart form', functionName: 'choose_chart_form', skills: ['visualization', 'statistics'],
    prompt: 'Return line for change-over-time, bar for magnitude by category, scatter for relationship, stat for one headline value, and table when categories exceed 8. Reject unknown jobs.',
    solution: "def choose_chart_form(job, category_count=0):\n    if category_count > 8: return 'table'\n    forms = {'change-over-time': 'line', 'magnitude': 'bar', 'relationship': 'scatter', 'headline': 'stat'}\n    if job not in forms: raise ValueError('unknown job')\n    return forms[job]",
    tests: [{ name: 'time uses line', functionName: 'choose_chart_form', args: ['change-over-time', 1], expected: 'line' }, { name: 'too many categories use table', functionName: 'choose_chart_form', args: ['magnitude', 9], expected: 'table' }, { name: 'unknown job', functionName: 'choose_chart_form', args: ['decorate', 2], expectedException: 'ValueError' }],
    hints: ['The data communication job selects the form before color does.', 'Handle excessive category count first, then map known jobs.', 'Do not invent a chart for an unknown purpose.'],
  },
  {
    moduleId: 'm10-ml-applied', id: 'calibration-bins', title: 'Build probability calibration bins', functionName: 'calibration_bins', skills: ['machine-learning', 'statistics'],
    prompt: 'For probabilities and binary labels, return equal-width bin summaries with count, mean_probability, and positive_rate. Validate lengths, values, and bin count; omit empty bins.',
    solution: "def calibration_bins(probabilities, labels, bins):\n    if bins <= 0 or len(probabilities) != len(labels) or any(not 0 <= p <= 1 for p in probabilities) or any(label not in (0, 1) for label in labels): raise ValueError('invalid calibration data')\n    groups = [[] for _ in range(bins)]\n    for probability, label in zip(probabilities, labels): groups[min(bins - 1, int(probability * bins))].append((probability, label))\n    return [{'bin': index, 'count': len(group), 'mean_probability': sum(p for p, _ in group) / len(group), 'positive_rate': sum(label for _, label in group) / len(group)} for index, group in enumerate(groups) if group]",
    tests: [{ name: 'summarizes occupied bins', functionName: 'calibration_bins', args: [[0.1, 0.4, 0.9], [0, 1, 1], 2], expected: [{ bin: 0, count: 2, mean_probability: 0.25, positive_rate: 0.5 }, { bin: 1, count: 1, mean_probability: 0.9, positive_rate: 1 }] }, { name: 'rejects invalid probability', functionName: 'calibration_bins', args: [[1.2], [1], 2], expectedException: 'ValueError' }],
    hints: ['Calibration compares predicted probability with observed frequency.', 'Map probability 1.0 into the final bin explicitly.', 'Summarize only bins containing observations.'],
  },
  {
    moduleId: 'm10-nlp', id: 'cosine-text-search', title: 'Rank embedding similarity', functionName: 'cosine_text_search', skills: ['nlp', 'linear-algebra', 'sorting'],
    prompt: 'Given a query vector and id/vector records, return IDs ranked by cosine similarity descending then ID. Reject zero vectors or shape mismatches.',
    solution: "def cosine_text_search(query, records):\n    def norm(vector): return sum(value * value for value in vector) ** 0.5\n    query_norm = norm(query)\n    if not query or query_norm == 0: raise ValueError('invalid query')\n    scored = []\n    for record in records:\n        vector = record['vector']\n        vector_norm = norm(vector)\n        if len(vector) != len(query) or vector_norm == 0: raise ValueError('invalid vector')\n        score = sum(a * b for a, b in zip(query, vector)) / (query_norm * vector_norm)\n        scored.append((record['id'], score))\n    return [item[0] for item in sorted(scored, key=lambda item: (-item[1], item[0]))]",
    tests: [{ name: 'ranks closest vector', functionName: 'cosine_text_search', args: [[1, 0], [{ id: 'b', vector: [0, 1] }, { id: 'a', vector: [1, 0] }]], expected: ['a', 'b'] }, { name: 'rejects zero vector', functionName: 'cosine_text_search', args: [[0, 0], []], expectedException: 'ValueError' }],
    hints: ['Cosine similarity divides the dot product by both vector lengths.', 'Validate query and record shapes before scoring.', 'Sort with (-similarity, id) for deterministic ties.'],
  },
  {
    moduleId: 'm10-generative-ai', id: 'screen-tool-request', title: 'Screen an AI tool request', functionName: 'screen_tool_request', skills: ['generative-ai', 'responsible-ai', 'security'],
    prompt: 'Given a tool request dictionary and allowed tools, return approved false with a reason for unknown tools, missing confirmation on destructive actions, or secret-like arguments. Otherwise return approved true.',
    solution: "def screen_tool_request(request, allowed_tools):\n    tool = request.get('tool')\n    arguments = request.get('arguments', {})\n    if tool not in allowed_tools: return {'approved': False, 'reason': 'tool-not-allowed'}\n    if request.get('destructive') and not request.get('confirmed'): return {'approved': False, 'reason': 'confirmation-required'}\n    secret_words = ('password', 'token', 'api_key', 'secret')\n    if any(any(word in str(key).lower() for word in secret_words) for key in arguments): return {'approved': False, 'reason': 'secret-like-argument'}\n    return {'approved': True, 'reason': 'allowed'}",
    tests: [{ name: 'requires confirmation', functionName: 'screen_tool_request', args: [{ tool: 'delete', arguments: {}, destructive: true, confirmed: false }, ['delete']], expected: { approved: false, reason: 'confirmation-required' } }, { name: 'rejects secret argument', functionName: 'screen_tool_request', args: [{ tool: 'send', arguments: { api_key: 'x' } }, ['send']], expected: { approved: false, reason: 'secret-like-argument' } }, { name: 'allows bounded request', functionName: 'screen_tool_request', args: [{ tool: 'search', arguments: { query: 'python' } }, ['search']], expected: { approved: true, reason: 'allowed' } }],
    hints: ['Tool authorization should follow deterministic rules before model judgment.', 'Check allowlist, destructive confirmation, then argument names.', 'Return explicit reasons instead of silently dropping requests.'],
  },
  {
    moduleId: 'm11-portfolio', id: 'release-readiness', title: 'Evaluate release readiness', functionName: 'release_readiness', skills: ['testing', 'packaging', 'debugging'],
    prompt: 'Given check dictionaries with name, passed, and required, return ready, failed_required names, and warning names. Sort both lists and reject duplicate names.',
    solution: "def release_readiness(checks):\n    names = [check['name'] for check in checks]\n    if len(names) != len(set(names)): raise ValueError('duplicate check')\n    failed = sorted(check['name'] for check in checks if check['required'] and not check['passed'])\n    warnings = sorted(check['name'] for check in checks if not check['required'] and not check['passed'])\n    return {'ready': not failed, 'failed_required': failed, 'warnings': warnings}",
    tests: [{ name: 'separates blockers and warnings', functionName: 'release_readiness', args: [[{ name: 'tests', passed: false, required: true }, { name: 'docs', passed: false, required: false }]], expected: { ready: false, failed_required: ['tests'], warnings: ['docs'] } }, { name: 'rejects duplicate checks', functionName: 'release_readiness', args: [[{ name: 'tests', passed: true, required: true }, { name: 'tests', passed: true, required: true }]], expectedException: 'ValueError' }],
    hints: ['Release decisions distinguish blockers from useful warnings.', 'Detect duplicate evidence before grouping failures.', 'ready is true only when failed_required is empty.'],
  },
  {
    moduleId: 'm11-cert-core', id: 'score-objective-domains', title: 'Score objective domains', functionName: 'score_objective_domains', skills: ['syntax', 'testing'],
    prompt: 'Given attempts with domain, score, and weight, keep the latest score per domain and return the weighted readiness percentage. Require positive weights totaling 100 across retained domains.',
    solution: "def score_objective_domains(attempts):\n    latest = {}\n    for attempt in attempts: latest[attempt['domain']] = attempt\n    if not latest or any(item['weight'] <= 0 for item in latest.values()) or sum(item['weight'] for item in latest.values()) != 100: raise ValueError('invalid weights')\n    return sum(item['score'] * item['weight'] for item in latest.values()) / 100",
    tests: [{ name: 'uses latest domain attempt', functionName: 'score_objective_domains', args: [[{ domain: 'syntax', score: 50, weight: 40 }, { domain: 'oop', score: 80, weight: 60 }, { domain: 'syntax', score: 100, weight: 40 }]], expected: 88 }, { name: 'rejects incomplete weights', functionName: 'score_objective_domains', args: [[{ domain: 'syntax', score: 100, weight: 50 }]], expectedException: 'ValueError' }],
    hints: ['Readiness uses objective weights, not XP.', 'Overwrite each domain as attempts arrive to retain the latest.', 'Validate retained weights total exactly 100.'],
  },
  {
    moduleId: 'm11-cert-specialist', id: 'coverage-gaps', title: 'Find certification evidence gaps', functionName: 'coverage_gaps', skills: ['data-analysis', 'testing', 'security'],
    prompt: 'Given objective records with id, required evidence IDs, and completed evidence IDs, return objective IDs missing any evidence, sorted by greatest missing count then ID.',
    solution: "def coverage_gaps(objectives):\n    gaps = []\n    for objective in objectives:\n        missing = set(objective['required']) - set(objective['completed'])\n        if missing: gaps.append((objective['id'], len(missing)))\n    return [item[0] for item in sorted(gaps, key=lambda item: (-item[1], item[0]))]",
    tests: [{ name: 'ranks largest gap first', functionName: 'coverage_gaps', args: [[{ id: 'data', required: ['a', 'b'], completed: [] }, { id: 'test', required: ['c'], completed: [] }, { id: 'safe', required: ['d'], completed: ['d'] }]], expected: ['data', 'test'] }, { name: 'no gaps', functionName: 'coverage_gaps', args: [[{ id: 'x', required: [], completed: [] }]], expected: [] }],
    hints: ['Coverage is set difference between required and completed evidence.', 'Keep only objectives with non-empty missing sets.', 'Sort by negative missing count and then objective ID.'],
  },
  {
    moduleId: 'm11-independent-build', id: 'validate-build-plan', title: 'Validate an independent build plan', functionName: 'validate_build_plan', skills: ['functions', 'testing', 'security'],
    prompt: 'Validate ordered milestones with unique IDs and prerequisite IDs referring only to earlier milestones. Return execution layers where milestones in one layer can run independently.',
    solution: "def validate_build_plan(milestones):\n    seen, remaining, layers = set(), list(milestones), []\n    ids = [item['id'] for item in milestones]\n    if len(ids) != len(set(ids)): raise ValueError('duplicate milestone')\n    while remaining:\n        ready = [item for item in remaining if set(item.get('prerequisites', [])) <= seen]\n        if not ready: raise ValueError('missing or cyclic prerequisite')\n        layers.append([item['id'] for item in ready])\n        seen.update(item['id'] for item in ready)\n        remaining = [item for item in remaining if item not in ready]\n    return layers",
    tests: [{ name: 'builds execution layers', functionName: 'validate_build_plan', args: [[{ id: 'design', prerequisites: [] }, { id: 'api', prerequisites: ['design'] }, { id: 'ui', prerequisites: ['design'] }, { id: 'release', prerequisites: ['api', 'ui'] }]], expected: [['design'], ['api', 'ui'], ['release']] }, { name: 'rejects missing prerequisite', functionName: 'validate_build_plan', args: [[{ id: 'build', prerequisites: ['missing'] }]], expectedException: 'ValueError' }],
    hints: ['A valid plan is a directed acyclic graph.', 'Repeatedly select milestones whose prerequisites are already seen.', 'If no remaining milestone is ready, the graph is invalid.'],
  },
]

export const professionalExercises = specs.map(exercise)
export const professionalExerciseByModule = Object.fromEntries(specs.map((spec) => [spec.moduleId, spec.id]))
