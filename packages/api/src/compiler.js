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
      const val = typeof v0 === "string" ? v0 : (v0?.tag || v0?.elts?.[0]);
      if (val === "value" || val === "VALUE") {
        resume([], node);
      } else {
        const node0 = this.nodePool[node.elts[0]];
        const err = [{
          message: `Expecting 'value' or tag VALUE. Got ${val && "tag " + val || JSON.stringify(v0)}.`,
          ...node0.coord,
        }];
        resume(err, node);
      }
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
        const tag = v0?.tag || v0?.elts?.[0];
        if (tag === "DARK" || tag === "LIGHT") {
          resume([], node);
        } else {
          const err = [{
            message: `Expecting a tag DARK or tag LIGHT. Got ${tag && "tag " + tag || JSON.stringify(v0)}.`,
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

  EDGES(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  EDGE(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      resume([], node);
    });
  }

  FROM(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      this.visit(node.elts[1], options, async (e1, v1) => {
        resume([], node);
      });
    });
  }

  TO(node, options, resume) {
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
        if (v0.text && !v0.value) {
          v0.value = v0.text;
        }
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
      if (v0.text && !v0.value) {
        v0.value = v0.text;
      }
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
      const tag = v0?.tag || v0?.elts?.[0];
      const method = tag ? tag.toLowerCase() : v0;
      resume([], { method });
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
        const tag = v0?.tag || v0?.elts?.[0];
        resume([], {
          theme: tag,
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
      if (v0.text && !v0.value) {
        v0.value = v0.text;
      }
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
        const tag = v0?.tag || v0?.elts?.[0];
        resume([], { ...v1, align: tag?.toLowerCase() || v0 });
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
      resume([], v0);
    });
  }

  FROM(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, from: v0 });
      });
    });
  }

  TO(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        resume([], { ...v1, to: v0 });
      });
    });
  }

  TYPE(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        const tag = v0?.tag || v0?.elts?.[0];
        resume([], { ...v1, type: tag?.toLowerCase() || v0 });
      });
    });
  }

  PROG(node, options, resume) {
    this.visit(node.elts[0], options, (e0, v0) => {
      const data = options?.data || {};
      const val = v0.pop();
      const { topic, instructions, connections = [], anchor, concepts = [], align, theme, edges } = val;

      const conceptWeb = {
        topic: topic || "",
        instructions: instructions || "",
        anchor,
        connections,
        ...(edges !== undefined && { edges }),
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
