import Button from "../../components/button/button.tsx";
import { Card } from "../../components/card.tsx";
import InputWithLabel from "../../components/input.tsx";

export const ProjectNew = () => (
  <>
    <Card>
      <h1>New project</h1>
    </Card>
    <div>
      <details>
        <summary>Import from NVA</summary>
        <form method="post">
          <InputWithLabel
            label={"NVA project id"}
            name={"nva_project_id"}
          />
          <Button>Create</Button>
        </form>
      </details>
    </div>
  </>
);
