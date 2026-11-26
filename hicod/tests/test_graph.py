import unittest
import numpy as np
from hicod import analyze_grid, report_modes

class GridTests(unittest.TestCase):
    def test_clear(self):
        r=analyze_grid(np.arange(5),np.arange(5),lambda x,y:True,(0,0),(4,4))
        self.assertTrue(r["graph_connected"])
        self.assertEqual(r["components"],1)
        self.assertEqual(r["feasible_samples"],25)
    def test_disconnected(self):
        r=analyze_grid(np.arange(5),np.arange(5),lambda x,y:x!=2,(0,0),(4,4))
        self.assertTrue(r["endpoint_compatible"])
        self.assertFalse(r["graph_connected"])
        self.assertEqual(r["components"],2)
        self.assertEqual(report_modes({"A":r},{}).status,"UNKNOWN_CONTINUOUS")
    def test_edge_obstruction(self):
        r=analyze_grid([0,1],[0],lambda x,y:x!=.5,(0,0),(1,0))
        self.assertTrue(r["endpoint_compatible"])
        self.assertFalse(r["graph_connected"])

if __name__=="__main__":
    unittest.main()
