import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.resolve('dist');
const html=await fs.readFile(path.join(root,'index.html'),'utf8');
const css=await fs.readFile(path.join(root,'styles.css'),'utf8');
const app=await fs.readFile(path.join(root,'app.js'),'utf8');
const data=await fs.readFile(path.join(root,'data.js'),'utf8');
new vm.Script(app);new vm.Script(data);
const context={window:{}};vm.runInNewContext(data,context);
for(const collection of ['steps','resources','alumni']){
  assert(Array.isArray(context.window.NHISA[collection]),`${collection} must be an array`);
  assert(context.window.NHISA[collection].length>0,`${collection} must contain content`);
  const entryIds=context.window.NHISA[collection].map(entry=>entry.id);
  assert(entryIds.every(id=>typeof id==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)),`${collection} must use route-safe IDs`);
  assert.equal(new Set(entryIds).size,entryIds.length,`${collection} IDs must be unique`);
}
for(const person of context.window.NHISA.alumni){
  assert(person.test || person.published,'Interview must be labeled test or approved for publication');
  assert(person.questions.length>=4,'Interview should have a complete question-and-answer structure');
  assert(person.photoAlt,'Profile imagery must have contextual alternative text');
  await fs.access(path.join(root,person.photo));
}
const ids=context.window.NHISA.resources.map(resource=>resource.id);
assert.equal(new Set(ids).size,ids.length);
for(const step of context.window.NHISA.steps)for(const id of step.resources)assert(ids.includes(id),`Missing resource ${id}`);
const immigration=context.window.NHISA.immigration;
assert(immigration&&Array.isArray(immigration.topics),'Immigration guides must be available');
assert(/^\d{4}-\d{2}-\d{2}$/.test(immigration.reviewed),'Guides must have a source review date');
const topicIds=immigration.topics.map(topic=>topic.id);
assert.equal(new Set(topicIds).size,topicIds.length,'Guide topic IDs must be unique');
const sourceIds=immigration.sources.map(source=>source.id);
assert.equal(new Set(sourceIds).size,sourceIds.length,'Official source IDs must be unique');
for(const source of immigration.sources){const url=new URL(source.url);assert.equal(url.protocol,'https:');assert(/(^|\.)syracuse\.edu$|(^|\.)uscis\.gov$|(^|\.)state\.gov$|(^|\.)dol\.gov$/.test(url.hostname),'Immigration guidance must link to official sources');}
for(const item of [...immigration.topics,...immigration.faqs]){assert(item.sources.length>0,'Each topic and answer needs a source');for(const id of item.sources)assert(sourceIds.includes(id),`Missing official source ${id}`);}
for(const topic of immigration.topics){assert.equal(topic.steps.length,3);for(const step of topic.steps)assert(step.title&&step.text,'Application steps need a title and explanation');}
for(const resource of context.window.NHISA.resources){
  if(resource.internal){const topic=resource.url.match(/^#\/immigration\?topic=([a-z0-9-]+)$/)?.[1];assert(topicIds.includes(topic),`Invalid internal guide link ${resource.url}`);}
  else assert.equal(new URL(resource.url).protocol,'https:');
}
const references=[...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match=>match[1]).filter(ref=>!ref.startsWith('http'));
references.push(...[...css.matchAll(/url\('([^']+)'\)/g)].map(match=>match[1]));
for(const ref of references)await fs.access(path.join(root,ref));
for(const ref of [...html.matchAll(/--icon:url\('([^']+)'\)/g)].map(match=>match[1]))await fs.access(path.join(root,ref));
const icons=[...new Set([...app.matchAll(/icon\('([a-z0-9-]+)'/g)].map(match=>match[1]))];
icons.push(...new Set([...context.window.NHISA.resources,...context.window.NHISA.steps].map(item=>item.icon).filter(name=>name&&!icons.includes(name))));
for(const name of icons)await fs.access(path.join(root,'assets/icons',`${name}.svg`));
const appAssets=[...new Set([...app.matchAll(/assets\/[a-z0-9-]+\.(?:webp|png|svg)/g)].map(match=>match[0]))];
for(const ref of appAssets)await fs.access(path.join(root,ref));
const site=context.window.NHISA.site||{};
assert(typeof site==='object','Site settings must be an object');
for(const key of ['formUrl','instagram','linkedin']){const value=site.contact?.[key];if(value)assert.equal(new URL(value).protocol,'https:',`contact.${key} must be an https URL`);}
if(site.contact?.email)assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.contact.email),'contact.email must be an email address');
if(!site.contact?.email&&!site.contact?.formUrl)console.warn('Warning: add contact.email or contact.formUrl in dist/data.js so visitors can send their introduction to NHISA.');
if(site.showTestInterviews)console.warn('Warning: fictional TEST interviews are visible. Set showTestInterviews to false before publishing.');
assert(css.includes('prefers-reduced-motion'));
assert(html.includes('Skip to main content'));
console.log(`Validated scripts, ${context.window.NHISA.steps.length} roadmap steps, ${ids.length} unique resources, ${context.window.NHISA.alumni.length} complete interviews, ${immigration.topics.length} sourced immigration guides, ${references.length} static references, ${icons.length} icons, and accessibility foundations.`);
