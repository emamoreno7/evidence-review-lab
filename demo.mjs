import { fixtures } from './src/fixtures.mjs';
import { createEvaluator } from './src/policy.mjs';
const evaluate=createEvaluator(fixtures);
for (const source of fixtures) {
  const result=await evaluate({sourceId:source.id,evidence:source.text,claim:'Available units: 24',mode:'auto'});
  console.log(JSON.stringify(result,null,2));
}
