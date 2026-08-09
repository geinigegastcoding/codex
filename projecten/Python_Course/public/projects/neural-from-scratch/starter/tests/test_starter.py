from neural_from_scratch import PROJECT_ID, implementation_status

def test_starter_identity_prevents_working_in_the_wrong_bundle():
    assert PROJECT_ID == "neural-from-scratch"

def test_starter_is_ready_for_guided_implementation():
    assert implementation_status() == "starter"
