import { Card, EmptyState, Page } from "@shopify/polaris";

import { notFoundImage } from "../assets";

export default function NotFound() {
  return (
    <Page>
      <Card>
        <Card.Section>
          <EmptyState heading="Not Found" image={notFoundImage}>
            <p>This Page Could not Be Found</p>
          </EmptyState>
        </Card.Section>
      </Card>
    </Page>
  );
}
