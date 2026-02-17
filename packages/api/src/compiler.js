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

  INSTRUCTIONS(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  ANCHOR(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  CONNECTIONS(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  CONNECTION(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      resume([], node);
    });
  }

  VALUE(node, options, resume) {
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

  CONCEPTS(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  CONCEPT(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      resume([], node);
    });
  }

  IMAGE(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  ALIGN(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
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

  INSTRUCTIONS(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, instructions: v0 });
      });
    });
  }

  ANCHOR(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, anchor: v0 });
      });
    });
  }

  CONNECTIONS(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, connections: v0 });
      });
    });
  }

  CONNECTION(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      resume([], v0);
    });
  }

  VALUE(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, value: v0 });
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
        const merged = v0.reduce((acc, item) => ({ ...acc, ...item }), {});
        resume([], { ...v1, assess: merged });
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

  CONCEPTS(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, concepts: v0 });
      });
    });
  }

  CONCEPT(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      resume([], v0);
    });
  }

  IMAGE(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, image: v0 });
      });
    });
  }

  ALIGN(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, align: v0?.tag?.toLowerCase() || v0 });
      });
    });
  }

  PROG(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      const data = options?.data || {};
      const val = v0.pop();
      const { topic, instructions, connections = [], anchor, concepts = [], align, theme } = val;

      // Auto-generate edges: each connection connects to the anchor
      const edges = anchor
        ? connections.map((_, i) => ({ from: "anchor", to: String(i), type: "solid" }))
        : [];

      const conceptWeb = {
        topic: topic || "",
        instructions: instructions || "",
        anchor,
        connections,
        edges,
        concepts,
        trayAlign: align,
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
