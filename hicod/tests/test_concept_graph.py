import unittest
from concept_graph import ConceptGraph

class ConceptGraphTests(unittest.TestCase):
    def test_integrity(self):
        r = ConceptGraph().validate()
        self.assertEqual(r["L4"], 60)
        self.assertEqual(r["evidence_interfaces"], 15)
        self.assertTrue(r["dependency_DAG"])
    def test_trace_closure(self):
        r = ConceptGraph().trace("B05")
        ids = {n["id"] for n in r["nodes"]}
        self.assertTrue({"B05","A03","P03","P01","P02"} <= ids)
        for e in r["edges"]:
            self.assertIn(e["source"], ids)
            self.assertIn(e["target"], ids)
            self.assertEqual(e["type"], "requires")
    def test_no_fake_evaluation(self):
        self.assertEqual(ConceptGraph().trace("I06")["status"], "definition_only")
if __name__ == "__main__":
    unittest.main()
