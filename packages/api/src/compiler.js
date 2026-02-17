/* Copyright (c) 2023, ARTCOMPILER INC */
import {
  Checker as BasisChecker,
  Transformer as BasisTransformer,
  Compiler as BasisCompiler
} from '@graffiticode/basis';

export class Checker extends BasisChecker {
  TOPIC(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  EDGES(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  EDGE(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  TYPE(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  NODES(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  NODE(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  TEXT(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  ASSESS(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  METHOD(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      resume([], node);
    });
  }

  EXPECTED(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      resume([], node);
    });
  }

  THEME(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        const node0 = this.nodePool[node.elts[0]]
        if (v0.tag === "dark" || v0.tag === "light") {
          resume([], node);
        } else {
          const err = [{
            message: `Expecting a tag dark or tag light. Got ${v0.tag && "tag " + v0.tag || v0}.`,
            ...node0.coord,
          }];
          resume(err, node);
        }
      });
    });
  }
}

export class Transformer extends BasisTransformer {
  PRINT(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      resume(e0, { print: v0 });
    });
  }

  TOPIC(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, topic: v0 });
      });
    });
  }

  EDGES(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, edges: v0 });
      });
    });
  }

  EDGE(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { pattern: v0, ...v1 });
      });
    });
  }

  TYPE(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, type: v0?.tag?.toLowerCase() || v0 });
      });
    });
  }

  NODES(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, nodes: v0 });
      });
    });
  }

  NODE(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { id: v0?.tag || v0, ...v1 });
      });
    });
  }

  TEXT(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, text: v0 });
      });
    });
  }

  ASSESS(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, assess: v0[0] });
      });
    });
  }

  METHOD(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      resume([], { method: v0 });
    });
  }

  EXPECTED(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      resume([], { expected: v0 });
    });
  }

  THEME(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        const data = options?.data || {};
        resume([], {
          theme: v0?.tag,
          ...(typeof v1 === "object" && v1 || { _: v1 }),
          ...data,
        });
      });
    });
  }

  PROG(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      const data = options?.data || {};
      const val = v0.pop();
      const { topic, edges = [], nodes = [], theme } = val;

      // Build node ID set for wildcard expansion
      const nodeIds = nodes.map(n => n.id);

      // Expand edge patterns
      const expandedEdges = [];
      for (const edgeDef of edges) {
        const { pattern, type = "line" } = edgeDef;
        if (pattern && pattern.endsWith("*")) {
          // Wildcard: e.g. "H*" means from H to every other node
          const fromId = pattern.slice(0, -1);
          for (const toId of nodeIds) {
            if (toId !== fromId) {
              expandedEdges.push({ from: fromId, to: toId, type });
            }
          }
        } else if (pattern && pattern.length >= 2) {
          // Explicit pair: e.g. "HA" means H→A
          const fromId = pattern[0];
          const toId = pattern.slice(1);
          expandedEdges.push({ from: fromId, to: toId, type });
        }
      }

      const conceptWeb = {
        topic: topic || "",
        nodes,
        edges: expandedEdges,
      };

      resume(e0, { conceptWeb, theme, ...data });
    });
  }
}

export const compiler = new BasisCompiler({
  langID: '0169',
  version: 'v0.0.1',
  Checker: Checker,
  Transformer: Transformer,
});
