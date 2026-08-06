from word_insight import PROJECT_ID, implementation_status

def test_starter_identity_prevents_working_in_the_wrong_bundle():
    assert PROJECT_ID == "word-insight"

def test_starter_is_ready_for_guided_implementation():
    assert implementation_status() == "starter"
