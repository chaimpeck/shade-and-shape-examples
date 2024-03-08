import type { Example } from "./examples";

interface ExampleContainerProps {
  example: Example;
  onBackClick: () => void;
}

export function ExampleContainer(props: ExampleContainerProps) {
  return (
    <div id="example-container">
      <div class="example-navbar">
        {props.example.name} - {props.example.description} |{" "}
        <a href="#" onClick={() => props.onBackClick()}>
          View Source
        </a>{" "}
        |{" "}
        <a href={props.example.sourceHtml} target="_blank">
          Open in New Tab
        </a>{" "}
        |{" "}
        <a href="#" onClick={() => props.onBackClick()}>
          Back
        </a>
      </div>
      <iframe src={props.example.sourceHtml} />
    </div>
  );
}
