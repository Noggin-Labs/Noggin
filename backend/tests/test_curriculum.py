from backend.noggimigo.curriculum import CURRICULUM, get_lesson, lesson_ids


def test_all_lessons_are_registered():
    assert "ratios_proportions" in lesson_ids()
    assert len(CURRICULUM) >= 7


def test_every_lesson_and_node_has_required_fields():
    lesson_fields = {"subject", "topic", "title", "objective", "nodes"}
    node_fields = {"id", "question", "answer", "hint", "misconceptions", "next"}
    for lesson in CURRICULUM.values():
        assert lesson_fields.issubset(lesson)
        assert lesson["nodes"]
        for node in lesson["nodes"]:
            assert node_fields.issubset(node)


def test_ratio_lesson_answer():
    assert get_lesson("ratios_proportions")["nodes"][0]["answer"] == "2:1"


def test_unknown_lesson_raises_key_error():
    try:
        get_lesson("not-a-real-lesson")
    except KeyError:
        pass
    else:
        raise AssertionError("Expected KeyError")