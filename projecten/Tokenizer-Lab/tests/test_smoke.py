from tokenizer_lab.app import create_app, main


def test_application_entrypoints_import() -> None:
    assert callable(create_app)
    assert callable(main)
