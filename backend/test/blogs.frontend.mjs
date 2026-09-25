import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const origin=process.env.TEST_FRONTEND_URL??'http://localhost:3000';
const login=await fetch(origin+'/api/auth/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email:process.env.TEST_ADMIN_EMAIL??'admin@harsha.dev',password:process.env.TEST_ADMIN_PASSWORD??'ChangeMe123!'})});
assert.equal(login.status,200,'Admin login must succeed');
const cookie=login.headers.get('set-cookie').split(';')[0];
const request=(url,method='GET',data,csrf=origin)=>fetch(origin+url,{method,redirect:'manual',headers:{cookie,Origin:csrf,'Content-Type':'application/json'},...(data===undefined?{}:{body:JSON.stringify(data)})});
let id;
try{
 for(const page of ['/admin/blogs','/admin/blogs/create'])assert.equal((await request(page)).status,200);
 const input={title:'CMS frontend verification',slug:'cms-verify-'+randomUUID(),excerpt:'Temporary verification record',category:'Testing',content:'<script>alert("test")</script>\n\nPlain text paragraph.',coverImage:'',tags:['Test'],status:'DRAFT'};
 assert.equal((await request('/api/admin/blogs','POST',input,'https://not-this-site.invalid')).status,403);
 const created=await request('/api/admin/blogs','POST',input);assert.equal(created.status,201);const blog=await created.json();id=blog.id;
 assert.equal((await fetch(origin+'/blog/'+input.slug)).status,404);
 assert.equal((await request('/admin/blogs/'+id+'/edit')).status,200);
 const update=await request('/api/admin/blogs/'+id,'PATCH',{status:'PUBLISHED'});assert.equal(update.status,200);
 const page=await fetch(origin+'/blog/'+input.slug);assert.equal(page.status,200);const html=await page.text();assert.ok(html.includes('&lt;script&gt;'),'HTML content is escaped');assert.ok(!html.includes('<script>alert("test")</script>'));
 assert.ok((await (await fetch(origin+'/')).text()).includes(input.title),'Published article appears on homepage');
 assert.equal((await request('/api/admin/blogs/'+id,'PATCH',{status:'DRAFT'})).status,200);
 assert.equal((await fetch(origin+'/blog/'+input.slug)).status,404);
 const table=await request('/api/admin/blogs');assert.equal(table.status,200);assert.ok((await table.json()).some(b=>b.id===id));
 console.log('PASS: frontend login, protected table/create/edit pages, CSRF rejection, draft privacy, publishing to homepage/article, escaped content, and unpublishing.');
}finally{if(id){const removed=await request('/api/admin/blogs/'+id,'DELETE');assert.equal(removed.status,200);console.log('Temporary verification article deleted.');}}
