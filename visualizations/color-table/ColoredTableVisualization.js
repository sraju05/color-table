// src/ColoredTableVisualization.js

import React, { useEffect, useState } from 'react';
import { NerdGraphQuery } from 'nr1';

const ColoredTableVisualization = ({ nrqlQuery, accountId, colorMapping }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (nrqlQuery && accountId) {
      const query = `
        {
          actor {
            account(id: ${accountId}) {
              nrql(query: "${nrqlQuery}") {
                results
              }
            }
          }
        }
      `;

      console.log('GraphQL query:', query);

      NerdGraphQuery.query({ query }).then(({ data }) => {
        if (data) {
          console.log('Query results:', data.actor.account.nrql.results);
          setData(data.actor.account.nrql.results);
        }
      })
      .catch(error => {
        console.error("Error executing NRQL query:", error);
        setData([]); // or handle it differently
      });
    } else {
      console.warn('nrqlQuery or accountId is missing.');
    }
  }, [nrqlQuery, accountId]);

  const getCellColor = (value) => {
    let color = 'white';
    // Compare value as a string
    const mapping = colorMapping.find(map => map.userString.toLowerCase() === String(value).toLowerCase());
    if (mapping) {
      color = mapping.userColor;
    } else {
      // Compare numerical values using Number functions and attempt a match
      for (let map of colorMapping) {
        const num = Number(map.userString);
        if (!isNaN(num) && num === value) {
          color = map.userColor;
          break;
        }
      }
    }
    return color;
  };

  if (!nrqlQuery || !accountId) return <p>Please enter your NRQL query and Account ID</p>;
  if (!data) return <p>Loading data...</p>;

  const headers = data[0] ? Object.keys(data[0]) : [];

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, cellIndex) => (
              <td key={cellIndex} style={{ backgroundColor: getCellColor(row[header]) }}>
                {row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ColoredTableVisualization;
