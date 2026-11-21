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

def test_every_next_reference_points_to_a_node_or_completion():
    for lesson in CURRICULUM.values():
        node_ids = {node["id"] for node in lesson["nodes"]}
        for index, node in enumerate(lesson["nodes"]):
            next_id = node["next"]
            if next_id == "complete":
                assert index == len(lesson["nodes"]) - 1
            else:
                assert next_id in node_ids
                assert next_id == lesson["nodes"][index + 1]["id"]
