import "./App.css";

import { For } from "solid-js";
import { createStore } from "solid-js/store";

import { ExampleContainer } from "./ExampleContainer";
import { Example } from "./examples";

const EXAMPLES = [
  {
    description: "Render a simple triangle.",
    name: "Triangle",
    sourceHtml: "examples/triangle.html",
    source: "examples/triangle.ts",
  },
  {
    description: "Render multiple triangles.",
    name: "Triangles",
    sourceHtml: "examples/triangles.html",
    source: "examples/triangles.ts",
  },
];

interface State {
  selectedExample?: Example;
}

function App() {
  const [state, setState] = createStore<State>({});

  return (
    <>
      <main>
        <h1 class="title">Shade and Shape</h1>
        <p class="description">
          Example code to go along with session at NERD Summit 2024
        </p>

        <section class="grid">
          <For each={EXAMPLES}>
            {(example: Example) => (
              <a
                href="#"
                onClick={() => setState({ selectedExample: example })}
                class="card"
              >
                <h2>{example.name}</h2>
                <p>{example.description}</p>
              </a>
            )}
          </For>
        </section>
      </main>

      {state.selectedExample && (
        <ExampleContainer
          example={state.selectedExample}
          onBackClick={() => setState({ selectedExample: undefined })}
        />
      )}
    </>
  );
}

export default App;
