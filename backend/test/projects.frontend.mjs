import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const origin=process.env.TEST_FRONTEND_URL??'http://localhost:3000';
const login=await fetch(origin+'/api/auth/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email:process.env.TEST_ADMIN_EMAIL??'admin@harsha.dev',password:process.env.TEST_ADMIN_PASSWORD??'ChangeMe123!'})});assert.equal(login.status,200);
const cookie=login.headers.get('set-cookie').split(';')[0];
const req=(path,method='GET',body,csrf=origin)=>fetch(origin+path,{method,redirect:'manual',headers:{cookie,Origin:csrf,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
let id;
try{
 const home=await (await fetch(origin+'/')).text();for(const title of ['Wadiya POS System','AutoCare Mobile Application','Library Management System','Alfa Community Smart IoT Solution'])assert.ok(home.includes(title),title+' remains on homepage');
 const existing=await (await req('/api/admin/projects')).json();for(const slug of ['wadiya-pos','autocare','library','alfa-iot'])assert.ok(existing.some(p=>p.slug===slug&&p.status==='PUBLISHED'),slug+' was imported');
 for(const path of ['/admin/projects','/admin/projects/create'])assert.equal((await req(path)).status,200);
 const input={title:'CMS project verification',slug:'project-verify-'+randomUUID(),category:'Testing',shortDescription:'Temporary verification record',description:'<script>alert("test")</script>\n\nProject description.',coverImage:'',images:[],technologies:['Test'],githubUrl:'',liveUrl:'',featured:false,status:'DRAFT',role:'',features:[],benefits:[]};
 assert.equal((await req('/api/admin/projects','POST',input,'https://attacker.invalid')).status,403);
 const created=await req('/api/admin/projects','POST',input);assert.equal(created.status,201);id=(await created.json()).id;
 assert.equal((await fetch(origin+'/projects/'+input.slug)).status,404);
 assert.equal((await req('/admin/projects/'+id+'/edit')).status,200);
 assert.equal((await req('/api/admin/projects/'+id,'PATCH',{status:'PUBLISHED',featured:true})).status,200);
 const page=await fetch(origin+'/projects/'+input.slug);assert.equal(page.status,200);const html=await page.text();assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>alert("test")</script>'));
 assert.ok((await (await fetch(origin+'/')).text()).includes(input.title));
 assert.equal((await req('/api/admin/projects/'+id,'PATCH',{status:'DRAFT'})).status,200);assert.equal((await fetch(origin+'/projects/'+input.slug)).status,404);
 assert.ok(!(await (await fetch(origin+'/')).text()).includes(input.title));
 console.log('PASS: existing four projects preserved, admin pages, CSRF, create/edit, public details/homepage publishing, escaped content, and unpublishing.');
}finally{if(id){assert.equal((await req('/api/admin/projects/'+id,'DELETE')).status,200);console.log('Temporary project deleted.');}}
