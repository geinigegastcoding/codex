from flappy_ai import PROJECT_ID, implementation_status

def test_starter_identity_prevents_working_in_the_wrong_bundle():
    assert PROJECT_ID == "flappy-ai"

def test_starter_is_ready_for_guided_implementation():
    assert implementation_status() == "starter"
