import React from 'react';
import { PlatformStateContext } from 'nr1';
import ColoredTableVisualization from './ColoredTableVisualization';

export default function YourNerdlet() {
  return (
    <PlatformStateContext.Consumer>
      {(platformState) => {
        const { nrqlQuery = "", accountId = "", colorMapping = [] } = platformState.config || {};
        console.log("Hello from Santosh");
        console.log('Loaded config values:', { nrqlQuery, accountId, colorMapping });
        return (
          <div>
            <h2>Table Visualization</h2>
            <ColoredTableVisualization nrqlQuery={nrqlQuery} accountId={accountId} colorMapping={colorMapping} />
          </div>
        );
      }}
    </PlatformStateContext.Consumer>
  );
}